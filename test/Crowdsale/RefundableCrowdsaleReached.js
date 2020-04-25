const assert = require('assert');
const CrowdsaleContract = artifacts.require("ERC20RefundableCrowdsale");
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const ERC20 = require('../ERC20/ERC20');
const Crowdsale = require('./Crowdsale');

contract('不成功退款的众筹(众筹成功)', accounts => {
    totalSupply = 1000000000;//发行总量
    let goal;
    before("布署ERC20合约...", async function() {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        ERC20Instance = await ERC20Contract.new(...param);
    });
    describe("不成功退款的众筹合约(众筹成功)...", async function() {
        rate = 100;//兑换比例1ETH:100ERC20
        goal = 10;
        it('布署合约并且批准给众筹账户', async function() {
            CrowdsaleInstance = await CrowdsaleContract.new(
                rate,                               //兑换比例1ETH:100ERC20
                accounts[1],                        //接收ETH受益人地址
                ERC20Instance.address,              //代币地址
                accounts[0],                        //代币从这个地址发送
                Math.ceil(new Date().getTime() / 1000) + 5,   //众筹开始时间
                Math.ceil(new Date().getTime() / 1000) + 15,  //众筹结束时间
                web3.utils.toWei(goal.toString(), 'ether')    //众筹目标
            );
            //在布署之后必须将发送者账户中的代币批准给众筹合约
            await ERC20Instance.approve(CrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
        });
        //测试通用的众筹合约
        await Crowdsale(accounts, rate, true);
    });
    describe("测试不成功退款众筹合约的特殊方法(众筹成功)", function() {
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
            setTimeout(function() {
                assert.doesNotReject(CrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') }));
                done();
            }, 10000);
        });
        //重新测试众筹是否开始,已开始
        it('重新众筹已开始: isOpen()', async function() {
            assert.ok(await CrowdsaleInstance.isOpen());
        });
        //测试众筹结束前购买账户余额为0
        it('众筹结束前购买账户余额为0: balanceOf()', async function() {
            assert.equal(0 * rate, web3.utils.fromWei(await ERC20Instance.balanceOf(accounts[2]), 'ether'));
        });
        //重新测试众筹收入
        it('重新测试众筹收入: weiRaised()', async function () {
            assert.equal(10, web3.utils.fromWei(await CrowdsaleInstance.weiRaised(), 'ether'));
        });
        //测试众筹是否关闭,未关闭
        it('众筹未关闭: hasClosed()', async function() {
            assert.ok(!await CrowdsaleInstance.hasClosed());
        });
        //测试购买账户被锁定的余额
        it('购买账户被锁定的余额: balanceOf()', async function() {
            assert.equal(10 * rate, web3.utils.fromWei(await CrowdsaleInstance.balanceOf(accounts[2]), 'ether'));
        });
        //测试众筹目标
        it('众筹目标: goal()', async function() {
            assert.equal(goal, web3.utils.fromWei(await CrowdsaleInstance.goal(), 'ether'));
        });
        //测试众筹没有结束
        it('众筹没有结束: finalized()', async function() {
            assert.ok(!await CrowdsaleInstance.finalized());
        });
        //测试时间到达后触发结束方法
        it('时间到达后触发结束方法: finalize()', (done) => {
            console.log('  Waiting for 10 seconds ......')
            setTimeout(async function() {
                assert.doesNotReject(CrowdsaleInstance.finalize());
                done();
            }, 10000);
        });
        //测试众筹已经结束
        it('众筹已经结束: finalized()', async function() {
            assert.ok(await CrowdsaleInstance.finalized());
        });
        //测试达到众筹目标
        it('达到众筹目标: goalReached()', async function() {
            assert.ok(await CrowdsaleInstance.goalReached());
        });
        //测试众筹成功后可以提款
        it('众筹成功后可以提款: withdrawTokens()', async function() {
            await assert.doesNotReject(CrowdsaleInstance.withdrawTokens(accounts[2]));
        });
        //测试众筹成功后不能退回ETH
        it('众筹成功后不能退回ETH: claimRefund()', async function() {
            await assert.rejects(CrowdsaleInstance.claimRefund(accounts[2]), /goal reached/);
        });
    });
});
