//可以将ERC20FixedSupply替换成自己想要布署的合约名称
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const IssueTokenWithTimelock = artifacts.require("ERC20WithTokenTimelock");

module.exports = (deployer, network, accounts) => {
    //发行总量
    const totalSupply = 1000000000;  
    //锁仓总量
    const amount = 1000;  
    deployer.deploy(ERC20FixedSupply,
        //构造函数的参数
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    )
        .then((ERC20FixedSupplyInstance) => {
            return deployer.deploy(IssueTokenWithTimelock,
                ERC20FixedSupplyInstance.address,           //ERC20代币合约地址
                accounts[0],                                //受益人为当前账户
                parseInt(new Date().getTime() / 1000 + 10)  //解锁时间戳
            ).then((IssueTokenWithTimelockInstance) => {
                //将代币转移到锁仓合约的账户中
                ERC20FixedSupplyInstance.transfer(IssueTokenWithTimelockInstance.address, web3.utils.toWei(amount.toString(),'ether'));
            })
        });
};