//可以将ERC20FixedSupply替换成自己想要布署的合约名称
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const ERC20WithTokenTimelock = artifacts.require("ERC20WithTokenTimelock");

module.exports = function (deployer, network, accounts) {
    const totalSupply = 1000000000;  //发行总量
    deployer.deploy(ERC20FixedSupply,
        //构造函数的参数,注意参数的数量,封顶合约要多一个参数
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    )
        .then(function (ERC20FixedSupplyInstance) {
            return deployer.deploy(ERC20WithTokenTimelock,
                ERC20FixedSupplyInstance.address,                       //ERC20代币合约地址
                accounts[0],                                            //受益人
                parseInt(new Date().getTime() / 1000 + 3600 * 24 * 7)   //解锁时间戳
            ).then(function (ERC20WithTokenTimelockInstance) {
                //将所有代币转移到锁仓合约的账户中
                ERC20FixedSupplyInstance.transfer(ERC20WithTokenTimelockInstance.address, web3.utils.toWei(totalSupply.toString(),'ether'));
            })
        });
};