const assert = require('assert');
const { constants, expectEvent } = require('@openzeppelin/test-helpers');
exports.detail = () => {
    it('代币名称: name()', async function () {
        assert.equal(ERC721Param[0], await ERC721Instance.name());
    });
    it('代币缩写: symbol()', async function () {
        assert.equal(ERC721Param[1], await ERC721Instance.symbol());
    });
    it('代币基本地址: baseURI()', async function () {
        assert.equal(ERC721Param[2], await ERC721Instance.baseURI());
    });
}
exports.awardItem = (account, uri, desc, reject, msg) => {
    //添加代币方法
    it(desc + ': awardItem()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.awardItem(account, uri, { from: account }), msg);
        } else {
            const receipt = await ERC721Instance.awardItem(account, uri, { from: account });
            expectEvent(receipt, 'Transfer', {
                from: constants.ZERO_ADDRESS,
                to: account,
            });
        }
    });
}
exports.totalSupply = (totalSupply) => {
    //测试代币总量
    it('代币总量: totalSupply()', async function () {
        assert.equal(totalSupply, (await ERC721Instance.totalSupply()).toString());
    });
}
exports.balanceOf = (balance, account, desc, reject, msg) => {
    //测试账户余额
    it(desc + ': balanceOf()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.balanceOf(account), msg);
        } else {
            assert.equal(balance, await ERC721Instance.balanceOf(account));
        }
    });
}

exports.setApprovalForAll = (owner, operator, desc, reject, msg) => {
    //批准全部代币
    it(desc + ': setApprovalForAll()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.setApprovalForAll(receiver, true, { from: receiver }), msg);
        } else {
            let receipt = await ERC721Instance.setApprovalForAll(operator, true, { from: owner });
            expectEvent(receipt, 'ApprovalForAll', {
                owner: owner,
                operator: operator,
                approved: true
            });
        }
    });
}
exports.isApprovedForAll = (owner, operator, desc) => {
    //验证代币全部被批准
    it(desc + ': isApprovedForAll()', async function () {
        assert.ok(await ERC721Instance.isApprovedForAll(owner, operator));
    });
}
exports.tokenOfOwnerByIndex = (owner, index, desc, reject, msg) => {
    //根据账户的代币索引获取代币id
    it(desc + ': tokenOfOwnerByIndex()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.tokenOfOwnerByIndex(owner, index), msg);
        } else {
            tokenId = await ERC721Instance.tokenOfOwnerByIndex(owner, index);
        }
    });
}
exports.tokenByIndex = (index, _tokenId, desc, reject, msg) => {
    //根据代币索引获取代币id
    it(desc + ': tokenByIndex()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.tokenByIndex(index), msg);
        } else if (_tokenId) {
            assert.equal(_tokenId, await ERC721Instance.tokenByIndex(index));
        } else {
            assert.equal(tokenId, await ERC721Instance.tokenByIndex(index));
        }
    });
}
exports.ownerOf = (owner, _tokenId, desc, reject, msg) => {
    //根据tokenID验证账户地址
    it(desc + ': ownerOf()', async function () {
        if (_tokenId) {
            await assert.rejects(ERC721Instance.ownerOf(_tokenId), msg);
        } else if (reject) {
            await assert.rejects(ERC721Instance.ownerOf(tokenId), msg);
        } else {
            assert.equal(owner, await ERC721Instance.ownerOf(tokenId));
        }
    });
}
exports.tokenURI = (tokenURI, _tokenId, desc, reject, msg) => {
    //验证tokenURI
    it(desc + ': tokenURI()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.tokenURI(_tokenId), msg);
        } else if (_tokenId) {
            assert.equal(tokenURI, await ERC721Instance.tokenURI(_tokenId));
        } else {
            assert.equal(tokenURI, await ERC721Instance.tokenURI(tokenId));
        }
    });
}
exports.approve = (to, owner, _tokenId, desc, reject, msg) => {
    //批准代币给自己的错误
    it(desc + ': approve()', async function () {
        if (_tokenId) {
            await assert.rejects(ERC721Instance.approve(to, _tokenId, { from: owner }), msg);
        } else if (reject) {
            await assert.rejects(ERC721Instance.approve(to, tokenId, { from: owner }), msg);
        } else {
            let receipt = await ERC721Instance.approve(to, tokenId, { from: owner });
            expectEvent(receipt, 'Approval', {
                owner: owner,
                approved: sender,
                tokenId: tokenId
            });
        }
    });
}
exports.getApproved = (sender, _tokenId, desc, reject, msg) => {
    //获取代币批准的地址
    it(desc + ': getApproved()', async function () {
        if (_tokenId) {
            await assert.rejects(ERC721Instance.getApproved(_tokenId), msg);
        } else if (reject) {
            await assert.rejects(ERC721Instance.getApproved(tokenId), msg);
        } else {
            assert.equal(sender, await ERC721Instance.getApproved(tokenId));
        }
    });
}
exports.transferFrom = (sender, from, to, _tokenId, desc, reject, msg) => {
    //发送批准
    it(desc + ': transferFrom()', async function () {
        if (_tokenId) {
            await assert.rejects(ERC721Instance.transferFrom(from, to, _tokenId, { from: sender }), msg);
        } else if (reject) {
            await assert.rejects(ERC721Instance.transferFrom(from, to, tokenId, { from: sender }), msg);
        } else {
            let receipt = await ERC721Instance.transferFrom(from, to, tokenId, { from: sender });
            expectEvent(receipt, 'Transfer', {
                from: from,
                to: to,
                tokenId: tokenId
            });
        }
    });
}
exports.safeTransferFrom = (sender, from, to, _tokenId, desc, reject, msg) => {
    //安全发送批准
    it(desc + ': safeTransferFrom()', async function () {
        if (_tokenId) {
            await assert.rejects(ERC721Instance.safeTransferFrom(from, to, _tokenId, { from: sender }), msg);
        } else if (reject) {
            await assert.rejects(ERC721Instance.safeTransferFrom(from, to, tokenId, { from: sender }), msg);
        } else {
            let receipt = await ERC721Instance.safeTransferFrom(from, to, tokenId, { from: sender });
            expectEvent(receipt, 'Transfer', {
                from: from,
                to: to,
                tokenId: tokenId
            });
        }
    });
}
exports.addMinter = (minter, sender, desc, reject, msg) => {
    //测试添加暂停管理员
    it(desc + ': addMinter()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.addMinter(minter, { from: sender }), msg);
        } else {
            let receipt = await ERC721Instance.addMinter(minter, { from: sender });
            expectEvent(receipt, 'MinterAdded', {
                account: minter
            });
        }
    });
}
exports.isMinter = (minter, isMinter, desc) => {
    //测试账户拥有暂停权
    it(desc + ': isMinter()', async function () {
        assert.equal(isMinter, await ERC721Instance.isMinter(minter));
    });
}
exports.renounceMinter = (minter, desc, reject, msg) => {
    //测试撤销暂停管理员
    it(desc + ': renounceMinter()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.renounceMinter({ from: minter }), msg);
        } else {
            let receipt = await ERC721Instance.renounceMinter({ from: minter });
            expectEvent(receipt, 'MinterRemoved', {
                account: minter
            });
        }
    });
}

