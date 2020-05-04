const { contract, accounts,web3 } = require('@openzeppelin/test-environment');
const { ether, time, constants } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("WhitelistCrowdsaleContract");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const ERC20 = require('../inc/ERC20');
const Crowdsale = require('../inc/Crowdsale');
//有白名单的众筹
const totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
rate = '1000';
TokenValue = (EthValue * rate).toString();
describe("有白名单的众筹", function () {
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
});


describe("测试设置白名单管理员的方法", function () {
    Crowdsale.addWhitelistAdmin(sender, sender, '无权添加白名单管理员错误', true, /WhitelistAdminRole: caller does not have the WhitelistAdmin role/);
    Crowdsale.addWhitelistAdmin(sender, owner, '添加白名单管理员');
    Crowdsale.addWhitelistAdmin(sender, owner, '重复添加白名单管理员错误', true, /Roles: account already has role/);
    Crowdsale.isWhitelistAdmin(sender, true, '验证账户是白名单管理员');
    Crowdsale.renounceWhitelistAdmin(sender, '撤销白名单管理员');
    Crowdsale.isWhitelistAdmin(sender, false, '验证账户不是白名单管理员');
    Crowdsale.renounceWhitelistAdmin(sender, '重复撤销白名单管理员错误', true, /Roles: account does not have role/);
});
describe("测试设置白名单的方法", function () {
    Crowdsale.addWhitelisted(sender, sender, '无权添加白名单错误', true, /WhitelistAdminRole: caller does not have the WhitelistAdmin role/);
    Crowdsale.addWhitelisted(sender, owner, '添加白名单');
    Crowdsale.addWhitelisted(sender, owner, '重复添加白名单错误', true, /Roles: account already has role/);
    Crowdsale.isWhitelisted(sender, true, '验证账户是白名单');

    Crowdsale.buyTokens(sender, EthValue, '购买代币');
    Crowdsale.weiRaised(EthValue, '众筹收入为'+EthValue);
    ERC20.balanceOf(TokenValue.toString(), sender, '购买者账户余额为'+TokenValue)
    Crowdsale.remainingTokens(totalSupply - TokenValue,'配额中剩余的代币数量');

    Crowdsale.renounceWhitelisted(sender, '撤销白名单');
    Crowdsale.isWhitelisted(sender, false, '验证账户不是白名单');
    Crowdsale.renounceWhitelisted(sender, '重复撤销白名单错误', true, /Roles: account does not have role/);
    Crowdsale.addWhitelisted(purchaser, owner, '再次添加白名单');
    Crowdsale.removeWhitelisted(purchaser, owner, '删除白名单');
    Crowdsale.removeWhitelisted(purchaser, owner, '重复删除白名单', true, /Roles: account does not have role/);
    Crowdsale.removeWhitelisted(purchaser, sender, '无权删除白名单', true, /WhitelistAdminRole: caller does not have the WhitelistAdmin role/);
});