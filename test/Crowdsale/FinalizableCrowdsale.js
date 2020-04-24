const assert = require('assert');
const CrowdsaleContract = artifacts.require("ERC20FinalizableCrowdsale");
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const ERC20 = require('../ERC20/ERC20');
const Crowdsale = require('./Crowdsale');

contract('可终结的众筹', async (accounts) => {
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
    describe("布署可终结的众筹合约...", async () => {
        rate = 100;//兑换比例1ETH:100ERC20
        timestamp = Math.ceil(new Date().getTime() / 1000);
        openingTime = timestamp + 5;
        closingTime = openingTime + 10;
        //测试通用的众筹合约
        const CrowdsaleParam = [
            openingTime,    //众筹开始时间
            closingTime     //众筹结束时间
        ]
        console.log(CrowdsaleParam)
        CrowdsaleInstance = await Crowdsale(accounts, CrowdsaleContract, rate, CrowdsaleParam);
    });
    // describe("测试可终结众筹合约的特殊方法", () => {

    //     it('Testing ERC20TimedCrowdsale openingTime closingTime', async () => {
    //         openingTime = await CrowdsaleInstance.openingTime();
    //         closingTime = await CrowdsaleInstance.closingTime();
    //         assert.ok(openingTime.toString() < closingTime.toString());
    //     });

    //     it('Testing ERC20FinalizableCrowdsale isOpen', async () => {
    //         assert.ok(await CrowdsaleInstance.isOpen());
    //     });

    //     it('Testing ERC20FinalizableCrowdsale hasClosed', async () => {
    //         assert.ok(!await CrowdsaleInstance.hasClosed());
    //     });

    //     it('Testing ERC20FinalizableCrowdsale finalized', async () => {
    //         assert.ok(!await CrowdsaleInstance.finalized());
    //     });

    //     it('Testing ERC20FinalizableCrowdsale finalize', (done) => {
    //         console.log('Waiting for ' + timelock + ' seconds ......')
    //         setTimeout(async () => {
    //             await CrowdsaleInstance.finalize();
    //             assert.ok(await CrowdsaleInstance.finalized());
    //             done();
    //         }, timelock * 1000);
    //     });
    // });
});
