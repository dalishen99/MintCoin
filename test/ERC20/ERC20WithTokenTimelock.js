const assert = require('assert');
const { contract } = require('@openzeppelin/test-environment');
const { expectRevert, ether, time } = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact('ERC20FixedSupply');
const ERC20WithTokenTimelock = contract.fromArtifact("ERC20WithTokenTimelock");
const ERC20 = require('../inc/ERC20');

totalSupply = 1000000000; //发行总量
lockAmount = 1000;            //锁仓总量
describe("可锁仓代币...", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    ];
    //测试ERC20合约的基本方法
    ERC20Instance = await ERC20(ERC20Contract, param);
});

describe("布署可锁仓代币", function () {
    it('布署合约并且传送代币到锁仓账户', async function () {
        TokenTimelockInstance = await ERC20WithTokenTimelock.new(
            ERC20Instance.address,                        //ERC20代币合约地址
            beneficiary,                                  //受益人为当前账户
            parseInt(await time.latest()) + 5,    //解锁时间戳
            { from: owner }
        );
        await assert.doesNotReject(ERC20Instance.transfer(
            TokenTimelockInstance.address,
            ether(lockAmount.toString()),
            { from: owner }
        ));
    });
});

describe("测试可锁仓代币的特殊方法", function () {
    //测试返回锁仓代币地址
    it('返回锁仓代币地址: token()', async function () {
        assert.equal(ERC20Instance.address, await TokenTimelockInstance.token());
    });
    //测试锁仓数量
    it('锁仓数量: balance()', async function () {
        assert.equal(ether(lockAmount.toString()), (await ERC20Instance.balanceOf(TokenTimelockInstance.address)).toString());
    });
    //测试返回受益人
    it('返回受益人: beneficiary()', async function () {
        assert.equal(beneficiary, await TokenTimelockInstance.beneficiary());
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
        await time.increase(10);
        assert.equal(0, (await ERC20Instance.balanceOf(beneficiary)).toString());
        await assert.doesNotReject(TokenTimelockInstance.release({ from: owner }));
        assert.equal(
            ether(lockAmount.toString()),
            (await ERC20Instance.balanceOf(beneficiary)).toString()
        );
    });
});