const assert = require('assert');
const { ether, constants, expectEvent } = require('@openzeppelin/test-helpers');
exports.detail = () => {
    it('代币名称: name()', async function () {
        assert.equal(ERC721Param[0], await ERC721Instance.name());
    });
    it('代币缩写: symbol()', async function () {
        assert.equal(ERC721Param[1], await ERC721Instance.symbol());
    });
}
exports.awardItem = (account,uri,desc) => {
    //测试代币总量
    it(desc + ': awardItem()', async function () {
        await ERC721Instance.awardItem(account,uri);
    });
}
exports.totalSupply = (totalSupply) => {
    //测试代币总量
    it('代币总量: totalSupply()', async function () {
        assert.equal(ether(totalSupply).toString(), (await ERC721Instance.totalSupply()).toString());
    });
}
exports.balanceOf = (balance, account, desc) => {
    //测试账户余额
    it(desc + ': balanceOf()', async function () {
        assert.equal(ether(balance).toString(), (await ERC721Instance.balanceOf(account)).toString());
    });
}
exports.transfer = (sender, receiver, amount, desc, reject, msg) => {
    //测试代币发送
    it(desc + ': transfer()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.transfer(receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC721Instance.transfer(receiver, ether(amount), { from: sender });
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
            await assert.rejects(ERC721Instance.approve(receiver, ether(amount), { from: sender }), msg);
        } else {
            let receipt = await ERC721Instance.approve(receiver, ether(amount), { from: sender });
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
            await assert.rejects(ERC721Instance.transferFrom(owner, receiver, ether(amount), { from: sender, gasPrice: 20 }), msg);
        } else {
            let receipt = await ERC721Instance.transferFrom(owner, receiver, ether(amount), { from: sender });
            expectEvent(receipt, 'Transfer', {
                from: owner,
                to: receiver,
                value: ether(amount),
            });
        }
    });
}