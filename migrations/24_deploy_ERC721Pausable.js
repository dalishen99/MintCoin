const ERC721PausableContract = artifacts.require("ERC721PausableContract"); 

module.exports = function(deployer) {
    deployer.deploy(ERC721PausableContract,
    //构造函数的参数
    "My Game Token","MGT",'https://github.com/Fankouzu/MintCoin/blob/master/');
};