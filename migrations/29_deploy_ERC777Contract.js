const ERC777Contract = artifacts.require("ERC777Contract");
const TokensSender = artifacts.require("TokensSender");
const TokensRecipient = artifacts.require("TokensRecipient");
const { singletons } = require('@openzeppelin/test-helpers');

module.exports = async (deployer, network, accounts) => {
    await singletons.ERC1820Registry(accounts[0]);
    const initialSupply = web3.utils.toWei('1000000000');
    const defaultOperators = accounts[1];
    const param = [
        //构造函数的参数
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        initialSupply,        //发行总量
        [defaultOperators]    //默认操作员
    ]
    await deployer.deploy(ERC777Contract, ...param);
    await deployer.deploy(TokensSender, true);
    await deployer.deploy(TokensRecipient, true);
};