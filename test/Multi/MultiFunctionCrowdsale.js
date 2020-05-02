const assert = require('assert');
const { contract, accounts, web3 } = require('@openzeppelin/test-environment');
const { ether, time, constants } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("MultiFunctionCrowdsale");
const ERC20Contract = contract.fromArtifact("MultiFunctionCrowdsaleERC20");
const ERC20 = require('../inc/ERC20');
const Crowdsale = require('../inc/Crowdsale');
//多功能众筹合约:可增发,可销毁,有封顶,有配额,可暂停,有时限,白名单,成功后交付,不成功退款
const totalSupply = '100000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
rate = '1000';
const goal = '15';
const cap = '20'; //封顶数额
TokenValue = (EthValue * rate).toString();
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
    ERC20.renounceMinter(owner, '撤销发送者的铸造权');
});
describe("测试ERC20合约基本信息", function () {
    ERC20.detail();
});
describe("测试ERC20合约的标准方法", async function () {
    ERC20.balanceOf(totalSupply, owner, '创建者账户余额');
    ERC20.transfer(owner, constants.ZERO_ADDRESS, TokenValue, '代币发送,0地址错误', true, /ERC20: transfer to the zero address/);
    ERC20.transfer(owner, receiver, TokenValue, '代币发送');
    ERC20.balanceOf(TokenValue, receiver, '接收者账户余额');//receiver.balance = TokenValue
    ERC20.approve(owner, constants.ZERO_ADDRESS, TokenValue, '批准代币,0地址错误', true, /ERC20: approve to the zero address/);
    ERC20.approve(receiver, purchaser, TokenValue, '批准代币');
    ERC20.allowance(receiver, purchaser, TokenValue, '验证批准数额');//receiver=>purchaser = TokenValue
    ERC20.transferFrom(receiver, purchaser, beneficiary, TokenValue, '批准发送');//beneficiary.balance = TokenValue
    ERC20.balanceOf(TokenValue, beneficiary, '接收者账户余额');//receiver.balance = TokenValue
    ERC20.transferFrom(receiver, purchaser, beneficiary, TokenValue, '超额批准发送', true, /ERC20: transfer amount exceeds balance/);
    ERC20.allowance(receiver, purchaser, '0', '批准额归零');//receiver=>purchaser = 0
    ERC20.increaseAllowance(receiver, purchaser, TokenValue, '增加批准额');
    ERC20.allowance(receiver, purchaser, TokenValue, '验证批准数额');//receiver=>purchaser = TokenValue
    ERC20.decreaseAllowance(receiver, purchaser, TokenValue, '减少批准额');
    ERC20.allowance(receiver, purchaser, '0', '批准数额归零');//receiver=>purchaser = 0
    ERC20.decreaseAllowance(receiver, purchaser, TokenValue, '超额减少批准额', true, /ERC20: decreased allowance below zero/);
});
describe("测试ERC20合约的销毁方法", async function () {
    ERC20.burn(beneficiary, TokenValue, '销毁代币');
    ERC20.balanceOf('0', beneficiary, '销毁后余额归零');
    ERC20.burn(beneficiary, TokenValue, '超额销毁', true, /ERC20: burn amount exceeds balance/);
    ERC20.approve(owner, receiver, TokenValue, '增加批准额');
    ERC20.allowance(owner, receiver, TokenValue, '测试批准数额');//owner=>receiver = TokenValue
    ERC20.burnFrom(owner, receiver, TokenValue, '销毁批准额');
    ERC20.allowance(owner, receiver, '0', '销毁销毁后批准额归零');//owner=>receiver = 0
    ERC20.burnFrom(owner, receiver, TokenValue, '超额销毁批准额', true, /ERC20: burn amount exceeds allowance/);
});
describe("测试通用的众筹方法", function () {
    Crowdsale.token();
    Crowdsale.wallet(sender);
    Crowdsale.rate(rate);
    Crowdsale.buyTokens(purchaser, EthValue, '购买代币错误:不在白名单', true, /WhitelistCrowdsale: beneficiary doesn\'t have the Whitelisted role/);
    Crowdsale.weiRaised('0', '众筹收入为0');
});
describe("测试众筹合约的封顶方法", function () {
    Crowdsale.cap(cap);//
    Crowdsale.capReached(false, '众筹没有到达封顶');//
});
describe("测试设置配额管理员的方法", function () {
    Crowdsale.addCapper(sender, sender, '无权添加配额管理员错误', true, /CapperRole: caller does not have the Capper role/);
    Crowdsale.addCapper(sender, owner, '添加配额管理员');
    Crowdsale.addCapper(sender, owner, '重复添加配额管理员错误', true, /Roles: account already has role/);
    Crowdsale.isCapper(sender, true, '验证账户是配额管理员');
    Crowdsale.renounceCapper(sender, '撤销配额管理员');
    Crowdsale.isCapper(sender, false, '验证账户不是配额管理员');
    Crowdsale.renounceCapper(sender, '重复撤销配额管理员错误', true, /Roles: account does not have role/);
});
describe("测试众筹合约的配额管理方法", function () {
    Crowdsale.setCap(sender, owner, EthValue, '设置配额');
    Crowdsale.setCap(purchaser, sender, EthValue, '无权设置配额', true, /CapperRole: caller does not have the Capper role/);
    Crowdsale.getCap(sender, EthValue, '验证账户配额');
    Crowdsale.getContribution(sender, '0', '验证账户贡献为0');//
});
describe("测试设置暂停管理员的方法", function () {
    Crowdsale.addPauser(sender, sender, '无权添加暂停管理员错误', true, /PauserRole: caller does not have the Pauser role/);
    Crowdsale.addPauser(sender, owner, '添加暂停管理员');
    Crowdsale.addPauser(sender, owner, '重复添加暂停管理员错误', true, /Roles: account already has role/);
    Crowdsale.isPauser(sender, true, '验证账户是暂停管理员');
    Crowdsale.renouncePauser(sender, '撤销暂停管理员');
    Crowdsale.isPauser(sender, false, '验证账户不是暂停管理员');
    Crowdsale.renouncePauser(sender, '重复撤销暂停管理员错误', true, /Roles: account does not have role/);
});
describe("测试众筹合约的暂停管理方法", function () {//
    Crowdsale.paused(false, '验证合约未暂停');
    Crowdsale.pause(owner, '暂停合约');
    Crowdsale.paused(true, '验证合约已暂停');
    Crowdsale.pause(owner, '验证重复暂停错误', true, /Pausable: paused/);
    Crowdsale.pause(sender, '验证无权暂停错误', true, /PauserRole: caller does not have the Pauser role/);
    Crowdsale.unpause(owner, '恢复暂停合约');
    Crowdsale.paused(false, '验证合约未暂停');
    Crowdsale.unpause(owner, '验证重复恢复暂停错误', true, /Pausable: not paused/);
    Crowdsale.unpause(sender, '验证无权恢复暂停错误', true, /PauserRole: caller does not have the Pauser role/);
});
describe("测试有时限众筹合约的特殊方法", async function () {
    it('验证开始时间: openingTime()', async function () {
        assert.equal(openingTime, await CrowdsaleInstance.openingTime());
    });
    it('验证结束时间: closingTime()', async function () {
        assert.equal(closingTime, await CrowdsaleInstance.closingTime());
    });
    Crowdsale.isOpen(false, '验证合约未开始');
    Crowdsale.hasClosed(false, '验证未到期');
    it('推进时间到众筹开始时间： time.increaseTo(openingTime)', async function () {
        await time.increaseTo(openingTime);
    });
    Crowdsale.isOpen(true, '验证合约已开始');
});
describe("测试设置白名单管理员的方法", function () {
    Crowdsale.addWhitelistAdmin(sender, sender, '无权添加白名单管理员错误', true, /WhitelistAdminRole: caller does not have the WhitelistAdmin role/);
    Crowdsale.addWhitelistAdmin(sender, owner, '添加白名单管理员');
    Crowdsale.addWhitelistAdmin(sender, owner, '重复添加白名单管理员错误', true, /Roles: account already has role/);
    Crowdsale.isWhitelistAdmin(sender, true, '验证账户是白名单管理员');
    Crowdsale.renounceWhitelistAdmin(sender, '撤销白名单管理员');
    Crowdsale.isWhitelistAdmin(sender, false, '验证账户不是白名单管理员');
    Crowdsale.renounceWhitelistAdmin(sender, '重复撤销白名单管理员错误', true, /Roles: account does not have role/);
});
describe("测试设置白名单的方法", function () {
    Crowdsale.addWhitelisted(sender, sender, '无权添加白名单错误', true, /WhitelistAdminRole: caller does not have the WhitelistAdmin role/);
    Crowdsale.addWhitelisted(sender, owner, '添加白名单');
    Crowdsale.addWhitelisted(sender, owner, '重复添加白名单错误', true, /Roles: account already has role/);
    Crowdsale.isWhitelisted(sender, true, '验证账户是白名单');
    Crowdsale.renounceWhitelisted(sender, '撤销白名单');
    Crowdsale.isWhitelisted(sender, false, '验证账户不是白名单');
    Crowdsale.renounceWhitelisted(sender, '重复撤销白名单错误', true, /Roles: account does not have role/);
    Crowdsale.addWhitelisted(purchaser, owner, '再次添加白名单');
    Crowdsale.removeWhitelisted(purchaser, owner, '删除白名单');
    Crowdsale.removeWhitelisted(purchaser, owner, '重复删除白名单', true, /Roles: account does not have role/);
    Crowdsale.removeWhitelisted(purchaser, sender, '无权删除白名单', true, /WhitelistAdminRole: caller does not have the WhitelistAdmin role/);
});

describe("测试众筹结束的方法", function () {
    Crowdsale.finalized(false, '验证众筹未结束');
    Crowdsale.finalize('验证众筹未到期无法结束', true, /FinalizableCrowdsale: not closed/);//
});

describe("测试众筹结束后交付的方法", function () {
    Crowdsale.balanceOf('0', owner, '验证账户在众筹合约的余额为0');
    Crowdsale.withdrawTokens(owner, '验证众筹未结束账户无法提款', true, /RefundablePostDeliveryCrowdsale: not finalized/);
});

describe("测试众筹目标的方法", function () {
    it('封顶目标数额: goal()', async function () {
        assert.equal(ether(goal).toString(), (await CrowdsaleInstance.goal()).toString());
    });
    Crowdsale.claimRefund(owner, '众筹未结束不能退款', true, /RefundableCrowdsale: not finalized/);
    Crowdsale.goalReached(false, '验证没有到达众筹目标');//
});

describe("测试众筹使用顺序", async function () {
    describe("购买前准备:", async function () {
        it('记录purchaser当前ETH余额:', async function () {
            purchaserBalance = await web3.eth.getBalance(purchaser);
        });
        it('记录sender当前ETH余额:', async function () {
            senderBalance = await web3.eth.getBalance(sender);
        });
        Crowdsale.addWhitelisted(purchaser, owner, '添加白名单');
        Crowdsale.addWhitelisted(beneficiary, owner, '添加白名单');
        Crowdsale.setCap(purchaser, owner, EthValue, '设置配额');
        Crowdsale.setCap(beneficiary, owner, EthValue, '设置配额');
    });
    describe("购买代币:", async function () {

        Crowdsale.buyTokens(purchaser, EthValue, '购买代币');
        Crowdsale.buyTokens(purchaser, EthValue, '超配额购买代币', true, /IndividuallyCappedCrowdsale: beneficiary's cap exceeded/);
        Crowdsale.buyTokens(beneficiary, cap, '超额购买代币', true, /CappedCrowdsale: cap exceeded/);
        it('验证purchaser的ETH余额减少' + EthValue, async function () {
            let _purchaserBalance = parseInt(web3.utils.fromWei((await web3.eth.getBalance(purchaser) - purchaserBalance).toString(), 'ether'));
            assert.equal(EthValue, _purchaserBalance * -1);
        });

        Crowdsale.buyTokens(beneficiary, EthValue, '购买代币');
    });
    describe("购买后验证:", async function () {

        weiRaised = (parseInt(EthValue) * 2).toString();
        Crowdsale.weiRaised(weiRaised, '众筹收入为' + weiRaised);

        ERC20.balanceOf('0', beneficiary, '购买者账户余额');

        Crowdsale.capReached(true, '众筹已经到达封顶');//
        Crowdsale.balanceOf(TokenValue.toString(), beneficiary, '验证账户在众筹合约的余额为' + TokenValue);
        Crowdsale.getContribution(beneficiary, EthValue, '验证账户贡献为' + EthValue);

    });
    describe("结束众筹:", async function () {
        it('推进时间到众筹结束时间： time.increaseTo(closingTime)', async function () {
            await time.increaseTo(closingTime + 1);
        });
        Crowdsale.hasClosed(true, '验证众筹已到期');
        Crowdsale.finalize('验证众筹到期触发结束');
        Crowdsale.finalized(true, '验证众筹已结束');
    
        const totalSupplyNow = totalSupply - TokenValue * 2 + TokenValue * 2;//代币销毁两份后再增发了两份
        ERC20.totalSupply(totalSupplyNow.toString());
        it('验证sender的ETH余额增加' + weiRaised, async function () {
            let _senderBalance = parseInt(web3.utils.fromWei((await web3.eth.getBalance(sender) - senderBalance).toString(), 'ether'));
            assert.equal(weiRaised, _senderBalance);
        });
        Crowdsale.claimRefund(beneficiary, '众筹结束达到目标不能退款', true, /RefundableCrowdsale: goal reached/);
        Crowdsale.withdrawTokens(beneficiary, '验证众筹结束后提款');
        ERC20.balanceOf(TokenValue, beneficiary, '购买者账户余额为' + TokenValue);
        Crowdsale.balanceOf('0', beneficiary, '验证账户在众筹合约的余额为0');
    });
});
