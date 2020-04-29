//固定总量代币
const ERC20MultiFunction = artifacts.require("ERC20MultiFunction"); 

module.exports = function(deployer) {
    deployer.deploy(ERC20MultiFunction,
    //构造函数的参数
    "My Golden Coin","MGC",18,1000,1000000000);
};