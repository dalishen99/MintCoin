const assert = require('assert');
const ERC20Contract = artifacts.require("ERC20WithCapped"); 
const ERC20 = require('./ERC20');

contract('有封顶代币', accounts => {
    describe("布署合约...",async () => {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            1000,               //初始发行量
            1000000000          //封顶上限
        ];
        //测试ERC20合约的基本方法
        ERC20Instance = await ERC20(accounts, ERC20Contract, param);
    });
    describe("测试有封顶代币的特殊方法", () => {
        //测试封顶方法
        it('封顶方法: cap()', async () => {
            await assert.rejects(ERC20Instance.mint(accounts[0],web3.utils.toWei('1000000000','ether')),/cap exceeded/);
        });
    });
});
