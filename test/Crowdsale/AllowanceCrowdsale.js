const CrowdsaleContract = artifacts.require("ERC20AllowanceCrowdsale");
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const Crowdsale = require('./Crowdsale');

contract('通用的众筹合约', accounts => {
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
    describe("布署通用的众筹合约...", async function() {
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
        await Crowdsale(accounts, rate, false);
    });
});
