//可以将ERC20FixedSupply替换成自己想要布署的合约名称
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const ERC20WithTokenVesting = artifacts.require("ERC20WithTokenVesting");

module.exports = (deployer, network, accounts) => {
    //发行总量
    const totalSupply = 1000000000;  
    //锁仓总量
    const amount = 24000;  
    deployer.deploy(ERC20FixedSupply,
        //构造函数的参数
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    )
        .then((ERC20FixedSupplyInstance) => {
            return deployer.deploy(ERC20WithTokenVesting,
                accounts[1],                                 //受益人账户
                parseInt(new Date().getTime() / 1000) + 10,  //开始时间
                '3600',                                      //断崖时间
                '86400',                                     //持续时间
                true                                         //可以撤销
            ).then((ERC20WithTokenVestingInstance) => {
                //将代币转移到锁仓合约的账户中
                ERC20FixedSupplyInstance.transfer(ERC20WithTokenVestingInstance.address, web3.utils.toWei(amount.toString(),'ether'));
            })
        });
};