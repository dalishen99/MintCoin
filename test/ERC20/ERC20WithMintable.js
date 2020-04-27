const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { expectRevert, ether } = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact('ERC20WithMintable');
const ERC20 = require('../inc/ERC20');

describe("可增发代币", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        1000000000          //发行总量
    ];
    //测试ERC20合约的基本方法
    ERC20Instance = await ERC20(ERC20Contract, param);
});

describe("测试可增发代币的特殊方法", function () {
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
});