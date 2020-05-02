//固定总量代币
const ERC721Contract = artifacts.require("ERC721Contract"); 

module.exports = function(deployer) {
    deployer.deploy(ERC721Contract,
    //构造函数的参数
    "My Game Token","MGT");
};