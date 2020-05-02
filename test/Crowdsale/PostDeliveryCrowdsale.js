const assert = require('assert');
const { contract, accounts,web3 } = require('@openzeppelin/test-environment');
const { ether, time, constants } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("ERC20PostDeliveryCrowdsale");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const ERC20 = require('../inc/ERC20');
const Crowdsale = require('../inc/Crowdsale');
//到期后交付的众筹
const totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
rate = '1000';
TokenValue = (EthValue * rate).toString();
describe("到期后交付的众筹", function () {
    it('布署代币合约', async function () {
        ERC20Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        ERC20Instance = await ERC20Contract.new(...ERC20Param, { from: owner });
    });
    it('布署众筹合约', async function () {
        openingTime = parseInt(await time.latest()) + 60;
        closingTime = parseInt(await time.latest()) + 600;
        CrowdsaleParam = [
            rate,                                       //兑换比例1ETH:100ERC20
            sender,                                     //接收ETH受益人地址
            ERC20Instance.address,                      //代币地址
            owner,                                      //代币从这个地址发送
            openingTime,                                //众筹开始时间
            closingTime,                                //众筹结束时间
        ]
        CrowdsaleInstance = await CrowdsaleContract.new(...CrowdsaleParam, { from: owner });
    });
});
describe("布署后首先执行", function () {
    it('将代币批准给众筹合约', async function () {
        await ERC20Instance.approve(CrowdsaleInstance.address, ether(totalSupply), { from: owner });
    });
});
describe("测试ERC20合约基本信息", function () {
    ERC20.detail();
});
describe("测试通用的众筹方法", function () {
    Crowdsale.token();
    Crowdsale.wallet(sender);
    Crowdsale.rate(rate);
    Crowdsale.tokenWallet(owner);
});

describe("测试众筹合约的方法", async function () {
    it('验证开始时间: openingTime()', async function () {
        assert.equal(openingTime, await CrowdsaleInstance.openingTime());
    });
    it('验证结束时间: closingTime()', async function () {
        assert.equal(closingTime, await CrowdsaleInstance.closingTime());
    });
    Crowdsale.isOpen(false, '验证合约未开始');
    Crowdsale.hasClosed(false, '验证未到期');
    Crowdsale.buyTokens(purchaser, EthValue, '开始前购买代币错误',true,/TimedCrowdsale: not open/);
    it('推进时间到众筹开始时间： time.increaseTo(openingTime)', async function () {
        await time.increaseTo(openingTime);
    });
    Crowdsale.isOpen(true, '验证合约已开始');
    Crowdsale.buyTokens(purchaser, EthValue, '购买代币');
    Crowdsale.weiRaised(EthValue, '众筹收入为'+EthValue);
    ERC20.balanceOf('0', purchaser, '购买者账户余额为0');
    Crowdsale.balanceOf(TokenValue.toString(), purchaser, '验证账户在众筹合约的余额为' + TokenValue);
    Crowdsale.withdrawTokens(purchaser, '验证众筹未结束账户无法提款', true, /PostDeliveryCrowdsale: not closed/);
    Crowdsale.remainingTokens(totalSupply - TokenValue,'配额中剩余的代币数量');
    it('推进时间到众筹结束时间： time.increaseTo(closingTime)', async function () {
        await time.increaseTo(closingTime + 1);
    });
    Crowdsale.withdrawTokens(purchaser, '验证众筹结束后提款');
    ERC20.balanceOf(TokenValue, purchaser, '购买者账户余额为' + TokenValue);
    Crowdsale.balanceOf('0', beneficiary, '验证账户在众筹合约的余额为0');
    Crowdsale.hasClosed(true, '验证众筹已到期');
    Crowdsale.buyTokens(purchaser, EthValue, '结束后购买代币错误',true,/TimedCrowdsale: not open/);
});
