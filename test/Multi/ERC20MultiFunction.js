const assert = require('assert');
const { contract } = require('@openzeppelin/test-environment');
const { expectRevert, ether } = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact('ERC20MultiFunction');
const ERC20 = require('../inc/ERC20');
const Testcase = require('../inc/Testcase');
describe("多功能代币", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        1000,               //初始发行量
        1000000000          //封顶上限
    ];
    //测试ERC20合约的基本方法
    ERC20Instance = await ERC20(ERC20Contract, param);
});

describe("测试", function () {
    it('purchaserEthBalance: ', async function () {
        purchaserEthBalance = await balance.tracker(purchaser, unit = 'ether');
        console.log((await purchaserEthBalance.get(unit = 'ether')).toString());
    });
    //测试发送批准,账户2将账户0的100个代币发送给账户3,再查询账户3的余额为100
    it('发送批准1: transferFrom()', async function () {
        let receipt = await ERC20Instance.transferFrom(owner, purchaser, value, { from: sender });
        assert.equal(value, (await ERC20Instance.balanceOf(purchaser)).toString());
        expectEvent(receipt, 'Transfer', {
            from: owner,
            to: purchaser,
            value: value,
        });
    });
    it('purchaserEthBalance: ', async function () {
        console.log((await purchaserEthBalance.delta(unit = 'ether')).toString());
    });
});

describe("测试多功能代币的特殊方法", function () {
    //测试销毁方法
    it('销毁方法: burn()', async function () {
        await ERC20Instance.burn(value, { from: purchaser });
        assert.equal(0, (await ERC20Instance.balanceOf(purchaser)).toString());
    });
    //测试销毁批准方法,先将账户0的100个代币批准给账户2,然后使用账户2销毁账户0的100个代币
    it('销毁批准方法: burnFrom()', async function () {
        await ERC20Instance.approve(receiver, value, { from: owner });
        await ERC20Instance.burnFrom(owner, value, { from: receiver });
        assert.equal(0, (await ERC20Instance.allowance(owner, receiver)).toString());
    });
    //测试铸币方法
    it('铸币方法: mint()', async function () {
        await ERC20Instance.mint(beneficiary, value, { from: owner });
        assert.equal(value, (await ERC20Instance.balanceOf(beneficiary)).toString());
    });
    //测试返回账户拥有铸币权
    it('返回账户拥有铸币权: isMinter()', async function () {
        assert.ok(await ERC20Instance.isMinter(owner));
    });
    //测试添加铸币者
    it('添加铸币者: addMinter()', async function () {
        await ERC20Instance.addMinter(sender, { from: owner });
        assert.ok(await ERC20Instance.isMinter(sender));
    });
    //测试撤销铸币权
    it('撤销铸币权: renounceMinter()', async function () {
        await ERC20Instance.renounceMinter({ from: sender });
        assert.ok(!await ERC20Instance.isMinter(sender));
    });
    //测试封顶方法
    it('封顶方法: cap()', async function () {
        await expectRevert(ERC20Instance.mint(owner, ether('1000000000'), { from: owner }), 'cap exceeded');
    });
    //测试是暂停者
    it('是暂停者: isPauser()', async function () {
        assert.ok(await ERC20Instance.isPauser(owner));
    });
    //测试添加暂停者
    it('添加暂停者: addPauser()', async function () {
        await ERC20Instance.addPauser(sender, { from: owner });
        assert.ok(await ERC20Instance.isPauser(sender));
    });
    //测试是否已暂停
    it('是否已暂停: paused()', async function () {
        await ERC20Instance.paused();
        assert.ok(!await ERC20Instance.paused());
    });
    //测试暂停方法
    it('暂停方法: pause()', async function () {
        await ERC20Instance.pause({ from: sender });
        assert.ok(await ERC20Instance.paused());
    });
    //测试暂停后发送代币
    it('暂停后发送代币: transfer()', async function () {
        await expectRevert(ERC20Instance.transfer(sender, value, { from: owner }), 'paused');
    });
    //测试恢复方法
    it('恢复方法: unpause()', async function () {
        await ERC20Instance.unpause({ from: sender });
        assert.ok(!await ERC20Instance.paused());
    });
    //测试撤销暂停权
    it('撤销暂停权: renouncePauser()', async function () {
        await ERC20Instance.renouncePauser({ from: sender });
        assert.ok(!await ERC20Instance.isPauser(sender));
    });
});