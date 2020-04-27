const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("ERC20AllowanceCrowdsale");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const Crowdsale = require('../inc/Crowdsale');
const ERC20 = require('../inc/ERC20');

totalSupply = 1000000000;//发行总量
[owner, sender, receiver] = accounts;
value = ether('10');
eth = ether('10');
describe("通用的众筹合约", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    ];
    ERC20Instance = await ERC20(ERC20Contract, param);
});
describe("布署通用的众筹合约...", async function () {
    rate = 100;//兑换比例1ETH:100ERC20
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
    //测试通用的众筹合约
    await Crowdsale(rate, false);
});