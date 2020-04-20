//可销毁代币
const ERC20WithBurnable = artifacts.require("ERC20WithBurnable"); 

module.exports = function(deployer) {
    deployer.deploy(ERC20WithBurnable,
    //构造函数的参数
    "My Golden Coin","MGC",18,1000000000);
};