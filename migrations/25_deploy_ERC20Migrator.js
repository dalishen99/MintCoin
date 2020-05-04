const ERC20FixedSupply = artifacts.require("ERC20FixedSupply"); 
const ERC20Migrator = artifacts.require("ERC20MigratorContract"); 

module.exports = (deployer) => {
    //发行总量
    const totalSupply = 1000000000;  
    deployer.deploy(ERC20FixedSupply,
        //构造函数的参数
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    )
        .then((ERC20FixedSupplyInstance) => {
            return deployer.deploy(ERC20Migrator,
                ERC20FixedSupplyInstance.address,           //ERC20代币合约地址
            )
        });
};