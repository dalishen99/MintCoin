const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("ERC20IndividuallyCappedCrowdsale");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const Crowdsale = require('../inc/Crowdsale');
const ERC20 = require('../inc/ERC20');

totalSupply = 1000000000;//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
value = ether('10');
eth = ether('10');
rate = 100;//兑换比例1ETH:100ERC20
describe("有配额的众筹", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    ];
    ERC20Instance = await ERC20(ERC20Contract, param);
});
describe("布署有配额众筹合约...", async function () {
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
describe("测试有配额众筹合约的特殊方法", function () {
    //测试设置配额方法
    it('设置配额方法: setCap()', async function () {
        assert.doesNotReject(CrowdsaleInstance.setCap(beneficiary, eth, { from: owner }));
    });
    //测试获取账户配额方法
    it('获取账户配额方法: getCap()', async function () {
        assert.equal(eth.toString(), (await CrowdsaleInstance.getCap(beneficiary)).toString());
    });
    //重新测试购买代币方法
    it('重新测试购买代币方法: buyTokens()', async function () {
        await CrowdsaleInstance.buyTokens(beneficiary, { value: eth, from: beneficiary });
        assert.equal(ether((10 * rate).toString()).toString(), (await ERC20Instance.balanceOf(beneficiary)).toString());
    });
    //重新测试众筹收入
    it('重新测试众筹收入: weiRaised()', async function () {
        assert.equal(eth.toString(), (await CrowdsaleInstance.weiRaised()).toString());
    });
    //测试获取账户贡献方法
    it('获取账户贡献方法: getContribution()', async function () {
        assert.equal(eth.toString(), (await CrowdsaleInstance.getContribution(beneficiary)).toString());
    });
    //测试添加配额管理员
    it('添加配额管理员: addCapper()', async function () {
        assert.doesNotReject(CrowdsaleInstance.addCapper(sender, { from: owner }));
    });
    //测试账户是配额管理员
    it('账户是配额管理员: isCapper()', async function () {
        assert.ok(await CrowdsaleInstance.isCapper(sender));
    });
    //测试撤销配额管理员
    it('撤销配额管理员: renounceCapper()', async function () {
        await CrowdsaleInstance.renounceCapper({ from: sender });
        assert.ok(!await CrowdsaleInstance.isCapper(sender));
    });
});