const ERC721MintableContract = artifacts.require("ERC721MintableContract"); 

module.exports = function(deployer) {
    deployer.deploy(ERC721MintableContract,
    //构造函数的参数
    "My Game Token","MGT",'https://github.com/Fankouzu/MintCoin/blob/master/');
};