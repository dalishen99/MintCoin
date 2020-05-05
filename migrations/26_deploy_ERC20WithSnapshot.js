const ERC20WithSnapshot = artifacts.require("ERC20WithSnapshot"); 
module.exports = (deployer) => {
    //发行总量
    const totalSupply = 1000000000;  
    deployer.deploy(ERC20WithSnapshot,
        //构造函数的参数
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        totalSupply         //发行总量
    )
};