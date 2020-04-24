const assert = require('assert');
const ERC20Contract = artifacts.require("ERC20WithMintable");
const ERC20 = require('./ERC20');

contract('可增发代币', accounts => {
    describe("布署合约...",async () => {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            1000000000          //发行总量
        ];
        //测试ERC20合约的基本方法
        ERC20Instance = await ERC20(accounts, ERC20Contract, param);
    });

    describe("测试可增发代币的特殊方法", () => {
        //测试铸币方法
        it('铸币方法: mint()', async () => {
            await ERC20Instance.mint(accounts[4], web3.utils.toWei('100', 'ether'));
            const account4Balance = await ERC20Instance.balanceOf(accounts[4]);
            assert.equal(100, web3.utils.fromWei(account4Balance, 'ether'));
        });
        //测试返回账户拥有铸币权
        it('返回账户拥有铸币权: isMinter()', async () => {
            assert.ok(await ERC20Instance.isMinter(accounts[0]));
        });
        //测试添加铸币者
        it('添加铸币者: addMinter()', async () => {
            await ERC20Instance.addMinter(accounts[1], { from: accounts[0] });
            assert.ok(await ERC20Instance.isMinter(accounts[1]));
        });
        //测试撤销铸币权
        it('撤销铸币权: renounceMinter()', async () => {
            await ERC20Instance.renounceMinter({ from: accounts[1] });
            assert.ok(!await ERC20Instance.isMinter(accounts[1]));
        });
    });
});