const CrowdsaleContract = artifacts.require("ERC20AllowanceCrowdsale");
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const ERC20 = require('../ERC20/ERC20');
const Crowdsale = require('./Crowdsale');

contract('通用的众筹合约', accounts => {
    totalSupply = 1000000000;//发行总量
    describe("布署ERC20合约...", async () => {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        //测试ERC20合约的基本方法
        ERC20Instance = await ERC20(accounts, ERC20Contract, param);
    });
    describe("布署通用的众筹合约...", async () => {
        rate = 100;//兑换比例1ETH:100ERC20
        //测试通用的众筹合约
        CrowdsaleInstance = await Crowdsale(accounts, CrowdsaleContract, rate, []);
    });
});
