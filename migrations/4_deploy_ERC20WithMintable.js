//可增发代币
const ERC20WithMintable = artifacts.require("ERC20WithMintable"); 

module.exports = function(deployer) {
    deployer.deploy(ERC20WithMintable,
    //构造函数的参数
    "My Golden Coin","MGC",18,1000000000);
};