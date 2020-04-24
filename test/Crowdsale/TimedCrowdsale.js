const assert = require('assert');
const CrowdsaleContract = artifacts.require("ERC20TimedCrowdsale");
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const Crowdsale = require('./Crowdsale');

contract('有时限的众筹', accounts => {
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
                Math.ceil(new Date().getTime() / 1000) + 5,   //众筹开始时间
                Math.ceil(new Date().getTime() / 1000) + 15   //众筹结束时间
            );
            //在布署之后必须将发送者账户中的代币批准给众筹合约
            await ERC20Instance.approve(CrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
        });
        //测试通用的众筹合约
        await Crowdsale(accounts, rate, true);
    });
    describe("测试有时限众筹合约的特殊方法", function() {
        //测试开始时间
        it('开始时间: openingTime()', async function() {
            assert.doesNotReject(await CrowdsaleInstance.openingTime());
        });
        //测试结束时间
        it('结束时间: closingTime()', async function() {
            assert.doesNotReject(await CrowdsaleInstance.closingTime());
        });
        //测试众筹是否开始,未开始
        it('众筹未开始: isOpen()', async function() {
            assert.ok(!await CrowdsaleInstance.isOpen());
        });
        //测试众筹是否关闭,未关闭
        it('众筹未关闭: hasClosed()', async function() {
            assert.ok(!await CrowdsaleInstance.hasClosed());
        });
        //重新测试购买代币方法
        it('重新测试购买代币方法: buyTokens()', function (done) {
            console.log('  Waiting for 10 seconds ......')
            setTimeout(async function () {
                await CrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') });
                assert.equal(10 * rate, web3.utils.fromWei(await ERC20Instance.balanceOf(accounts[2]), 'ether'));
                done();
            }, 10000);
        });
        //重新测试众筹收入
        it('重新测试众筹收入: weiRaised()', async function () {
            assert.equal(10, web3.utils.fromWei(await CrowdsaleInstance.weiRaised(), 'ether'));
        });
        //重新测试众筹是否开始,已开始
        it('重新众筹已开始: isOpen()', async function() {
            assert.ok(await CrowdsaleInstance.isOpen());
        });
        //测试等待关闭
        it('等待关闭: hasClosed()', (done) => {
            console.log('  Waiting for 10 seconds ......')
            setTimeout(async function() {
                assert.rejects(CrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') }),/not open/);
                assert.ok(await CrowdsaleInstance.hasClosed());
                done();
            }, 10000);
        });
    });

});
