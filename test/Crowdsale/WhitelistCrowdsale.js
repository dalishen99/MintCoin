const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("ERC20WhitelistCrowdsale");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const Crowdsale = require('../inc/Crowdsale');
const ERC20 = require('../inc/ERC20');

totalSupply = 1000000000;//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
value = ether('10');
eth = ether('10');
rate = 100;//兑换比例1ETH:100ERC20

describe("布署ERC20合约...", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    ];
    ERC20Instance = await ERC20(ERC20Contract, param);
});
describe("布署有封顶众筹合约...", async function () {
    it('布署合约并且批准给众筹账户', async function () {
        CrowdsaleInstance = await CrowdsaleContract.new(
            rate,                               //兑换比例1ETH:100ERC20
            sender,                        //接收ETH受益人地址
            ERC20Instance.address,              //代币地址
            owner,                        //代币从这个地址发送
            { from: owner }
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20Instance.approve(CrowdsaleInstance.address, ether(totalSupply.toString()), { from: owner });
    });
    //测试通用的众筹合约
    await Crowdsale(rate, true);
});
describe("测试有白名单的众筹合约的特殊方法", function () {
    //测试账户不在白名单
    it('账户不在白名单: isWhitelisted()', async function () {
        assert.ok(!await CrowdsaleInstance.isWhitelisted(sender));
        assert.ok(!await CrowdsaleInstance.isWhitelisted(beneficiary));
    });
    //测试添加到白名单
    it('添加到白名单: addWhitelisted()', async function () {
        assert.doesNotReject(CrowdsaleInstance.addWhitelisted(sender, { from: owner }));
        assert.doesNotReject(CrowdsaleInstance.addWhitelisted(beneficiary, { from: owner }));
    });
    //测试账户在白名单
    it('账户在白名单: isWhitelisted()', async function () {
        assert.ok(await CrowdsaleInstance.isWhitelisted(sender));
        assert.ok(await CrowdsaleInstance.isWhitelisted(beneficiary));
    });
    //重新测试购买代币方法
    it('重新测试购买代币方法: buyTokens()', async function () {
        assert.doesNotReject(CrowdsaleInstance.buyTokens(beneficiary, { value: eth, from: beneficiary }));
    });
    //重新测试购买者账户余额
    it('重新测试购买者账户余额: balanceOf()', async function () {
        assert.equal(ether((10 * rate).toString()).toString(), (await ERC20Instance.balanceOf(beneficiary)).toString());
    });
    //重新测试众筹收入
    it('重新测试众筹收入: weiRaised()', async function () {
        assert.equal(eth.toString(), (await CrowdsaleInstance.weiRaised()).toString());
    });
    //测试账户移除白名单
    it('账户移除白名单: removeWhitelisted()', async function () {
        assert.doesNotReject(CrowdsaleInstance.removeWhitelisted(sender, { from: owner }));
        assert.ok(!await CrowdsaleInstance.isWhitelisted(sender));
    });
    //测试撤销自己的白名单
    it('撤销自己的白名单: renounceWhitelisted()', async function () {
        assert.doesNotReject(CrowdsaleInstance.renounceWhitelisted({ from: beneficiary }));
        assert.ok(!await CrowdsaleInstance.isWhitelisted(beneficiary));
    });
    //测试添加白名单管理员
    it('添加白名单管理员: addWhitelistAdmin()', async function () {
        assert.doesNotReject(CrowdsaleInstance.addWhitelistAdmin(sender, { from: owner }));
        assert.doesNotReject(CrowdsaleInstance.addWhitelistAdmin(beneficiary, { from: owner }));
    });
    //测试账户是白名单管理员
    it('账户是白名单管理员: isWhitelistAdmin()', async function () {
        assert.ok(await CrowdsaleInstance.isWhitelistAdmin(sender));
        assert.ok(await CrowdsaleInstance.isWhitelistAdmin(beneficiary));
    });
    //测试撤销自己的白名单管理权
    it('撤销自己的白名单管理权: renounceWhitelistAdmin()', async function () {
        assert.doesNotReject(CrowdsaleInstance.renounceWhitelistAdmin({ from: beneficiary }));
        assert.ok(!await CrowdsaleInstance.isWhitelistAdmin(beneficiary));
    });
});
