const ERC721BurnableContract = artifacts.require("ERC721BurnableContract"); 

module.exports = function(deployer) {
    deployer.deploy(ERC721BurnableContract,
    //构造函数的参数
    "My Game Token","MGT",'https://github.com/Fankouzu/MintCoin/blob/master/');
};