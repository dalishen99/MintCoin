//可以将ERC20FixedSupply替换成自己想要布署的合约名称
const Migrations = artifacts.require("ERC20FixedSupply"); 

module.exports = function(deployer) {
    deployer.deploy(Migrations,
    //构造函数的参数,注意参数的数量,封顶合约要多一个参数
    "My Golden Coin","MGC",18,1000000000);
};