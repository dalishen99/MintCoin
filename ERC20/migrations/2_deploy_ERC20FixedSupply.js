//固定总量代币
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply"); 

module.exports = function(deployer) {
    deployer.deploy(ERC20FixedSupply,
    //构造函数的参数
    "My Golden Coin","MGC",18,1000000000);
};