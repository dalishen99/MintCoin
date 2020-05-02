const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { ether, constants } = require('@openzeppelin/test-helpers');
const ERC721Contract = contract.fromArtifact("ERC721FullContract");
const ERC721 = require('../inc/ERC721');
//全功能ERC721代币
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';
describe("布署合约", function () {
    it('全功能ERC721代币', async function () {
        ERC721Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
        ];
        ERC721Instance = await ERC721Contract.new(...ERC721Param, { from: owner });
    });
});
describe("测试ERC721合约基本信息", async function () {
    ERC721.detail();
});
