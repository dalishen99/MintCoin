const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { expectEvent, expectRevert, ether, time, constants } = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const ERC20WithTokenTimelock = contract.fromArtifact("ERC20WithTokenTimelock");
const ERC20 = require('../inc/ERC20');
//可锁仓代币
const totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
lockAmount = '1000'; 

describe("固定总量代币", function () {
    it('布署代币合约', async function () {
        ERC20Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply,        //发行总量
        ];
        ERC20Instance = await ERC20Contract.new(...ERC20Param, { from: owner });
    });
});
describe("测试ERC20合约基本信息", function () {
    ERC20.datail();
});
describe("测试ERC20合约的标准方法", async function () {
    ERC20.balanceOf(totalSupply, owner, '创建者账户余额');
    ERC20.transfer(owner, constants.ZERO_ADDRESS, EthValue, '代币发送,0地址错误', true, /ERC20: transfer to the zero address/);
    ERC20.transfer(owner, receiver, EthValue, '代币发送');
    ERC20.balanceOf(EthValue, receiver, '接收者账户余额');//receiver.balance = EthValue
    ERC20.approve(owner, constants.ZERO_ADDRESS, EthValue, '批准代币,0地址错误', true, /ERC20: approve to the zero address/);
    ERC20.approve(receiver, purchaser, EthValue, '批准代币');
    ERC20.allowance(receiver, purchaser, EthValue, '验证批准数额');//receiver=>purchaser = EthValue
    ERC20.transferFrom(receiver, purchaser, beneficiary, EthValue, '批准发送');//beneficiary.balance = EthValue
    ERC20.balanceOf(EthValue, beneficiary, '接收者账户余额');//receiver.balance = EthValue
    ERC20.transferFrom(receiver, purchaser, beneficiary, EthValue, '超额批准发送', true, /ERC20: transfer amount exceeds balance/);
    ERC20.allowance(receiver, purchaser, '0', '批准额归零');//receiver=>purchaser = 0
    ERC20.increaseAllowance(receiver, purchaser, EthValue, '增加批准额');
    ERC20.allowance(receiver, purchaser, EthValue, '验证批准数额');//receiver=>purchaser = EthValue
    ERC20.decreaseAllowance(receiver, purchaser, EthValue, '减少批准额');
    ERC20.allowance(receiver, purchaser, '0', '批准数额归零');//receiver=>purchaser = 0
    ERC20.decreaseAllowance(receiver, purchaser, EthValue, '超额减少批准额', true, /ERC20: decreased allowance below zero/);
});
describe("锁仓合约", function () {
    it('布署锁仓合约', async function () {
        releaseTime = parseInt(await time.latest()) + 60;
        const param = [
            ERC20Instance.address,   //ERC20代币合约地址
            receiver,             //受益人为当前账户
            releaseTime              //解锁时间戳
        ]
        TokenTimelockInstance = await ERC20WithTokenTimelock.new(...param, { from: owner });
    });
    it('传送代币到锁仓账户', async function () {
        let receipt = await ERC20Instance.transfer(TokenTimelockInstance.address, ether(lockAmount), { from: owner });
        expectEvent(receipt, 'Transfer', {
            from: owner,
            to: TokenTimelockInstance.address,
            value: ether(lockAmount),
        });
    });
});
describe("测试可锁仓代币的特殊方法", function () {
    //测试返回锁仓代币地址
    it('返回锁仓代币地址: token()', async function () {
        assert.equal(ERC20Instance.address, await TokenTimelockInstance.token());
    });
    //测试锁仓数量
    it('锁仓数量: balance()', async function () {
        assert.equal(ether(lockAmount), (await ERC20Instance.balanceOf(TokenTimelockInstance.address)).toString());
    });
    //测试返回受益人
    it('返回受益人: beneficiary()', async function () {
        assert.equal(receiver, await TokenTimelockInstance.beneficiary());
    });
    //测试返回解锁时间
    it('返回解锁时间: releaseTime()', async function () {
        const releaseTime = await TokenTimelockInstance.releaseTime();
        assert.ok(Math.ceil(new Date().getTime() / 1000) < releaseTime.toString());
    });
    //测试未到时间不能解锁
    it('未到时间不能解锁: rejects release()', async function () {
        await expectRevert(TokenTimelockInstance.release(), 'current time is before release time');
    });
    //测试解锁方法
    it('解锁方法: release()', async function () {
        await time.increaseTo(releaseTime + 1);
        assert.equal('0', (await ERC20Instance.balanceOf(receiver)).toString());
        TokenTimelockInstance.release({ from: owner });
        assert.equal(
            ether(lockAmount),
            (await ERC20Instance.balanceOf(receiver)).toString()
        );
    });
});