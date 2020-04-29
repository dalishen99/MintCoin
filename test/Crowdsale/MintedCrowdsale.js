const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("ERC20MintedCrowdsale");
const ERC20Contract = contract.fromArtifact("ERC20WithMintable");
const ERC20 = require('../inc/ERC20');

totalSupply = 1000000000;//发行总量
[owner, sender, receiver] = accounts;
eth = ether('10');
rate = 100;//兑换比例1ETH:100ERC20
describe("可增发的众筹", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    ];
    ERC20Instance = await ERC20(ERC20Contract, param);
});
describe("布署可增发的众筹合约:", function () {
    before(async function () {
        //布署众筹合约
        CrowdsaleInstance = await CrowdsaleContract.new(
            rate,                               //兑换比例
            sender,                        //接收ETH受益人地址
            ERC20Instance.address,              //代币地址
            { from: owner }
        );
    });
    describe("布署合约后首先执行的方法", function () {
        it('添加众筹合约的铸造权: addMinter()', function () {
            //添加众筹合约的铸造权
            assert.doesNotReject(ERC20Instance.addMinter(CrowdsaleInstance.address,{from:owner}));
        });
        it('撤销发送者的铸造权: renounceMinter()', function () {
            //撤销发送者的铸造权
            assert.doesNotReject(ERC20Instance.renounceMinter({from:owner}));
        });
    });
    describe("测试可增发的众筹合约方法", function () {
        //测试ERC20代币地址
        it('ERC20代币地址: token()', async function () {
            assert.equal(ERC20Instance.address, tokenAddress = await CrowdsaleInstance.token());
        });
        //测试ETH受益人地址
        it('ETH受益人地址: wallet()', async function () {
            assert.equal(sender, await CrowdsaleInstance.wallet());
        });
        //测试兑换比例
        it('兑换比例: rate()', async function () {
            assert.equal(rate, await CrowdsaleInstance.rate());
        });
        //测试购买代币方法
        it('购买代币方法: buyTokens()', async function () {
            assert.doesNotReject(CrowdsaleInstance.buyTokens(receiver,{value: eth}));
        });
        //测试购买者余额
        it('购买者余额: balanceOf()', async function () {
            assert.equal(ether('1100').toString(),
                    (await ERC20Instance.balanceOf(receiver)).toString());
        });
        //测试代币发行总量
        it('代币发行总量: totalSupply()', async function () {
            assert.equal(ether('1000001000').toString(),(await ERC20Instance.totalSupply()).toString());
        });
        //测试众筹收入
        it('众筹收入: weiRaised()', async function () {
            assert.equal(eth.toString(),(await CrowdsaleInstance.weiRaised()).toString());
        });
    });
});