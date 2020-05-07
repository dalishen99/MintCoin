const assert = require('assert');
const { contract, accounts, web3 } = require('@openzeppelin/test-environment');
const { ether, makeInterfaceId, constants, singletons, expectEvent } = require('@openzeppelin/test-helpers');
const ERC777Contract = contract.fromArtifact("ERC777Contract");
const TokensSender = contract.fromArtifact("TokensSender");
const TokensRecipient = contract.fromArtifact("TokensRecipient");
const ERC777 = require('../inc/ERC777');
//ERC777代币
[owner, sender, receiver, purchaser, beneficiary] = accounts;
const EthValue = '10';
const initialSupply = '1000000000';
const defaultOperators = [sender];
let amount = '100';
const userData = web3.utils.toHex('A gift');
describe("ERC777代币", function () {
    it('实例化ERC1820注册表', async function () {
        ERC1820RegistryInstance = await singletons.ERC1820Registry(owner);
    });
    it('布署代币合约', async function () {
        ERC777Param = [
            //构造函数的参数
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            ether(initialSupply),      //发行总量
            defaultOperators    //默认操作员
        ]
        ERC777Instance = await ERC777Contract.new(...ERC777Param, { from: owner });
    });
    it('布署发送接口合约', async function () {
        TokensSenderInstance = await TokensSender.new(true, { from: owner });
    });
    it('布署接受接口合约', async function () {
        TokensRecipientInstance = await TokensRecipient.new(true, { from: receiver });
    });
});

describe("注册ERC1820接口", function () {
    it('注册代币发送接口: setInterfaceImplementer() ERC777TokensSender', async function () {
        await ERC1820RegistryInstance.setInterfaceImplementer(
            owner, 
            makeInterfaceId.ERC1820('ERC777TokensSender'),
            TokensSenderInstance.address,
            { from: owner }
        );
    });
    it('验证代币发送接口: getInterfaceImplementer() ERC777TokensSender', async function () {
        assert.equal(TokensSenderInstance.address, await ERC1820RegistryInstance.getInterfaceImplementer(
            TokensSenderInstance.address,
            makeInterfaceId.ERC1820('ERC777TokensSender')
        ))
    });
    it('注册代币接收接口: setInterfaceImplementer() ERC777TokensRecipient', async function () {
        await ERC1820RegistryInstance.setInterfaceImplementer(
            receiver,
            makeInterfaceId.ERC1820('ERC777TokensRecipient'),
            TokensRecipientInstance.address,
            { from: receiver }
        );
    });
    it('验证代币接收接口: setInterfaceImplementer() ERC777TokensRecipient', async function () {
        assert.equal(TokensRecipientInstance.address, await ERC1820RegistryInstance.getInterfaceImplementer(
            receiver,
            makeInterfaceId.ERC1820('ERC777TokensRecipient')
        ))
    });
});

