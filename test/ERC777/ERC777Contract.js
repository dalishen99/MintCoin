const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether, makeInterfaceId, constants, singletons } = require('@openzeppelin/test-helpers');
const ERC777Contract = contract.fromArtifact("ERC777Contract");
const ERC777 = require('../inc/ERC777');
//ERC777代币
[owner, sender, receiver, purchaser, beneficiary] = accounts;
const EthValue = '10';
const initialSupply = '1000000000';
const defaultOperators = [sender];

describe("ERC777代币", function () {
    it('布署代币合约', async function () {
        ERC1820RegistryInstance = await singletons.ERC1820Registry(owner);
        ERC777Param = [
            //构造函数的参数
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            ether(initialSupply),      //发行总量
            defaultOperators    //默认操作员
        ]
        ERC777Instance = await ERC777Contract.new(...ERC777Param, { from: owner });
    });
});

describe("测试ERC777合约基本信息", function () {
    ERC777.detail();
});
describe("测试ERC777兼容ERC777合约的方法", async function () {
    //测试余额
    ERC777.balanceOf(initialSupply, owner, '创建者账户余额');
    //测试发送
    ERC777.transfer(owner, constants.ZERO_ADDRESS, EthValue, '代币发送,0地址错误', true, /ERC777: transfer to the zero address/);
    ERC777.transfer(owner, receiver, EthValue, '代币发送');
    //测试超额发送
    ERC777.transfer(owner, receiver, initialSupply, '超额发送错误', true, /ERC777: transfer amount exceeds balance/);
    //测试余额
    ERC777.balanceOf(EthValue, receiver, '接收者账户余额');//receiver.balance = value
    //测试批准
    ERC777.approve(owner, constants.ZERO_ADDRESS, EthValue, '批准代币,0地址错误', true, /ERC777: approve to the zero address/);
    ERC777.approve(receiver, purchaser, EthValue, '批准代币');
    //验证批准
    ERC777.allowance(receiver, purchaser, EthValue, '验证批准数额');//receiver=>purchaser = value
    //测试传送批准
    ERC777.transferFrom(receiver, purchaser, beneficiary, EthValue, '批准发送');//beneficiary.balance = value
    //测试余额
    ERC777.balanceOf(EthValue, beneficiary, '接收者账户余额');//receiver.balance = value
    //测试超额发送批准
    ERC777.transferFrom(receiver, purchaser, beneficiary, EthValue, '超额批准发送', true, /ERC777: transfer amount exceeds balance/);
    //验证批准归零
    ERC777.allowance(receiver, purchaser, '0', '批准额归零');//receiver=>purchaser = 0
});
describe("测试ERC777合约的方法", function () {

    it('setInterfaceImplementer', async function () {
        await ERC1820RegistryInstance.setInterfaceImplementer(receiver,makeInterfaceId.ERC1820('tokensToSend'),ERC777Instance.address,{from:receiver});
    });
    it('getInterfaceImplementer', async function () {
        let receipt = await ERC1820RegistryInstance.getInterfaceImplementer(receiver,makeInterfaceId.ERC1820('tokensToSend'));
        console.log(ERC777Instance.address);
    });
    it('setInterfaceImplementer', async function () {
        await ERC1820RegistryInstance.setInterfaceImplementer(receiver,makeInterfaceId.ERC1820('tokensReceived'),ERC777Instance.address,{from:receiver});
    });
    it('getInterfaceImplementer', async function () {
        let receipt = await ERC1820RegistryInstance.getInterfaceImplementer(receiver,makeInterfaceId.ERC1820('tokensReceived'));
        console.log(receipt);
    });
    //send
    //burn
    //isOperatorFor
    //authorizeOperator
    //revokeOperator
    //defaultOperators
    //operatorSend
    //operatorBurn
});