exports.mint = (minter, to, _tokenId, desc, reject, msg) => {
    //铸币方法
    it(desc + ': mint()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.mint(to, _tokenId, { from: minter }), msg);
        } else {
            let receipt = await ERC721Instance.mint(to, _tokenId, { from: minter });
            expectEvent(receipt, 'Transfer', {
                from: constants.ZERO_ADDRESS,
                to: to,
                tokenId: _tokenId
            });
        }
    });
}

exports.safeMint = (minter, to, _tokenId, desc, reject, msg) => {
    //安全铸币方法
    it(desc + ': mint()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.mint(to, _tokenId, { from: minter }), msg);
        } else {
            let receipt = await ERC721Instance.mint(to, _tokenId, { from: minter });
            expectEvent(receipt, 'Transfer', {
                from: constants.ZERO_ADDRESS,
                to: to,
                tokenId: _tokenId
            });
        }
    });
}
exports.mintWithTokenURI = (minter, to, uri, _tokenId, desc, reject, msg) => {
    //带URI铸币方法
    it(desc + ': mintWithTokenURI()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.mintWithTokenURI(to, _tokenId, uri, { from: minter }), msg);
        } else {
            let receipt = await ERC721Instance.mintWithTokenURI(to, _tokenId, uri, { from: minter });
            expectEvent(receipt, 'Transfer', {
                from: constants.ZERO_ADDRESS,
                to: to,
                tokenId: _tokenId
            });
        }
    });
}
exports.burn = (owner, _tokenId, desc, reject, msg) => {
    //测试销毁方法
    it(desc + ': burn()', async function () {
        let receipt;
        if (reject) {
            if (_tokenId) {
                await assert.rejects(ERC721Instance.burn(_tokenId, { from: owner }), msg);
            } else {
                await assert.rejects(ERC721Instance.burn(tokenId, { from: owner }), msg);
            }
        } else {
            if (_tokenId) {
                receipt = await ERC721Instance.burn(_tokenId, { from: owner });
                expectEvent(receipt, 'Transfer', {
                    from: owner,
                    to: constants.ZERO_ADDRESS,
                    tokenId: _tokenId,
                });
            } else {
                receipt = await ERC721Instance.burn(tokenId, { from: owner });
                expectEvent(receipt, 'Transfer', {
                    from: owner,
                    to: constants.ZERO_ADDRESS,
                    tokenId: tokenId,
                });
            }
        }
    });
}
exports.addPauser = (pauser, sender, desc, reject, msg) => {
    //测试添加暂停管理员
    it(desc + ': addPauser()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.addPauser(pauser, { from: sender }), msg);
        } else {
            let receipt = await ERC721Instance.addPauser(pauser, { from: sender });
            expectEvent(receipt, 'PauserAdded', {
                account: pauser
            });
        }
    });
}
exports.isPauser = (pauser, isPauser, desc) => {
    //测试账户拥有暂停权
    it(desc + ': isPauser()', async function () {
        assert.equal(isPauser, await ERC721Instance.isPauser(pauser));
    });
}
exports.renouncePauser = (pauser, desc, reject, msg) => {
    //测试撤销暂停管理员
    it(desc + ': renouncePauser()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.renouncePauser({ from: pauser }), msg);
        } else {
            let receipt = await ERC721Instance.renouncePauser({ from: pauser });
            expectEvent(receipt, 'PauserRemoved', {
                account: pauser
            });
        }
    });
}
exports.paused = (paused, desc) => {
    //测试是否已暂停
    it(desc + ': paused()', async function () {
        assert.equal(paused, await ERC721Instance.paused());
    });
}
exports.pause = (pauser, desc, reject, msg) => {
    //测试撤销暂停管理员
    it(desc + ': pause()', async function () {
        if (reject) {
            await assert.rejects(ERC721Instance.pause({ from: pauser }), msg);
        } else {
            let receipt = await ERC721Instance.pause({ from: pauser });
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
            await assert.rejects(ERC721Instance.unpause({ from: pauser }), msg);
        } else {
            let receipt = await ERC721Instance.unpause({ from: pauser });
            expectEvent(receipt, 'Unpaused', {
                account: pauser
            });
        }
    });
}