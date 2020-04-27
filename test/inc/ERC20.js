const assert = require('assert');
const { accounts } = require('@openzeppelin/test-environment');
const {
    BN,
    constants,
    expectEvent,
    expectRevert,
    ether
} = require('@openzeppelin/test-helpers');
module.exports = (ERC20Contract, param) => {
    [owner, sender, receiver, purchaser, beneficiary] = accounts;
    value = ether('100');
    before(async function () {
        //布署代币合约
        ERC20Instance = await ERC20Contract.new(...param, { from: owner });
    });
    describe("测试ERC20合约的基本信息", async function () {
        it('代币名称: name()', async function () {
            assert.equal(param[0], await ERC20Instance.name());
        });
        it('代币缩写: symbol()', async function () {
            assert.equal(param[1], await ERC20Instance.symbol());
        });
        it('代币精度: decimals()', async function () {
            const decimals = await ERC20Instance.decimals();
            assert.equal(param[2], decimals.toString());
        });
    });
    describe("测试ERC20合约的标准方法", async function () {
        //测试代币总量
        it('代币总量: totalSupply()', async function () {
            assert.equal(ether(param[3].toString()).toString(), (await ERC20Instance.totalSupply()).toString());
        });
        //测试创建者账户余额
        it('账户余额: balanceOf()', async function () {
            assert.equal(ether(param[3].toString()).toString(), (await ERC20Instance.balanceOf(owner)).toString());
        });
        //测试代币发送,0地址错误
        it('代币发送,0地址错误: transfer()', async function () {
            await expectRevert(
                ERC20Instance.transfer(constants.ZERO_ADDRESS, value),
                'ERC20: transfer to the zero address',
            );
        });
        //测试代币发送,并触发事件
        it('测试代币发送,并触发事件', async function () {
            let receipt = await ERC20Instance.transfer(
                receiver, value, { from: owner }
            );
            expectEvent(receipt, 'Transfer', {
                from: owner,
                to: receiver,
                value: value,
            });
        });
        //测试接受者账户余额
        it('测试接受者账户余额', async function () {
            assert.equal(value, (await ERC20Instance.balanceOf(receiver)).toString());
        });
        //测试批准代币,账户0批准100个代币给账户2,再查询账户0给账户2的批准为100
        it('批准代币: approve()', async function () {
            let receipt = await ERC20Instance.approve(sender, value, { from: owner });
            assert.equal(value, (await ERC20Instance.allowance(owner, sender)).toString());
            expectEvent(receipt, 'Approval', {
                owner: owner,
                spender: sender,
                value: value,
            });
        });
        //测试发送批准,账户2将账户0的100个代币发送给账户3,再查询账户3的余额为100
        it('发送批准: transferFrom()', async function () {
            let receipt = await ERC20Instance.transferFrom(owner, purchaser, value, { from: sender });
            assert.equal(value, (await ERC20Instance.balanceOf(purchaser)).toString());
            expectEvent(receipt, 'Transfer', {
                from: owner,
                to: purchaser,
                value: value,
            });
        });
        //测试增加批准额,账户0给账户2增加100个代币的批准,再查询账户0给账户2的批准为100
        it('增加批准额: increaseAllowance()', async function () {
            let receipt = await ERC20Instance.increaseAllowance(sender, value, { from: owner });
            assert.equal(value, (await ERC20Instance.allowance(owner, sender)).toString());
            expectEvent(receipt, 'Approval', {
                owner: owner,
                spender: sender,
                value: value,
            });
        });
        //测试减少批准额,账户0减少账户2的批准额100个代币,再查询账户0给账户2的批准为0
        it('减少批准额: decreaseAllowance()', async function () {
            let receipt = await ERC20Instance.decreaseAllowance(sender, value, { from: owner });
            assert.equal(0, (await ERC20Instance.allowance(owner, sender)).toString());
            expectEvent(receipt, 'Approval', {
                owner: owner,
                spender: sender,
                value: new BN(0),
            });
        });
    });
    after(() => {
        return ERC20Instance;
    })
}
