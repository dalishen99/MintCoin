const { contract, accounts,web3 } = require('@openzeppelin/test-environment');
const { ether, time, constants } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("PausableCrowdsaleContract");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const ERC20 = require('../inc/ERC20');
const Crowdsale = require('../inc/Crowdsale');
//可暂停的众筹
const totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
rate = '1000';
TokenValue = (EthValue * rate).toString();
describe("可暂停的众筹", function () {
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
        CrowdsaleParam = [
            rate,                                       //兑换比例1ETH:100ERC20
            sender,                                     //接收ETH受益人地址
            ERC20Instance.address,                      //代币地址
            owner,                                      //代币从这个地址发送
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
    Crowdsale.buyTokens(purchaser, EthValue, '购买代币');
    Crowdsale.weiRaised(EthValue, '众筹收入为'+EthValue);
    ERC20.balanceOf(TokenValue.toString(), purchaser, '购买者账户余额为'+TokenValue)
    Crowdsale.remainingTokens(totalSupply - TokenValue,'配额中剩余的代币数量');
});

describe("测试设置暂停管理员的方法", function () {
    Crowdsale.addPauser(sender, sender, '无权添加暂停管理员错误', true, /PauserRole: caller does not have the Pauser role/);
    Crowdsale.addPauser(sender, owner, '添加暂停管理员');
    Crowdsale.addPauser(sender, owner, '重复添加暂停管理员错误', true, /Roles: account already has role/);
    Crowdsale.isPauser(sender, true, '验证账户是暂停管理员');
    Crowdsale.renouncePauser(sender, '撤销暂停管理员');
    Crowdsale.isPauser(sender, false, '验证账户不是暂停管理员');
    Crowdsale.renouncePauser(sender, '重复撤销暂停管理员错误', true, /Roles: account does not have role/);
});
describe("测试众筹合约的暂停管理方法", function () {//
    Crowdsale.paused(false, '验证合约未暂停');
    Crowdsale.pause(owner, '暂停合约');
    Crowdsale.paused(true, '验证合约已暂停');
    Crowdsale.pause(owner, '验证重复暂停错误', true, /Pausable: paused/);
    Crowdsale.pause(sender, '验证无权暂停错误', true, /PauserRole: caller does not have the Pauser role/);
    Crowdsale.buyTokens(purchaser, EthValue, '购买代币错误', true, /Pausable: paused/);
    Crowdsale.unpause(owner, '恢复暂停合约');
    Crowdsale.paused(false, '验证合约未暂停');
    Crowdsale.unpause(owner, '验证重复恢复暂停错误', true, /Pausable: not paused/);
    Crowdsale.unpause(sender, '验证无权恢复暂停错误', true, /PauserRole: caller does not have the Pauser role/);
});
