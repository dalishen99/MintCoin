
const { contract, accounts } = require('@openzeppelin/test-environment');
const { constants } = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact("ERC20WithPausable");
const ERC20 = require('../inc/ERC20');
//可暂停代币
const totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';

describe("可暂停代币", function () {
    it('布署代币合约', async function () {
        ERC20Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply,        //发行总量
        ];
        ERC20Instance = await ERC20Contract.new(...ERC20Param, { from: owner });
    });
});

describe("测试ERC20合约基本信息", function () {
    ERC20.datail();
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
describe("测试设置暂停管理员的方法", function () {
    ERC20.addPauser(sender, sender, '无权添加暂停管理员错误', true, /PauserRole: caller does not have the Pauser role/);
    ERC20.addPauser(sender, owner, '添加暂停管理员');
    ERC20.addPauser(sender, owner, '重复添加暂停管理员错误', true, /Roles: account already has role/);
    ERC20.isPauser(sender, true, '验证账户是暂停管理员');
    ERC20.renouncePauser(sender, '撤销暂停管理员');
    ERC20.isPauser(sender, false, '验证账户不是暂停管理员');
    ERC20.renouncePauser(sender, '重复撤销暂停管理员错误', true, /Roles: account does not have role/);

});
describe("测试代币合约的暂停管理方法", function () {//
    ERC20.paused(false, '验证合约未暂停');
    ERC20.pause(owner, '暂停合约');
    ERC20.paused(true, '验证合约已暂停');
    ERC20.transfer(owner, receiver, EthValue, '暂停后代币发送错误', true, /Pausable: paused/);
    ERC20.pause(owner, '验证重复暂停错误', true, /Pausable: paused/);
    ERC20.pause(sender, '验证无权暂停错误', true, /PauserRole: caller does not have the Pauser role/);
    ERC20.unpause(owner, '恢复暂停合约');
    ERC20.paused(false, '验证合约未暂停');
    ERC20.unpause(owner, '验证重复恢复暂停错误', true, /Pausable: not paused/);
    ERC20.unpause(sender, '验证无权恢复暂停错误', true, /PauserRole: caller does not have the Pauser role/);
});