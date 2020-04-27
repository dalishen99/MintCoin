const assert = require('assert');
const { contract,accounts } = require('@openzeppelin/test-environment');
const ERC20Contract = contract.fromArtifact('ERC20WithBurnable');
const ERC20 = require('../inc/ERC20');

describe("可销毁代币", async function () {
    const param = [
        "My Golden Coin",   //代币名称
        "MGC",              //代币缩写
        18,                 //精度
        1000000000          //发行总量
    ];
    //测试ERC20合约的基本方法
    ERC20Instance = await ERC20(ERC20Contract, param);
});
describe("测试可销毁代币的特殊方法", function () {
    //测试销毁方法
    it('销毁方法: burn()', async function () {
        await ERC20Instance.burn(value, { from: purchaser });
        assert.equal(0, (await ERC20Instance.balanceOf(purchaser)).toString());
    });
    //测试销毁批准方法,先将账户0的100个代币批准给账户2,然后使用账户2销毁账户0的100个代币
    it('销毁批准方法: burnFrom()', async function () {
        await ERC20Instance.approve(receiver, value, { from: owner });
        await ERC20Instance.burnFrom(owner, value, { from: receiver });
        assert.equal(0, (await ERC20Instance.allowance(owner, receiver)).toString());
    });
});