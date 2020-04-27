//可以将ERC20FixedSupply替换成自己想要布署的合约名称
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const IssueTokenBeforeTimelock = artifacts.require("ERC20WithTokenTimelock");

module.exports = async (deployer, network, accounts) => {
    //锁仓总量
    const amount = 1000;
    //实例化ERC20合约
    const ERC20FixedSupplyInstance = await ERC20FixedSupply.deployed();
    return deployer.deploy(IssueTokenBeforeTimelock,
        ERC20FixedSupplyInstance.address,         //ERC20代币合约地址,如果你希望在未来的某个时间布署这个锁仓合约,可以将这里替换成合约地址
        accounts[1],                              //受益人
        parseInt(new Date().getTime() / 1000 + 10)//解锁时间戳
    ).then(function (IssueTokenBeforeTimelockInstance) {
        //将代币转移到锁仓合约的账户中
        //如果不是同时布署这个合约,可以通过其他方法随时调用ERC20的transfer方法
        ERC20FixedSupplyInstance.transfer(IssueTokenBeforeTimelockInstance.address, web3.utils.toWei(amount.toString(), 'ether'));
    })
};