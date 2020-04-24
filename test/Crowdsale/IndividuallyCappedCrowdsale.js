const assert = require('assert');
const CrowdsaleContract = artifacts.require("ERC20IndividuallyCappedCrowdsale");
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const Crowdsale = require('./Crowdsale');

contract('有配额的众筹', accounts => {
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
    describe("布署有配额众筹合约...", async function() {
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
        await Crowdsale(accounts, rate, true);
    });
    describe("测试有配额众筹合约的特殊方法", function() {
        //测试设置配额方法
        it('设置配额方法: setCap()', async function() {
            assert.doesNotReject(CrowdsaleInstance.setCap(accounts[2], web3.utils.toWei('10', 'ether')));
        });
        //测试获取账户配额方法
        it('获取账户配额方法: getCap()', async function() {
            assert.equal(web3.utils.toWei('10', 'ether'), await CrowdsaleInstance.getCap(accounts[2]));
        });
        //重新测试购买代币方法
        it('重新测试购买代币方法: buyTokens()', async function() {
            await CrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') });
            assert.equal(10 * rate, web3.utils.fromWei(await ERC20Instance.balanceOf(accounts[2]), 'ether'));
        });
        //重新测试众筹收入
        it('重新测试众筹收入: weiRaised()', async function () {
            assert.equal(10, web3.utils.fromWei(await CrowdsaleInstance.weiRaised(), 'ether'));
        });
        //测试获取账户贡献方法
        it('获取账户贡献方法: getContribution()', async function() {
            assert.equal(10, web3.utils.fromWei(await CrowdsaleInstance.getContribution(accounts[2]), 'ether'));
        });
        //测试添加配额管理员
        it('添加配额管理员: addCapper()', async function() {
            assert.doesNotReject(CrowdsaleInstance.addCapper(accounts[1]));
        });
        //测试账户是配额管理员
        it('账户是配额管理员: isCapper()', async function() {
            assert.ok(await CrowdsaleInstance.isCapper(accounts[1]));
        });
        //测试撤销配额管理员
        it('撤销配额管理员: renounceCapper()', async function() {
            await CrowdsaleInstance.renounceCapper({ from: accounts[1] });
            assert.ok(!await CrowdsaleInstance.isCapper(accounts[1]));
        });
    });
});
