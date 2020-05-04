const MultiFunctionCrowdsaleERC20 = artifacts.require("MultiFunctionCrowdsaleERC20");
const MultiFunctionCrowdsale = artifacts.require("MultiFunctionCrowdsale");

module.exports = function (deployer, network, accounts) {
  const totalSupply = 1000000000;                 //发行量
  const cap = web3.utils.toWei('10000', 'ether');  //众筹封顶数量
  const rate = 100;                               // 兑换比例
  const goal = web3.utils.toWei('200', 'ether');  //众筹目标
  deployer.deploy(MultiFunctionCrowdsaleERC20,
    "My Golden Coin", //代币名称
    "MGC",            //代币缩写
    18,               //精度    
    totalSupply        //初始发行量
  ).then((MultiFunctionCrowdsaleERC20Instance) => {
    return deployer.deploy(MultiFunctionCrowdsale,
      rate,                                 // 兑换比例
      accounts[0],                          // 接收ETH受益人地址
      MultiFunctionCrowdsaleERC20.address,  // 代币地址
      accounts[0],                          // 代币从这个地址发送
      Math.ceil(new Date().getTime() / 1000) + 60,  //众筹开始时间
      Math.ceil(new Date().getTime() / 1000) + 600, //众筹结束时间
      goal,                                         //众筹目标
      cap                                           //众筹封顶数量
    ).then(() => {
      MultiFunctionCrowdsaleERC20Instance.addMinter(MultiFunctionCrowdsale.address);
      MultiFunctionCrowdsaleERC20Instance.renounceMinter();
      MultiFunctionCrowdsaleERC20Instance.approve(MultiFunctionCrowdsale.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
    });
  })
};
