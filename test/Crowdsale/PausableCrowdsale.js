const assert = require('assert');
const CrowdsaleContract = artifacts.require("ERC20PausableCrowdsale");
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const Crowdsale = require('./Crowdsale');

contract('可暂停的众筹', accounts => {
    totalSupply = 1000000000;//发行总量
    before("布署ERC20合约...", async function() {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        ERC20Instance = await ERC20Contract.new(...param);
    });
    describe("布署可暂停众筹合约...", async function() {
        rate = 100;//兑换比例1ETH:100ERC20
        it('布署合约并且批准给众筹账户', async function() {
            CrowdsaleInstance = await CrowdsaleContract.new(
                rate,                               //兑换比例1ETH:100ERC20
                accounts[1],                        //接收ETH受益人地址
                ERC20Instance.address,              //代币地址
                accounts[0],                        //代币从这个地址发送
            );
            //在布署之后必须将发送者账户中的代币批准给众筹合约
            await ERC20Instance.approve(CrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
        });
        //测试通用的众筹合约
        await Crowdsale(accounts, rate, false);
    });
    describe("测试可暂停众筹合约的特殊方法", function() {
        //测试添加暂停管理员
        it('添加暂停管理员: addPauser()', async function() {
            assert.doesNotReject(CrowdsaleInstance.addPauser(accounts[1], { from: accounts[0] }));
        });
        //测试账户拥有暂停权
        it('账户拥有暂停权: isPauser()', async function() {
            assert.ok(await CrowdsaleInstance.isPauser(accounts[1]));
        });
        //测试是否已暂停,未暂停
        it('是否已暂停,未暂停: paused()', async function() {
            assert.ok(!await CrowdsaleInstance.paused());
        });
        //测试暂停方法
        it('暂停方法: pause()', async function() {
            assert.doesNotReject(CrowdsaleInstance.pause({ from: accounts[1] }));
        });
        //测试是否已暂停,已暂停
        it('是否已暂停,已暂停: paused()', async function() {
            assert.ok(await CrowdsaleInstance.paused());
        });
        //测试恢复合约
        it('恢复合约: unpause()', async function() {
            assert.doesNotReject(CrowdsaleInstance.unpause({ from: accounts[1] }));
        });
        //测试是否已暂停,未暂停
        it('是否已暂停,未暂停: paused()', async function() {
            assert.ok(!await CrowdsaleInstance.paused());
        });
        //测试撤销暂停管理员
        it('撤销暂停管理员: renouncePauser()', async function() {
            assert.doesNotReject(CrowdsaleInstance.renouncePauser({ from: accounts[1] }));
        });
        //测试账户没有暂停权
        it('账户没有暂停权: isPauser()', async function() {
            assert.ok(!await CrowdsaleInstance.isPauser(accounts[1]));
        });
    });
});
