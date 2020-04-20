//固定总量代币
const ERC20WithPausable = artifacts.require("ERC20WithPausable"); 

module.exports = function(deployer) {
    deployer.deploy(ERC20WithPausable,
    //构造函数的参数
    "My Golden Coin","MGC",18,1000000000);
};