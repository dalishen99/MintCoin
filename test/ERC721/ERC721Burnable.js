const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { constants } = require('@openzeppelin/test-helpers');
const ERC721Contract = contract.fromArtifact("ERC721BurnableContract");
const ERC721 = require('../inc/ERC721');
//全功能ERC721代币
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
baseURI = 'https://github.com/Fankouzu/MintCoin/blob/master/';
tokenURI = 'token.json';
let tokenId;
describe("全功能ERC721代币", function () {
    it('布署ERC721合约', async function () {
        ERC721Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            baseURI             //代币基本地址
        ];
        ERC721Instance = await ERC721Contract.new(...ERC721Param, { from: owner });
    });
});
describe("测试ERC721合约", async function () {
    ERC721.detail();
    ERC721.awardItem(owner, tokenURI, '添加代币方法');

    ERC721.balanceOf('1', owner, '验证账户代币数量');
    ERC721.balanceOf('1', constants.ZERO_ADDRESS, '验证账户代币数量0地址错误', true, /ERC721: balance query for the zero address/);

    ERC721.tokenOfOwnerByIndex(owner, '0', '根据账户的代币索引获取代币id');
    ERC721.tokenOfOwnerByIndex(owner, '10', '根据错误的代币索引获取代币id', true, /ERC721Enumerable: owner index out of bounds/);

    ERC721.ownerOf(owner, false, '根据tokenID验证账户地址');
    ERC721.ownerOf(owner, '999', '根据错误的tokenID验证账户地址', true, /ERC721: owner query for nonexistent token/);

    ERC721.tokenURI(baseURI + tokenURI, false, '验证tokenURI');
    ERC721.tokenURI(baseURI + tokenURI, '999', '根据错误的tokenId验证tokenURI', true, /ERC721Metadata: URI query for nonexistent token/);

    ERC721.approve(owner, owner, false, '批准代币给自己的错误', true, /ERC721: approval to current owner/);
    ERC721.approve(sender, owner, '999', '批准错误的代币', true, /ERC721: owner query for nonexistent token/);
    ERC721.approve(sender, owner, false, '批准代币');

    ERC721.getApproved(sender, '获取代币批准的地址');
    ERC721.getApproved(sender, '获取错误的代币的批准地址', true, /ERC721: approved query for nonexistent token/);

    ERC721.transferFrom(sender, owner, receiver, false, '发送批准');
    ERC721.transferFrom(sender, owner, receiver, '999', '发送错误的tokenId批准', true, /ERC721: operator query for nonexistent token/);
    ERC721.ownerOf(receiver, false, '账户的代币id');
    ERC721.getApproved(constants.ZERO_ADDRESS, '验证代币批准的地址为0x0');
    ERC721.transferFrom(sender, owner, receiver, false, '重复发送批准错误', true, /ERC721: transfer caller is not owner nor approved/);

    ERC721.awardItem(receiver, tokenURI, '再次添加代币');
    ERC721.balanceOf('2', receiver, '验证账户代币数量');
    ERC721.setApprovalForAll(receiver, receiver, '批准全部代币给自己的错误', true, /ERC721: approve to caller/);
    ERC721.setApprovalForAll(receiver, purchaser, '批准全部代币');
    ERC721.approve(
        purchaser, owner, false, '批准代币的所有者错误', true,
        /ERC721: approve caller is not owner nor approved for all/
    );
    ERC721.isApprovedForAll(receiver, purchaser, '验证代币全部被批准');

    ERC721.awardItem(receiver, tokenURI, '再次添加代币');
    ERC721.balanceOf('3', receiver, '验证账户代币数量');
    ERC721.tokenOfOwnerByIndex(receiver, '0', '根据账户的代币索引获取代币id');
    ERC721.approve(sender, receiver, false, '批准代币');
    ERC721.safeTransferFrom(
        sender, receiver, beneficiary, '999', '安全发送错误的tokenId批准', true,
        /ERC721: operator query for nonexistent token/
    );
    ERC721.safeTransferFrom(
        sender, receiver, constants.ZERO_ADDRESS, false, '安全发送批准0地址错误', true,
        /ERC721: transfer to the zero address/
    );
    ERC721.safeTransferFrom(
        sender, purchaser, beneficiary, false, '安全发送批准错误的拥有者', true,
        /ERC721: transfer of token that is not own/
    );
    ERC721.safeTransferFrom(sender, receiver, beneficiary, false, '安全发送批准');
    ERC721.ownerOf(beneficiary, false, '根据tokenID验证账户地址');

    ERC721.transferFrom(beneficiary, beneficiary, receiver, false, '发送自己的代币');
    ERC721.ownerOf(receiver, false, '根据tokenID验证账户地址');
    ERC721.totalSupply('3');

    ERC721.tokenByIndex('2', '3', '根据代币索引获取代币id');
    ERC721.tokenByIndex('10', false, '根据错误的代币索引获取代币id', true, /ERC721Enumerable: global index out of bounds/);

    ERC721.burn(beneficiary, '3', '错误的用户销毁代币', true, /ERC721Burnable: caller is not owner nor approved/);
    ERC721.burn(receiver, '3', '销毁代币');
    ERC721.burn(receiver, '3', '重复销毁代币错误', true, /ERC721: operator query for nonexistent token/);

});
describe("测试安全发送到合约方法", function () {
    it('布署ERC721合约', async function () {
        ERC721Param = [
            "My Holder Coin",   //代币名称
            "MHC",              //代币缩写
            baseURI             //代币基本地址
        ];
        ERC721Holder = await ERC721Contract.new(...ERC721Param, { from: owner });
    });
    it('验证安全发送到合约地址: safeTransferFrom()', async function () {
        await ERC721Instance.safeTransferFrom(receiver, ERC721Holder.address, '1',  { from: receiver });
    });
    it('根据tokenID验证账户地址: ownerOf()', async function () {
        assert.equal(ERC721Holder.address, await ERC721Instance.ownerOf('1'));
    });
});