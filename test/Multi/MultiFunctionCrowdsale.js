const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether, time, constants, expectEvent } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("MultiFunctionCrowdsale");
const ERC20Contract = contract.fromArtifact("MultiFunctionCrowdsaleERC20");
const Testcase = require('../inc/Testcase');

//多功能众筹合约:可增发,可销毁,有封顶,有配额,可暂停,有时限,白名单,成功后交付,不成功退款
totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
value = '10';
eth = '10';
rate = '1000';
goal = '15';
cap = '20000'; //封顶数额

describe("布署合约", function () {
    it('布署代币合约', async function () {
        ERC20Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        ERC20Instance = await ERC20Contract.new(...ERC20Param, { from: owner });
    });
    it('布署众筹合约', async function () {
        openingTime = parseInt(await time.latest()) + 60;
        closingTime = parseInt(await time.latest()) + 600
        CrowdsaleParam = [
            rate,                                       //兑换比例1ETH:100ERC20
            sender,                                     //接收ETH受益人地址
            ERC20Instance.address,                      //代币地址
            owner,                                      //代币从这个地址发送
            openingTime,                                //众筹开始时间
            closingTime,                                //众筹结束时间
            ether(goal),                                //众筹目标
            ether(cap)                                  //封顶数额
        ]
        CrowdsaleInstance = await CrowdsaleContract.new(...CrowdsaleParam, { from: owner });
    });
});
describe("布署后首先执行", function () {
    it('将代币批准给众筹合约', async function () {
        await ERC20Instance.approve(CrowdsaleInstance.address, ether(totalSupply.toString()), { from: owner });
    });
    it('添加众筹合约的铸造权: addMinter()', async function () {
        await ERC20Instance.addMinter(CrowdsaleInstance.address, { from: owner });
    });
    it('撤销发送者的铸造权: renounceMinter()', async function () {
        await ERC20Instance.renounceMinter({ from: owner });
    });
});
describe("测试ERC20合约基本信息", function () {
    it('代币名称: name()', async function () {
        assert.equal(ERC20Param[0], await ERC20Instance.name());
    });
    it('代币缩写: symbol()', async function () {
        assert.equal(ERC20Param[1], await ERC20Instance.symbol());
    });
    it('代币精度: decimals()', async function () {
        const decimals = await ERC20Instance.decimals();
        assert.equal(ERC20Param[2], decimals.toString());
    });
    Testcase.totalSupply(totalSupply);
});
describe("测试ERC20合约的标准方法", async function () {
    Testcase.ERC20balanceOf(totalSupply, owner, '创建者账户余额');
    Testcase.transfer(owner, constants.ZERO_ADDRESS, value, '代币发送,0地址错误', true, /ERC20: transfer to the zero address/);
    Testcase.transfer(owner, receiver, value, '代币发送');
    Testcase.ERC20balanceOf(value, receiver, '接收者账户余额');//receiver.balance = value
    Testcase.approve(owner, constants.ZERO_ADDRESS, value, '批准代币,0地址错误', true, /ERC20: approve to the zero address/);
    Testcase.approve(receiver, purchaser, value, '批准代币');
    Testcase.allowance(receiver, purchaser, value, '验证批准数额');//receiver=>purchaser = value
    Testcase.transferFrom(receiver, purchaser, beneficiary, value, '批准发送');//beneficiary.balance = value
    Testcase.transferFrom(receiver, purchaser, beneficiary, value, '超额批准发送', true, /ERC20: transfer amount exceeds balance/);
    Testcase.allowance(receiver, purchaser, '0', '批准额归零');//receiver=>purchaser = 0
    Testcase.increaseAllowance(receiver, purchaser, value, '增加批准额');
    Testcase.allowance(receiver, purchaser, value, '验证批准数额');//receiver=>purchaser = value
    Testcase.decreaseAllowance(receiver, purchaser, value, '减少批准额');
    Testcase.allowance(receiver, purchaser, '0', '批准数额归零');//receiver=>purchaser = 0
    Testcase.decreaseAllowance(receiver, purchaser, value, '超额减少批准额', true, /ERC20: decreased allowance below zero/);
});
describe("测试ERC20合约的销毁方法", async function () {
    Testcase.burn(beneficiary, value, '销毁代币');
    Testcase.ERC20balanceOf('0', beneficiary, '销毁后余额归零');
    Testcase.burn(beneficiary, value, '超额销毁', true, /ERC20: burn amount exceeds balance/);
    Testcase.approve(owner, receiver, value, '增加批准额');
    Testcase.allowance(owner, receiver, value, '测试批准数额');//owner=>receiver = value
    Testcase.burnFrom(owner, receiver, value, '销毁批准额');
    Testcase.allowance(owner, receiver, '0', '销毁销毁后批准额归零');//owner=>receiver = 0
    Testcase.burnFrom(owner, receiver, value, '超额销毁批准额', true, /ERC20: burn amount exceeds allowance/);
});
describe("测试通用的众筹方法", function () {
    it('ERC20代币地址: token()', async function () {
        assert.equal(ERC20Instance.address, await CrowdsaleInstance.token());
    });
    it('ETH受益人地址: wallet()', async function () {
        assert.equal(sender, await CrowdsaleInstance.wallet());
    });
    it('兑换比例: rate()', async function () {
        assert.equal(rate, await CrowdsaleInstance.rate());
    });
    Testcase.buyTokens(purchaser, value, '购买代币错误:不在白名单', true, /WhitelistCrowdsale: beneficiary doesn\'t have the Whitelisted role/);
    Testcase.weiRaised('0', '众筹收入为0');
});
describe("测试众筹合约的封顶方法", function () {
    it('封顶数额: cap()', async function () {
        assert.equal(ether(cap).toString(), (await CrowdsaleInstance.cap()).toString());
    });
    Testcase.capReached(false, '众筹没有到达封顶');//
});
describe("测试设置配额管理员的方法", function () {
    Testcase.addCapper(sender, sender, '无权添加配额管理员错误', true, /CapperRole: caller does not have the Capper role/);
    Testcase.addCapper(sender, owner, '添加配额管理员');
    Testcase.addCapper(sender, owner, '重复添加配额管理员错误', true, /Roles: account already has role/);
    Testcase.isCapper(sender, true, '验证账户是配额管理员');
    Testcase.renounceCapper(sender, '撤销配额管理员');
    Testcase.isCapper(sender, false, '验证账户不是配额管理员');
    Testcase.renounceCapper(sender, '重复撤销配额管理员错误', true, /Roles: account does not have role/);
});
describe("测试众筹合约的配额管理方法", function () {
    Testcase.setCap(sender, owner, value, '设置配额');
    Testcase.setCap(purchaser, sender, value, '无权设置配额', true, /CapperRole: caller does not have the Capper role/);
    Testcase.getCap(sender, value, '验证账户配额');
    Testcase.getContribution(sender, '0', '验证账户贡献为0');//
});
describe("测试设置暂停管理员的方法", function () {
    Testcase.addPauser(sender, sender, '无权添加暂停管理员错误', true, /PauserRole: caller does not have the Pauser role/);
    Testcase.addPauser(sender, owner, '添加暂停管理员');
    Testcase.addPauser(sender, owner, '重复添加暂停管理员错误', true, /Roles: account already has role/);
    Testcase.isPauser(sender, true, '验证账户是暂停管理员');
    Testcase.renouncePauser(sender, '撤销暂停管理员');
    Testcase.isPauser(sender, false, '验证账户不是暂停管理员');
    Testcase.renouncePauser(sender, '重复撤销暂停管理员错误', true, /Roles: account does not have role/);
});
describe("测试众筹合约的暂停管理方法", function () {//
    Testcase.paused(false, '验证合约未暂停');
    Testcase.pause(owner, '暂停合约');
    Testcase.paused(true, '验证合约已暂停');
    Testcase.pause(owner, '验证重复暂停错误', true, /Pausable: paused/);
    Testcase.pause(sender, '验证无权暂停错误', true, /PauserRole: caller does not have the Pauser role/);
    Testcase.unpause(owner, '恢复暂停合约');
    Testcase.paused(false, '验证合约未暂停');
    Testcase.unpause(owner, '验证重复恢复暂停错误', true, /Pausable: not paused/);
    Testcase.unpause(sender, '验证无权恢复暂停错误', true, /PauserRole: caller does not have the Pauser role/);
});
describe("测试有时限众筹合约的特殊方法", async function () {
    it('验证开始时间: openingTime()', async function () {
        assert.equal(openingTime, await CrowdsaleInstance.openingTime());
    });
    it('验证结束时间: closingTime()', async function () {
        assert.equal(closingTime, await CrowdsaleInstance.closingTime());
    });
    Testcase.paused(false, '验证合约未开始');
    Testcase.hasClosed(false, '验证未到期');
    it('推进时间到众筹开始时间： time.increaseTo(openingTime)', async function () {
        await time.increaseTo(openingTime);
    });
    Testcase.paused(false, '验证合约已开始');
});
describe("测试设置白名单管理员的方法", function () {
    Testcase.addWhitelistAdmin(sender, sender, '无权添加白名单管理员错误', true, /WhitelistAdminRole: caller does not have the WhitelistAdmin role/);
    Testcase.addWhitelistAdmin(sender, owner, '添加白名单管理员');
    Testcase.addWhitelistAdmin(sender, owner, '重复添加白名单管理员错误', true, /Roles: account already has role/);
    Testcase.isWhitelistAdmin(sender, true, '验证账户是白名单管理员');
    Testcase.renounceWhitelistAdmin(sender, '撤销白名单管理员');
    Testcase.isWhitelistAdmin(sender, false, '验证账户不是白名单管理员');
    Testcase.renounceWhitelistAdmin(sender, '重复撤销白名单管理员错误', true, /Roles: account does not have role/);
});
describe("测试设置白名单的方法", function () {
    Testcase.addWhitelisted(sender, sender, '无权添加白名单错误', true, /WhitelistAdminRole: caller does not have the WhitelistAdmin role/);
    Testcase.addWhitelisted(sender, owner, '添加白名单');
    Testcase.addWhitelisted(sender, owner, '重复添加白名单错误', true, /Roles: account already has role/);
    Testcase.isWhitelisted(sender, true, '验证账户是白名单');
    Testcase.renounceWhitelisted(sender, '撤销白名单');
    Testcase.isWhitelisted(sender, false, '验证账户不是白名单');
    Testcase.renounceWhitelisted(sender, '重复撤销白名单错误', true, /Roles: account does not have role/);
    Testcase.addWhitelisted(purchaser, owner, '再次添加白名单');
    Testcase.removeWhitelisted(purchaser, owner, '删除白名单');
    Testcase.removeWhitelisted(purchaser, owner, '重复删除白名单', true, /Roles: account does not have role/);
    Testcase.removeWhitelisted(purchaser, sender, '无权删除白名单', true, /WhitelistAdminRole: caller does not have the WhitelistAdmin role/);
});

describe("测试众筹结束的方法", function () {
    Testcase.finalized(false, '验证众筹未结束');
    Testcase.finalize('验证众筹未到期无法结束', true, /FinalizableCrowdsale: not closed/);//
});

describe("测试众筹结束后交付的方法", function () {
    Testcase.crowdsaleBalanceOf('0', owner, '验证账户在众筹合约的余额为0');
    Testcase.withdrawTokens(owner, '验证众筹未结束账户无法提款', true, /RefundablePostDeliveryCrowdsale: not finalized/);
});

describe("测试众筹目标的方法", function () {
    it('封顶目标数额: goal()', async function () {
        assert.equal(ether(goal).toString(), (await CrowdsaleInstance.goal()).toString());
    });
    Testcase.claimRefund(owner, '众筹未结束不能退款', true, /RefundableCrowdsale: not finalized/);
    Testcase.goalReached(false, '验证没有到达众筹目标');//
});

describe("测试众筹使用顺序", function () {
    Testcase.addWhitelisted(purchaser, owner, '添加白名单');
    Testcase.addWhitelisted(beneficiary, owner, '添加白名单');
    Testcase.setCap(purchaser, owner, value, '设置配额');
    Testcase.setCap(beneficiary, owner, value, '设置配额');
    Testcase.buyTokens(purchaser, eth, '购买代币');
    Testcase.buyTokens(beneficiary, eth, '购买代币');
    const weiRaised = (parseInt(value) * 2).toString();
    Testcase.weiRaised(weiRaised, '众筹收入为' + weiRaised);
    Testcase.ERC20balanceOf('0', beneficiary, '购买者账户余额');
    const balance = (parseInt(value) * parseInt(rate)).toString();
    Testcase.crowdsaleBalanceOf(balance, beneficiary, '验证账户在众筹合约的余额为' + balance);
    Testcase.getContribution(beneficiary, value, '验证账户贡献为' + value);
    it('推进时间到众筹结束时间： time.increaseTo(closingTime)', async function () {
        await time.increaseTo(closingTime + 1);
    });
    Testcase.hasClosed(true, '验证众筹已到期');
    Testcase.finalize('验证众筹未到期无法结束');
    Testcase.finalized(true, '验证众筹已结束');
    Testcase.claimRefund(beneficiary, '众筹结束达到目标不能退款', true, /RefundableCrowdsale: goal reached/);
    Testcase.withdrawTokens(beneficiary, '验证众筹结束后提款');
    Testcase.ERC20balanceOf(balance, beneficiary, '购买者账户余额为' + balance);
    Testcase.crowdsaleBalanceOf('0', beneficiary, '验证账户在众筹合约的余额为0');
});
