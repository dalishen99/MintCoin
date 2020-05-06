const assert = require('assert');
const { ether, constants, expectEvent } = require('@openzeppelin/test-helpers');
exports.detail = () => {
    it('代币名称: name()', async function () {
        assert.equal(ERC777Param[0], await ERC777Instance.name());
    });
    it('代币缩写: symbol()', async function () {
        assert.equal(ERC777Param[1], await ERC777Instance.symbol());
    });
    it('代币精度: decimals()', async function () {
        assert.equal('18', (await ERC777Instance.decimals()).toString());
    });
    it('代币总量: totalSupply()', async function () {
        assert.equal(ERC777Param[2].toString(), (await ERC777Instance.totalSupply()).toString());
    });
    it('代币最小单位: granularity()', async function () {
        assert.equal('1', (await ERC777Instance.granularity()).toString());
    });
}
exports.totalSupply = (totalSupply) => {
    //测试代币总量
    it('代币总量: totalSupply()', async function () {
        assert.equal(ether(totalSupply).toString(), (await ERC777Instance.totalSupply()).toString());
    });
}
exports.balanceOf = (balance, account, desc) => {
    //测试账户余额
    it(desc + ': balanceOf()', async function () {
        assert.equal(ether(balance).toString(), (await ERC777Instance.balanceOf(account)).toString());
    });
}
exports.cap = (cap,desc) => {
    //测试封顶额
    it(desc + ': cap()', async function () {
        assert.equal(ether(cap).toString(), (await ERC777Instance.cap()).toString());
    });
}
exports.transfer = (sender, receiver, amount, desc, reject, msg) => {
    //测试代币发送
    it(desc + ': transfer()', async function () {
        if (reject) {
            await assert.rejects(ERC777Instance.transfer(receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC777Instance.transfer(receiver, ether(amount), { from: sender });
            expectEvent(receipt, 'Transfer', {
                from: sender,
                to: receiver,
                value: ether(amount),
            });
        }
    });
}
exports.approve = (sender, receiver, amount, desc, reject, msg) => {
    it(desc + ': approve()', async function () {
        if (reject) {
            await assert.rejects(ERC777Instance.approve(receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC777Instance.approve(receiver, ether(amount), { from: sender });
            expectEvent(receipt, 'Approval', {
                owner: sender,
                spender: receiver,
                value: ether(amount),
            });
        }
    });
}
exports.transferFrom = (owner, sender, receiver, amount, desc, reject, msg) => {
    //测试批准发送
    it(desc + ': transferFrom()', async function () {
        if (reject) {
            await assert.rejects(ERC777Instance.transferFrom(owner, receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC777Instance.transferFrom(owner, receiver, ether(amount), { from: sender });
            expectEvent(receipt, 'Transfer', {
                from: owner,
                to: receiver,
                value: ether(amount),
            });
        }
    });
}
exports.allowance = (owner, sender, amount, desc) => {
    //测试批准数额
    it(desc + ': allowance()', async function () {
        assert.equal(ether(amount), (await ERC777Instance.allowance(owner, sender)).toString());
    });
}
exports.burn = (sender, amount, desc, reject, msg) => {
    //测试销毁方法
    it(desc + ': burn()', async function () {
        if (reject) {
            await assert.rejects(ERC777Instance.burn(ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC777Instance.burn(ether(amount), { from: sender });
            expectEvent(receipt, 'Transfer', {
                from: sender,
                to: constants.ZERO_ADDRESS,
                value: ether(amount),
            });
        }
    });
}