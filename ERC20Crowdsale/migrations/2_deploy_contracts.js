const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const ERC20MintedCrowdsale = artifacts.require("ERC20MintedCrowdsale");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(ERC20FixedSupply,
    //代币名称
    "My Golden Coin",
    //代币缩写
    "MGC",
    //精度    
    18,
    //发行总量           
    1000    //初始发行量
  ).then((ERC20FixedSupplyInstance) => {
    return deployer.deploy(ERC20MintedCrowdsale,
      //兑换比例
      100,
      //众筹受益人          
      accounts[0],
      //代币地址      
      ERC20FixedSupply.address
    ).then(() => {
      ERC20FixedSupplyInstance.addMinter(ERC20MintedCrowdsale.address);
      ERC20FixedSupplyInstance.renounceMinter();
    });
  })
};
