const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether, constants } = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact("ERC20WithCapped");
const ERC20 = require('../inc/ERC20');
//有封顶代币
const totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
const cap = '20000';

describe("有封顶代币", function () {
    it('布署代币合约', async function () {
        ERC20Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply,        //发行总量
            cap                 //封顶数额
        ];
        ERC20Instance = await ERC20Contract.new(...ERC20Param, { from: owner });
    });
});

describe("测试ERC20合约基本信息", function () {
    ERC20.detail();
    ERC20.cap(cap, '验证封顶额');
});
describe("测试ERC20合约的标准方法", async function () {
    ERC20.balanceOf(totalSupply, owner, '创建者账户余额');
    ERC20.transfer(owner, constants.ZERO_ADDRESS, EthValue, '代币发送,0地址错误', true, /ERC20: transfer to the zero address/);
    ERC20.transfer(owner, receiver, EthValue, '代币发送');
    ERC20.balanceOf(EthValue, receiver, '接收者账户余额');//receiver.balance = value
    ERC20.approve(owner, constants.ZERO_ADDRESS, EthValue, '批准代币,0地址错误', true, /ERC20: approve to the zero address/);
    ERC20.approve(receiver, purchaser, EthValue, '批准代币');
    ERC20.allowance(receiver, purchaser, EthValue, '验证批准数额');//receiver=>purchaser = value
    ERC20.transferFrom(receiver, purchaser, beneficiary, EthValue, '批准发送');//beneficiary.balance = value
    ERC20.balanceOf(EthValue, beneficiary, '接收者账户余额');//receiver.balance = value
    ERC20.transferFrom(receiver, purchaser, beneficiary, EthValue, '超额批准发送', true, /ERC20: transfer amount exceeds balance/);
    ERC20.allowance(receiver, purchaser, '0', '批准额归零');//receiver=>purchaser = 0
    ERC20.increaseAllowance(receiver, purchaser, EthValue, '增加批准额');
    ERC20.allowance(receiver, purchaser, EthValue, '验证批准数额');//receiver=>purchaser = value
    ERC20.decreaseAllowance(receiver, purchaser, EthValue, '减少批准额');
    ERC20.allowance(receiver, purchaser, '0', '批准数额归零');//receiver=>purchaser = 0
    ERC20.decreaseAllowance(receiver, purchaser, EthValue, '超额减少批准额', true, /ERC20: decreased allowance below zero/);
});

describe("测试设置铸币管理员的方法", function () {
    ERC20.addMinter(sender, sender, '无权添加铸币管理员错误', true, /MinterRole: caller does not have the Minter role/);
    ERC20.addMinter(sender, owner, '添加铸币管理员');
    ERC20.addMinter(sender, owner, '重复添加铸币管理员错误', true, /Roles: account already has role/);
    ERC20.isMinter(sender, true, '验证账户是铸币管理员');
    ERC20.renounceMinter(sender, '撤销铸币管理员');
    ERC20.isMinter(sender, false, '验证账户不是铸币管理员');
    ERC20.renounceMinter(sender, '重复撤销铸币管理员错误', true, /Roles: account does not have role/);
});

describe("测试代币合约的铸币方法", function () {
    ERC20.mint(owner, purchaser, EthValue, '铸币方法');
    ERC20.balanceOf(EthValue, purchaser, '账户铸币后余额');
    ERC20.mint(owner, purchaser, ether('1000000000'), '超额铸币错误', true, /ERC20Capped: cap exceeded/);
});