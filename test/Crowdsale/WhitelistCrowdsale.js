const assert = require('assert');
const CrowdsaleContract = artifacts.require("ERC20WhitelistCrowdsale");
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const Crowdsale = require('./Crowdsale');

contract('白名单众筹', accounts => {
    totalSupply = 1000000000;//发行总量
    before("布署ERC20合约...", async function() {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        ERC20Instance = await ERC20Contract.new(...param);
    });
    describe("布署有封顶众筹合约...", async function() {
        rate = 100;//兑换比例1ETH:100ERC20
        it('布署合约并且批准给众筹账户', async function() {
            CrowdsaleInstance = await CrowdsaleContract.new(
                rate,                               //兑换比例1ETH:100ERC20
                accounts[1],                        //接收ETH受益人地址
                ERC20Instance.address,              //代币地址
                accounts[0],                        //代币从这个地址发送
            );
            //在布署之后必须将发送者账户中的代币批准给众筹合约
            await ERC20Instance.approve(CrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
        });
        //测试通用的众筹合约
        await Crowdsale(accounts, rate, true);
    });
    describe("测试有封顶众筹合约的特殊方法", function() {
        //测试账户不在白名单
        it('账户不在白名单: isWhitelisted()', async function() {
            assert.ok(!await CrowdsaleInstance.isWhitelisted(accounts[1]));
            assert.ok(!await CrowdsaleInstance.isWhitelisted(accounts[2]));
        });
        //测试添加到白名单
        it('添加到白名单: addWhitelisted()', async function() {
            assert.doesNotReject(CrowdsaleInstance.addWhitelisted(accounts[1]));
            assert.doesNotReject(CrowdsaleInstance.addWhitelisted(accounts[2]));
        });
        //测试账户在白名单
        it('账户在白名单: isWhitelisted()', async function() {
            assert.ok(await CrowdsaleInstance.isWhitelisted(accounts[1]));
            assert.ok(await CrowdsaleInstance.isWhitelisted(accounts[2]));
        });
        //重新测试购买代币方法
        it('重新测试购买代币方法: buyTokens()', async function() {
            await CrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') });
            assert.equal(10 * rate, web3.utils.fromWei(await ERC20Instance.balanceOf(accounts[2]), 'ether'));
        });
        //重新测试众筹收入
        it('重新测试众筹收入: weiRaised()', async function () {
            assert.equal(10, web3.utils.fromWei(await CrowdsaleInstance.weiRaised(), 'ether'));
        });
        //测试账户移除白名单
        it('账户移除白名单: removeWhitelisted()', async function() {
            assert.doesNotReject(CrowdsaleInstance.removeWhitelisted(accounts[1]));
            assert.ok(!await CrowdsaleInstance.isWhitelisted(accounts[1]));
        });
        //测试撤销自己的白名单
        it('撤销自己的白名单: renounceWhitelisted()', async function() {
            assert.doesNotReject(CrowdsaleInstance.renounceWhitelisted({ from: accounts[2] }));
            assert.ok(!await CrowdsaleInstance.isWhitelisted(accounts[2]));
        });
        //测试添加白名单管理员
        it('添加白名单管理员: addWhitelistAdmin()', async function() {
            assert.doesNotReject(CrowdsaleInstance.addWhitelistAdmin(accounts[1]));
            assert.doesNotReject(CrowdsaleInstance.addWhitelistAdmin(accounts[2]));
        });
        //测试账户是白名单管理员
        it('账户是白名单管理员: isWhitelistAdmin()', async function() {
            assert.ok(await CrowdsaleInstance.isWhitelistAdmin(accounts[1]));
            assert.ok(await CrowdsaleInstance.isWhitelistAdmin(accounts[2]));
        });
        //测试撤销自己的白名单管理权
        it('撤销自己的白名单管理权: renounceWhitelistAdmin()', async function() {
            assert.doesNotReject(CrowdsaleInstance.renounceWhitelistAdmin({ from: accounts[2] }));
            assert.ok(!await CrowdsaleInstance.isWhitelistAdmin(accounts[2]));
        });
    });
});
