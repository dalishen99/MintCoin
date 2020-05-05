const assert = require('assert');
const { ether, constants, expectEvent } = require('@openzeppelin/test-helpers');
exports.detail = () => {
    it('代币名称: name()', async function () {
        assert.equal(ERC20Param[0], await ERC20Instance.name());
    });
    it('代币缩写: symbol()', async function () {
        assert.equal(ERC20Param[1], await ERC20Instance.symbol());
    });
    it('代币精度: decimals()', async function () {
        assert.equal(ERC20Param[2], (await ERC20Instance.decimals()).toString());
    });
    it('代币总量: totalSupply()', async function () {
        assert.equal(ether(ERC20Param[3]).toString(), (await ERC20Instance.totalSupply()).toString());
    });
}
exports.totalSupply = (totalSupply) => {
    //测试代币总量
    it('代币总量: totalSupply()', async function () {
        assert.equal(ether(totalSupply).toString(), (await ERC20Instance.totalSupply()).toString());
    });
}
exports.balanceOf = (balance, account, desc) => {
    //测试账户余额
    it(desc + ': balanceOf()', async function () {
        assert.equal(ether(balance).toString(), (await ERC20Instance.balanceOf(account)).toString());
    });
}
exports.cap = (cap,desc) => {
    //测试封顶额
    it(desc + ': cap()', async function () {
        assert.equal(ether(cap).toString(), (await ERC20Instance.cap()).toString());
    });
}
exports.transfer = (sender, receiver, amount, desc, reject, msg) => {
    //测试代币发送
    it(desc + ': transfer()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.transfer(receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC20Instance.transfer(receiver, ether(amount), { from: sender });
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
            await assert.rejects(ERC20Instance.approve(receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC20Instance.approve(receiver, ether(amount), { from: sender });
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
            await assert.rejects(ERC20Instance.transferFrom(owner, receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC20Instance.transferFrom(owner, receiver, ether(amount), { from: sender });
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
        assert.equal(ether(amount), (await ERC20Instance.allowance(owner, sender)).toString());
    });
}
exports.increaseAllowance = (sender, receiver, amount, desc, reject, msg) => {
    //测试增加批准额
    it(desc + ': increaseAllowance()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.increaseAllowance(receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC20Instance.increaseAllowance(receiver, ether(amount), { from: sender });
            expectEvent(receipt, 'Approval', {
                owner: sender,
                spender: receiver,
            });
        }
    });
}
exports.decreaseAllowance = (sender, receiver, amount, desc, reject, msg) => {
    //测试减少批准额
    it(desc + ': decreaseAllowance()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.decreaseAllowance(receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC20Instance.decreaseAllowance(receiver, ether(amount), { from: sender });
            expectEvent(receipt, 'Approval', {
                owner: sender,
                spender: receiver,
            });
        }
    });
}
exports.burn = (sender, amount, desc, reject, msg) => {
    //测试销毁方法
    it(desc + ': burn()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.burn(ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC20Instance.burn(ether(amount), { from: sender });
            expectEvent(receipt, 'Transfer', {
                from: sender,
                to: constants.ZERO_ADDRESS,
                value: ether(amount),
            });
        }
    });
}
exports.burnFrom = (owner, sender, amount, desc, reject, msg) => {
    //测试销毁批准方法
    it(desc + ': burnFrom()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.burnFrom(owner, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC20Instance.burnFrom(owner, ether(amount), { from: sender });
            expectEvent(receipt, 'Transfer', {
                from: owner,
                to: constants.ZERO_ADDRESS,
                value: ether(amount),
            });
            expectEvent(receipt, 'Approval', {
                owner: owner,
                spender: sender,
            });
        }
    });
}
exports.mint = (owner, beneficiary, amount, desc, reject, msg) => {
    //测试铸币方法
    it(desc + ': mint()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.mint(beneficiary, ether(amount), { from: owner }), msg);
        } else {
            let receipt = await ERC20Instance.mint(beneficiary, ether(amount), { from: owner });
            expectEvent(receipt, 'Transfer', {
                from: constants.ZERO_ADDRESS,
                to: beneficiary,
                value: ether(amount),
            });
        }
    });
}

exports.addMinter = (minter, sender, desc, reject, msg) => {
    //测试添加暂停管理员
    it(desc + ': addMinter()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.addMinter(minter, { from: sender }), msg);
        } else {
            let receipt = await ERC20Instance.addMinter(minter, { from: sender });
            expectEvent(receipt, 'MinterAdded', {
                account: minter
            });
        }
    });
}
exports.isMinter = (minter, isMinter, desc) => {
    //测试账户拥有暂停权
    it(desc + ': isMinter()', async function () {
        assert.equal(isMinter, await ERC20Instance.isMinter(minter));
    });
}
exports.renounceMinter = (minter, desc, reject, msg) => {
    //测试撤销暂停管理员
    it(desc + ': renounceMinter()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.renounceMinter({ from: minter }), msg);
        } else {
            let receipt = await ERC20Instance.renounceMinter({ from: minter });
            expectEvent(receipt, 'MinterRemoved', {
                account: minter
            });
        }
    });
}

exports.addPauser = (pauser, sender, desc, reject, msg) => {
    //测试添加暂停管理员
    it(desc + ': addPauser()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.addPauser(pauser, { from: sender }), msg);
        } else {
            let receipt = await ERC20Instance.addPauser(pauser, { from: sender });
            expectEvent(receipt, 'PauserAdded', {
                account: pauser
            });
        }
    });
}
exports.isPauser = (pauser, isPauser, desc) => {
    //测试账户拥有暂停权
    it(desc + ': isPauser()', async function () {
        assert.equal(isPauser, await ERC20Instance.isPauser(pauser));
    });
}
exports.renouncePauser = (pauser, desc, reject, msg) => {
    //测试撤销暂停管理员
    it(desc + ': renouncePauser()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.renouncePauser({ from: pauser }), msg);
        } else {
            let receipt = await ERC20Instance.renouncePauser({ from: pauser });
            expectEvent(receipt, 'PauserRemoved', {
                account: pauser
            });
        }
    });
}
exports.paused = (paused, desc) => {
    //测试是否已暂停
    it(desc + ': paused()', async function () {
        assert.equal(paused, await ERC20Instance.paused());
    });
}
exports.pause = (pauser, desc, reject, msg) => {
    //测试撤销暂停管理员
    it(desc + ': pause()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.pause({ from: pauser }), msg);
        } else {
            let receipt = await ERC20Instance.pause({ from: pauser });
            expectEvent(receipt, 'Paused', {
                account: pauser
            });
        }
    });
}
exports.unpause = (pauser, desc, reject, msg) => {
    //测试恢复合约
    it(desc + ': unpause()', async function () {
        if (reject) {
            await assert.rejects(ERC20Instance.unpause({ from: pauser }), msg);
        } else {
            let receipt = await ERC20Instance.unpause({ from: pauser });
            expectEvent(receipt, 'Unpaused', {
                account: pauser
            });
        }
    });
}
