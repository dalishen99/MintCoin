const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("ERC20PausableCrowdsale");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const Crowdsale = require('../inc/Crowdsale');
const ERC20 = require('../inc/ERC20');

totalSupply = 1000000000;//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
value = ether('10');
eth = ether('10');
rate = 100;//兑换比例1ETH:100ERC20
describe("可暂停的众筹", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    ];
    ERC20Instance = await ERC20(ERC20Contract, param);
});
describe("布署可暂停众筹合约...", async function () {
    it('布署合约并且批准给众筹账户', async function () {
        CrowdsaleInstance = await CrowdsaleContract.new(
            rate,                               //兑换比例1ETH:100ERC20
            sender,                        //接收ETH受益人地址
            ERC20Instance.address,              //代币地址
            owner,                        //代币从这个地址发送
            { from: owner }
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20Instance.approve(CrowdsaleInstance.address, ether(totalSupply.toString()), { from: owner });
    });
    //测试通用的众筹合约//
    await Crowdsale(rate, false);
});
describe("测试可暂停众筹合约的特殊方法", function () {
    //测试添加暂停管理员
    it('添加暂停管理员: addPauser()', async function () {
        assert.doesNotReject(CrowdsaleInstance.addPauser(sender, { from: owner }));
    });
    //测试账户拥有暂停权
    it('账户拥有暂停权: isPauser()', async function () {
        assert.ok(await CrowdsaleInstance.isPauser(sender));
    });
    //测试是否已暂停,未暂停
    it('是否已暂停,未暂停: paused()', async function () {
        assert.ok(!await CrowdsaleInstance.paused());
    });
    //测试暂停方法
    it('暂停方法: pause()', async function () {
        assert.doesNotReject(CrowdsaleInstance.pause({ from: sender }));
    });
    //测试是否已暂停,已暂停
    it('是否已暂停,已暂停: paused()', async function () {
        assert.ok(await CrowdsaleInstance.paused());
    });
    //测试恢复合约
    it('恢复合约: unpause()', async function () {
        assert.doesNotReject(CrowdsaleInstance.unpause({ from: sender }));
    });
    //测试是否已暂停,未暂停
    it('是否已暂停,未暂停: paused()', async function () {
        assert.ok(!await CrowdsaleInstance.paused());
    });
    //测试撤销暂停管理员
    it('撤销暂停管理员: renouncePauser()', async function () {
        assert.doesNotReject(CrowdsaleInstance.renouncePauser({ from: sender }));
    });
    //测试账户没有暂停权
    it('账户没有暂停权: isPauser()', async function () {
        assert.ok(!await CrowdsaleInstance.isPauser(sender));
    });
});