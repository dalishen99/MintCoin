const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether, constants } = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact("ERC20MultiFunction");
const ERC20 = require('../inc/ERC20');
//ERC20多功能代币,可增发,可销毁,可暂停,有封顶
const totalSupply = '100000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
rate = '1000';
const cap = '200000';
TokenValue = (EthValue * rate).toString();
describe("ERC20多功能代币", function () {
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
    ERC20.transfer(owner, constants.ZERO_ADDRESS, TokenValue, '代币发送,0地址错误', true, /ERC20: transfer to the zero address/);
    ERC20.transfer(owner, receiver, TokenValue, '代币发送');
    ERC20.balanceOf(TokenValue, receiver, '接收者账户余额');//receiver.balance = value
    ERC20.approve(owner, constants.ZERO_ADDRESS, TokenValue, '批准代币,0地址错误', true, /ERC20: approve to the zero address/);
    ERC20.approve(receiver, purchaser, TokenValue, '批准代币');
    ERC20.allowance(receiver, purchaser, TokenValue, '验证批准数额');//receiver=>purchaser = value
    ERC20.transferFrom(receiver, purchaser, beneficiary, TokenValue, '批准发送');//beneficiary.balance = value
    ERC20.balanceOf(TokenValue, beneficiary, '接收者账户余额');//receiver.balance = value
    ERC20.transferFrom(receiver, purchaser, beneficiary, TokenValue, '超额批准发送', true, /ERC20: transfer amount exceeds balance/);
    ERC20.allowance(receiver, purchaser, '0', '批准额归零');//receiver=>purchaser = 0
    ERC20.increaseAllowance(receiver, purchaser, TokenValue, '增加批准额');
    ERC20.allowance(receiver, purchaser, TokenValue, '验证批准数额');//receiver=>purchaser = value
    ERC20.decreaseAllowance(receiver, purchaser, TokenValue, '减少批准额');
    ERC20.allowance(receiver, purchaser, '0', '批准数额归零');//receiver=>purchaser = 0
    ERC20.decreaseAllowance(receiver, purchaser, TokenValue, '超额减少批准额', true, /ERC20: decreased allowance below zero/);
});
describe("测试ERC20合约的销毁方法", async function () {
    ERC20.burn(beneficiary, TokenValue, '销毁代币');
    ERC20.balanceOf('0', beneficiary, '销毁后余额归零');
    ERC20.burn(beneficiary, TokenValue, '超额销毁', true, /ERC20: burn amount exceeds balance/);
    ERC20.approve(owner, receiver, TokenValue, '增加批准额');
    ERC20.allowance(owner, receiver, TokenValue, '测试批准数额');//owner=>receiver = value
    ERC20.burnFrom(owner, receiver, TokenValue, '销毁批准额');
    ERC20.allowance(owner, receiver, '0', '销毁销毁后批准额归零');//owner=>receiver = 0
    ERC20.burnFrom(owner, receiver, TokenValue, '超额销毁批准额', true, /ERC20: burn amount exceeds allowance/);
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
    ERC20.mint(owner, beneficiary, TokenValue, '铸币方法');
    ERC20.balanceOf(TokenValue, beneficiary, '账户铸币后余额');
    ERC20.mint(owner, beneficiary, ether('1000000000'), '超额铸币错误', true, /ERC20Capped: cap exceeded/);
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
    ERC20.transfer(owner, receiver, TokenValue, '暂停后代币发送错误', true, /Pausable: paused/);
    ERC20.pause(owner, '验证重复暂停错误', true, /Pausable: paused/);
    ERC20.pause(sender, '验证无权暂停错误', true, /PauserRole: caller does not have the Pauser role/);
    ERC20.unpause(owner, '恢复暂停合约');
    ERC20.paused(false, '验证合约未暂停');
    ERC20.unpause(owner, '验证重复恢复暂停错误', true, /Pausable: not paused/);
    ERC20.unpause(sender, '验证无权恢复暂停错误', true, /PauserRole: caller does not have the Pauser role/);
});