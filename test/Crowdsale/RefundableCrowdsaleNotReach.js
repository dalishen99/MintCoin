const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether, time } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("ERC20RefundableCrowdsale");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const Crowdsale = require('../inc/Crowdsale');
const ERC20 = require('../inc/ERC20');

totalSupply = 1000000000;//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
value = ether('10');
eth = ether('10');
rate = 100;//兑换比例1ETH:100ERC20
goal = '20';

describe("布署ERC20合约...", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    ];
    ERC20Instance = await ERC20(ERC20Contract, param);
});
describe("不成功退款的众筹合约(众筹不成功)...", async function () {
    it('布署合约并且批准给众筹账户', async function () {
        CrowdsaleInstance = await CrowdsaleContract.new(
            rate,                               //兑换比例1ETH:100ERC20
            sender,                        //接收ETH受益人地址
            ERC20Instance.address,              //代币地址
            owner,                        //代币从这个地址发送
            parseInt(await time.latest()) + 60,   //众筹开始时间
            parseInt(await time.latest()) + 600,  //众筹结束时间
            ether(goal),                                   //众筹目标
            { from: owner }
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20Instance.approve(CrowdsaleInstance.address, ether(totalSupply.toString()), { from: owner });
    });
    //测试通用的众筹合约
    await Crowdsale(rate, true);
});
describe("测试不成功退款众筹合约的特殊方法(众筹不成功)", function () {
    //测试开始时间
    it('开始时间: openingTime()', async function () {
        assert.doesNotReject(CrowdsaleInstance.openingTime());
    });
    //测试结束时间
    it('结束时间: closingTime()', async function () {
        assert.doesNotReject(CrowdsaleInstance.closingTime());
    });
    //测试众筹是否开始,未开始
    it('众筹未开始: isOpen()', async function () {
        assert.ok(!await CrowdsaleInstance.isOpen());
    });
    //测试众筹是否关闭,未关闭
    it('众筹未关闭: hasClosed()', async function () {
        assert.ok(!await CrowdsaleInstance.hasClosed());
    });
    //重新测试购买代币方法
    it('重新测试购买代币方法: buyTokens()', async function () {
        await time.increase(120);
        assert.doesNotReject(CrowdsaleInstance.buyTokens(beneficiary, { value: eth, from: beneficiary }));
    });
    //重新测试众筹是否开始,已开始
    it('重新众筹已开始: isOpen()', async function () {
        assert.ok(await CrowdsaleInstance.isOpen());
    });
    //测试众筹结束前购买账户余额为0
    it('众筹结束前购买账户余额为0: balanceOf()', async function () {
        assert.equal(0, (await ERC20Instance.balanceOf(beneficiary)).toString());
    });
    //重新测试众筹收入
    it('重新测试众筹收入: weiRaised()', async function () {
        assert.equal(eth.toString(), (await CrowdsaleInstance.weiRaised()).toString());
    });
    //测试众筹是否关闭,未关闭
    it('众筹未关闭: hasClosed()', async function () {
        assert.ok(!await CrowdsaleInstance.hasClosed());
    });
    //测试购买账户被锁定的余额
    it('购买账户被锁定的余额: balanceOf()', async function () {
        assert.equal(ether((10 * rate).toString()).toString(), (await CrowdsaleInstance.balanceOf(beneficiary)).toString());
    });
    //测试众筹目标
    it('众筹目标: goal()', async function () {
        assert.equal(ether(goal).toString(), (await CrowdsaleInstance.goal()).toString());
    });
    //测试众筹没有结束
    it('众筹没有结束: finalized()', async function () {
        assert.ok(!await CrowdsaleInstance.finalized());
    });
    //测试时间到达后触发结束方法
    it('时间到达后触发结束方法: finalize()', async function () {
        await time.increase(600);
        assert.doesNotReject(CrowdsaleInstance.finalize());
    });
    //测试众筹已经结束
    it('众筹已经结束: finalized()', async function () {
        assert.ok(await CrowdsaleInstance.finalized());
    });
    //测试未达到众筹目标
    it('未达到众筹目标: goalReached()', async function () {
        assert.ok(!await CrowdsaleInstance.goalReached());
    });
    //测试众筹不成功不可以提款
    it('众筹不成功不可以提款: withdrawTokens()', async function () {
        await assert.rejects(CrowdsaleInstance.withdrawTokens(beneficiary), /goal not reached/);
    });
    //测试众筹不成功退回ETH
    it('众筹不成功退回ETH: claimRefund()', async function () {
        await assert.doesNotReject(CrowdsaleInstance.claimRefund(beneficiary));
    });
});