describe("测试ERC777合约基本信息", function () {
    ERC777.detail();
});
describe("测试ERC777兼容ERC777合约的方法", async function () {
    //测试余额
    ERC777.balanceOf(initialSupply, owner, '创建者账户余额');
    //测试发送
    ERC777.transfer(owner, constants.ZERO_ADDRESS, amount, '代币发送,0地址错误', true, /ERC777: transfer to the zero address/);
    ERC777.transfer(owner, purchaser, amount, '代币发送');//owner-amount
    //测试超额发送
    ERC777.transfer(owner, purchaser, initialSupply, '超额发送错误', true, /ERC777: transfer amount exceeds balance/);
    //测试余额
    ERC777.balanceOf(amount, purchaser, '接收者账户余额');//purchaser.balance = value
    //测试批准
    ERC777.approve(owner, constants.ZERO_ADDRESS, amount, '批准代币,0地址错误', true, /ERC777: approve to the zero address/);
    ERC777.approve(purchaser, beneficiary, amount, '批准代币');
    //验证批准
    ERC777.allowance(purchaser, beneficiary, amount, '验证批准数额');//purchaser=>purchaser = value
    //测试传送批准
    ERC777.transferFrom(purchaser, beneficiary, beneficiary, amount, '批准发送');//beneficiary.balance = value
    //测试余额
    ERC777.balanceOf(amount, beneficiary, '接收者账户余额');//purchaser.balance = value
    //测试超额发送批准
    ERC777.transferFrom(purchaser, beneficiary, beneficiary, amount, '超额批准发送', true, /ERC777: transfer amount exceeds balance/);
    //验证批准归零
    ERC777.allowance(purchaser, beneficiary, '0', '批准额归零');//purchaser=>purchaser = 0
});
describe("测试ERC777合约的方法", function () {
    //send()
    it('发送方法: send()', async function () {
        let receipt = await ERC777Instance.send(receiver, ether(amount), userData, { from: owner });
        expectEvent(receipt, 'Sent', {
            operator: owner,
            from: owner,
            to: receiver,
            amount: ether(amount),
            data: userData,
            operatorData: null
        });
        expectEvent(receipt, 'Transfer', {
            from: owner,
            to: receiver,
            value: ether(amount),
        });
    });
    it('验证发送接口: TokensSender()', async function () {
        assert.equal(ERC777Instance.address, await TokensSenderInstance.token(receiver));
        assert.equal(owner, await TokensSenderInstance.operator(receiver));
        assert.equal(owner, await TokensSenderInstance.from(receiver));
        assert.equal(receiver, await TokensSenderInstance.to(receiver));
        assert.equal(ether(amount).toString(), (await TokensSenderInstance.amount(receiver)).toString());
        assert.equal(userData, await TokensSenderInstance.data(receiver));
        assert.equal(null, await TokensSenderInstance.operatorData(receiver));
        assert.equal(ether((parseInt(initialSupply) - parseInt(amount)).toString()).toString(), (await TokensSenderInstance.balanceOf(owner)).toString());
        assert.equal('0', (await TokensSenderInstance.balanceOf(receiver)).toString());
    });
    it('验证接收接口: TokensRecipient()', async function () {
        assert.equal(ERC777Instance.address, await TokensRecipientInstance.token(owner));
        assert.equal(owner, await TokensRecipientInstance.operator(owner));
        assert.equal(owner, await TokensRecipientInstance.from(owner));
        assert.equal(receiver, await TokensRecipientInstance.to(owner));
        assert.equal(ether(amount).toString(), (await TokensRecipientInstance.amount(owner)).toString());
        assert.equal(userData, await TokensRecipientInstance.data(owner));
        assert.equal(null, await TokensRecipientInstance.operatorData(owner));
        assert.equal(ether((parseInt(initialSupply) - parseInt(amount) * 2).toString()).toString(), (await TokensRecipientInstance.balanceOf(owner)).toString());
        assert.equal(ether(amount), (await TokensRecipientInstance.balanceOf(receiver)).toString());
    });
    //burn()
    it('销毁方法: burn()', async function () {
        let receipt = await ERC777Instance.burn(ether(amount), userData, { from: receiver });
        expectEvent(receipt, 'Burned', {
            operator: receiver,
            from: receiver,
            amount: ether(amount),
            data: userData,
            operatorData: null
        });
        expectEvent(receipt, 'Transfer', {
            from: receiver,
            to: constants.ZERO_ADDRESS,
            value: ether(amount),
        });
    });
    //isOperatorFor()
    it('验证操作员: isOperatorFor()', async function () {
        assert.ok(await ERC777Instance.isOperatorFor(sender, owner));
    });
    //authorizeOperator()
    it('设置操作员: authorizeOperator()', async function () {
        await ERC777Instance.authorizeOperator(owner, { from: sender });
    });
    //isOperatorFor()
    it('验证操作员: isOperatorFor()', async function () {
        assert.ok(await ERC777Instance.isOperatorFor(owner, sender));
    });
    //revokeOperator()
    it('撤销操作员: revokeOperator()', async function () {
        await ERC777Instance.revokeOperator(owner, { from: sender });
    });
    //isOperatorFor()
    it('验证操作员: isOperatorFor()', async function () {
        assert.ok(!await ERC777Instance.isOperatorFor(owner, sender));
    });
    //defaultOperators()
    it('默认操作员: defaultOperators()', async function () {
        assert.equal(defaultOperators.toString(), await ERC777Instance.defaultOperators());
    });
    //operatorSend()
    it('操作员发送方法: operatorSend()', async function () {
        let receipt = await ERC777Instance.operatorSend(owner, receiver, ether(amount), userData, '0x00', { from: sender });
        expectEvent(receipt, 'Sent', {
            operator: sender,
            from: owner,
            to: receiver,
            amount: ether(amount),
            data: userData,
            operatorData: '0x00'
        });
        expectEvent(receipt, 'Transfer', {
            from: owner,
            to: receiver,
            value: ether(amount),
        });
    });
    //operatorBurn()
    it('操作员销毁方法: operatorBurn()', async function () {
        let receipt = await ERC777Instance.operatorBurn(receiver, ether(amount), userData, '0x00', { from: sender });
        expectEvent(receipt, 'Burned', {
            operator: sender,
            from: receiver,
            amount: ether(amount),
            data: userData,
            operatorData: '0x00'
        });
        expectEvent(receipt, 'Transfer', {
            from: receiver,
            to: constants.ZERO_ADDRESS,
            value: ether(amount),
        });
    });
});
describe("测试发送和接收接口的拒绝方法", function () {
    it('设置拒绝接收: rejectTokens()', async function () {
        await TokensRecipientInstance.rejectTokens({ from: receiver });
    });
    ERC777.transfer(owner, receiver, amount, '验证代币接收者拒绝接收', true, /Receive not allowed/);
    it('设置拒绝发送: rejectTokensToSend()', async function () {
        await TokensSenderInstance.rejectTokensToSend({ from: owner });
    });
    ERC777.transfer(owner, receiver, amount, '验证代币发送者拒绝发送', true, /Send not allowed/);
});
