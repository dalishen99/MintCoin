const { contract, accounts,web3 } = require('@openzeppelin/test-environment');
const { ether, time, constants } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("ERC20CappedCrowdsale");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const ERC20 = require('../inc/ERC20');
const Crowdsale = require('../inc/Crowdsale');
//有封顶的众筹合约
const totalSupply = '100000000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
rate = '1000';
const cap = '20'; //封顶数额
TokenValue = (EthValue * rate).toString();
describe("有封顶的众筹合约", function () {
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
            ether(cap)                                  //封顶数额
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
    ERC20.datail();
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
describe("测试众筹合约的封顶方法", function () {
    Crowdsale.cap(cap);//
    Crowdsale.capReached(false, '众筹没有到达封顶');//
    Crowdsale.buyTokens(beneficiary, cap, '超额购买代币', true, /CappedCrowdsale: cap exceeded/);
    Crowdsale.buyTokens(beneficiary, EthValue, '购买代币');
    Crowdsale.capReached(true, '众筹已经到达封顶');//
});