const { contract, accounts, web3 } = require('@openzeppelin/test-environment');
const { ether, time, constants } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("MintedCrowdsaleContract");
const ERC20Contract = contract.fromArtifact("ERC20WithMintable");
const ERC20 = require('../inc/ERC20');
const Crowdsale = require('../inc/Crowdsale');
//可增发的众筹
const totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
rate = '1000';
TokenValue = (EthValue * rate).toString();
describe("可增发的众筹", function () {
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
        ]
        CrowdsaleInstance = await CrowdsaleContract.new(...CrowdsaleParam, { from: owner });
    });
});
describe("布署后首先执行", function () {
    it('将代币批准给众筹合约', async function () {
        await ERC20Instance.approve(CrowdsaleInstance.address, ether(totalSupply.toString()), { from: owner });
    });
    it('添加众筹合约的铸造权: addMinter()', async function () {
        await ERC20Instance.addMinter(CrowdsaleInstance.address, { from: owner });
    });
    ERC20.renounceMinter(owner, '撤销发送者的铸造权');
});
describe("测试ERC20合约基本信息", function () {
    ERC20.detail();
});
describe("测试通用的众筹方法", function () {
    Crowdsale.token();
    Crowdsale.wallet(sender);
    Crowdsale.rate(rate);
});
describe("测试众筹合约的铸币方法", function () {
    Crowdsale.buyTokens(purchaser, EthValue, '购买代币');
    Crowdsale.weiRaised(EthValue, '众筹收入为' + EthValue);
    ERC20.balanceOf(TokenValue.toString(), purchaser, '购买者账户余额为' + TokenValue);
    const totalSupplyNow = parseInt(totalSupply) + parseInt(TokenValue);
    ERC20.totalSupply(totalSupplyNow.toString());
});