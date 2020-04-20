//有封顶代币
const ERC20WithCapped = artifacts.require("ERC20WithCapped"); 

module.exports = function(deployer) {
    deployer.deploy(ERC20WithCapped,
    //构造函数的参数
    "My Golden Coin","MGC",18,1000,1000000000);
};