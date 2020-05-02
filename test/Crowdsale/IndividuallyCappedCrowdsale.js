const { contract, accounts,web3 } = require('@openzeppelin/test-environment');
const { ether, time, constants } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("ERC20IndividuallyCappedCrowdsale");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const ERC20 = require('../inc/ERC20');
const Crowdsale = require('../inc/Crowdsale');
//有配额众筹
const totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
rate = '1000';
TokenValue = (EthValue * rate).toString();
describe("有配额众筹", function () {
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
describe("测试设置配额管理员的方法", function () {
    Crowdsale.addCapper(sender, sender, '无权添加配额管理员错误', true, /CapperRole: caller does not have the Capper role/);
    Crowdsale.addCapper(sender, owner, '添加配额管理员');
    Crowdsale.addCapper(sender, owner, '重复添加配额管理员错误', true, /Roles: account already has role/);
    Crowdsale.isCapper(sender, true, '验证账户是配额管理员');
    Crowdsale.renounceCapper(sender, '撤销配额管理员');
    Crowdsale.isCapper(sender, false, '验证账户不是配额管理员');
    Crowdsale.renounceCapper(sender, '重复撤销配额管理员错误', true, /Roles: account does not have role/);
});
describe("测试众筹合约的配额管理方法", function () {
    Crowdsale.setCap(sender, owner, EthValue, '设置配额');
    Crowdsale.setCap(purchaser, sender, EthValue, '无权设置配额', true, /CapperRole: caller does not have the Capper role/);
    Crowdsale.getCap(sender, EthValue, '验证账户配额');
    Crowdsale.getContribution(sender, '0', '验证账户贡献为0');//

    Crowdsale.buyTokens(sender, EthValue, '购买代币');
    Crowdsale.weiRaised(EthValue, '众筹收入为'+EthValue);
    ERC20.balanceOf(TokenValue.toString(), sender, '购买者账户余额为'+TokenValue)
    Crowdsale.remainingTokens(totalSupply - TokenValue,'配额中剩余的代币数量');
    Crowdsale.getContribution(sender, EthValue, '验证账户贡献为'+EthValue);//

});