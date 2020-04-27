const { contract } = require('@openzeppelin/test-environment');
const ERC20Contract = contract.fromArtifact('ERC20FixedSupply');
const ERC20 = require('../inc/ERC20');

describe("固定总量代币",async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        1000000000          //发行总量
    ];
    //测试ERC20合约的基本方法
    ERC20Instance = await ERC20(ERC20Contract, param);
});
