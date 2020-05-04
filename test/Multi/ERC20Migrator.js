const assert = require('assert');
const { contract, accounts, web3 } = require('@openzeppelin/test-environment');
const { ether, time, expectEvent } = require('@openzeppelin/test-helpers');

const ERC20FixedSupply = contract.fromArtifact("ERC20FixedSupply");
const ERC20Migrator = contract.fromArtifact("ERC20MigratorContract");
const ERC20WithMintable = contract.fromArtifact("ERC20WithMintable");

const ERC20 = require('../inc/ERC20');
const totalSupply = '1000000000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '100';
//代币迁移合约
describe("代币迁移合约", function () {
    it('布署旧代币合约', async function () {
        ERC20Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        ERC20Instance = await ERC20FixedSupply.new(...ERC20Param, { from: owner });
    });
    it('布署代币迁移合约', async function () {
        ERC20MigratorInstance = await ERC20Migrator.new(
            ERC20Instance.address,        //旧代币合约地址
            { from: owner });
    });
    it('布署新代币合约', async function () {
        ERC20WithMintableParam = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            0                   //发行总量
        ];
        ERC20WithMintableInstance = await ERC20WithMintable.new(...ERC20WithMintableParam, { from: owner });
    });
});
describe("布署后首先执行", function () {
    it('将代币批准给众筹合约', async function () {
        await ERC20Instance.approve(ERC20MigratorInstance.address, ether(totalSupply.toString()), { from: owner });
    });
    it('添加众筹合约的铸造权: addMinter()', async function () {
        await ERC20WithMintableInstance.addMinter(ERC20MigratorInstance.address, { from: owner });
    });
    it('撤销发送者的铸造权: renounceMinter()', async function () {
        let receipt = await ERC20WithMintableInstance.renounceMinter({ from: owner });
        expectEvent(receipt, 'MinterRemoved', {
            account: owner
        });
    });
});
describe("测试ERC20合约基本信息", function () {
    ERC20.detail();
});
describe("迁移合约基本信息", function () {
    it('旧合约地址: legacyToken()', async function () {
        assert.equal(ERC20Instance.address, await ERC20MigratorInstance.legacyToken());
    });
});
describe("将旧合约代币分配给一些账户", function () {
    ERC20.transfer(owner, sender, (EthValue*5).toString(), '代币发送给sender');
    ERC20.transfer(owner, receiver, (EthValue*10).toString(), '代币发送给receiver');
    ERC20.transfer(owner, purchaser, (EthValue*15).toString(), '代币发送给purchaser');
    ERC20.transfer(owner, beneficiary, (EthValue*25).toString(), '代币发送给beneficiary');
});
describe("开始迁移", function () {
    it('记录owner旧合约余额: balanceOf()', async function () {
        ownerBalanceBefore = await ERC20Instance.balanceOf(owner);
    });
    it('开始迁移: beginMigration()', async function () {
        await ERC20MigratorInstance.beginMigration(ERC20WithMintableInstance.address,{from:owner});
    });
    it('验证新约地址: newToken()', async function () {
        assert.equal(ERC20WithMintableInstance.address, await ERC20MigratorInstance.newToken());
    });
    it('迁移owner账户全部余额方法: migrateAll()', async function () {
        await ERC20MigratorInstance.migrateAll(owner);
    });
    it('验证owner迁移后新合约余额: balanceOf()', async function () {
        let ownerBalanceAfter = await ERC20WithMintableInstance.balanceOf(owner);
        assert.equal(ownerBalanceBefore.toString(), ownerBalanceAfter.toString());
    });
    ERC20.balanceOf('0', owner, '验证迁移后旧合约余额');
});
