const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { expectEvent, expectRevert, ether, time, constants } = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const ERC20WithTokenVesting = contract.fromArtifact("ERC20WithTokenVesting");
const ERC20 = require('../inc/ERC20');
//分期释放合约
const totalSupply = '100000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
lockAmount = '24000'; //锁仓数额

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
    ERC20.detail();
});
describe("分期释放合约", function () {
    it('布署分期释放合约', async function () {
        start = parseInt(await time.latest()) + 60;
        cliffDuration = '3600';
        duration = '86400';
        revocable = true;
        VestParam = [
            beneficiary,   //受益人账户
            start,         //开始时间
            cliffDuration, //断崖时间
            duration,      //持续时间
            revocable      //是否可撤销
        ]
        ERC20WithTokenVestingInstance = await ERC20WithTokenVesting.new(...VestParam, { from: owner });
    });
    it('传送代币到分期释放合约', async function () {
        let receipt = await ERC20Instance.transfer(ERC20WithTokenVestingInstance.address, ether(lockAmount), { from: owner });
        expectEvent(receipt, 'Transfer', {
            from: owner,
            to: ERC20WithTokenVestingInstance.address,
            value: ether(lockAmount),
        });
    });
});
describe("测试分期释放合约的特殊方法", function () {
    //测试返回断崖时间
    it('返回受益人地址: beneficiary()', async function () {
        assert.equal(beneficiary, await ERC20WithTokenVestingInstance.beneficiary());
    });
    //测试返回开始时间
    it('返回开始时间: start()', async function () {
        assert.equal(start, (await ERC20WithTokenVestingInstance.start()).toString());
    });
    //测试返回断崖时间
    it('返回断崖时间: cliff()', async function () {
        assert.equal(parseInt(start) + parseInt(cliffDuration), (await ERC20WithTokenVestingInstance.cliff()).toString());
    });
    //测试返回持续时间
    it('返回持续时间: duration()', async function () {
        assert.equal(VestParam[3], (await ERC20WithTokenVestingInstance.duration()).toString());
    });
    //返回能否撤销
    it('返回能否撤销: revocable()', async function () {
        assert.equal(VestParam[4].toString(), (await ERC20WithTokenVestingInstance.revocable()).toString());
    });
    //时间流逝
    it('推进到断崖时间', async function () {
        await time.increaseTo(parseInt(start) + parseInt(cliffDuration));
    });
    //测试释放方法
    it('释放方法: release()', async function () {
        let receipt = await ERC20WithTokenVestingInstance.release(ERC20Instance.address);
        amount = lockAmount * ((await time.latest() - start) / duration);
        expectEvent(receipt, 'TokensReleased', {
            token: ERC20Instance.address,
            amount: ether(amount.toString())
        });
    });
    //测试返回已经释放数量
    it('返回已经释放数量: released()', async function () {
        assert.equal(ether(amount.toString()), (await ERC20WithTokenVestingInstance.released(ERC20Instance.address)).toString());
    });
    //测试返回是否撤销
    it('返回没有撤销: revoked()', async function () {
        assert.ok(!await ERC20WithTokenVestingInstance.revoked(ERC20Instance.address));
    });
    //测试撤销方法
    it('撤销方法: revoke()', async function () {
        await ERC20WithTokenVestingInstance.revoke(ERC20Instance.address,{from:owner});
    });
    //测试返回是否撤销
    it('返回已经撤销: revoked()', async function () {
        assert.ok(await ERC20WithTokenVestingInstance.revoked(ERC20Instance.address));
    });
});