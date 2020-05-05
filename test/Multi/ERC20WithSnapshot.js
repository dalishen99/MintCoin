const assert = require('assert');
const { contract, accounts } = require('@openzeppelin/test-environment');
const { constants, expectEvent, ether } = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact("ERC20WithSnapshot");
const ERC20 = require('../inc/ERC20');
//可快照的ERC20代币
const totalSupply = '10000';//发行总量
[owner, sender, receiver, purchaser, beneficiary] = accounts;
EthValue = '10';

let balanceBefore = [];
describe("固定总量代币", function () {
    it('布署代币合约', async function () {
        ERC20Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply,        //发行总量
        ];
        ERC20Instance = await ERC20Contract.new(...ERC20Param, { from: owner });
    });
});

describe("测试ERC20合约基本信息", function () {
    ERC20.detail();
});
describe("第一次将代币分配给一些账户", function () {
    ERC20.transfer(owner, sender, (EthValue * 5).toString(), '代币发送给sender');
    ERC20.transfer(owner, receiver, (EthValue * 10).toString(), '代币发送给receiver');
    ERC20.transfer(owner, purchaser, (EthValue * 15).toString(), '代币发送给purchaser');
    ERC20.transfer(owner, beneficiary, (EthValue * 25).toString(), '代币发送给beneficiary');
    it('第一次记录账户余额: balanceOf()', async function () {
        balanceBefore[owner] = await ERC20Instance.balanceOf(owner);
        balanceBefore[sender] = await ERC20Instance.balanceOf(sender);
        balanceBefore[receiver] = await ERC20Instance.balanceOf(receiver);
        balanceBefore[purchaser] = await ERC20Instance.balanceOf(purchaser);
        balanceBefore[beneficiary] = await ERC20Instance.balanceOf(beneficiary);
    });
});
describe("第一次执行快照", async function () {
    it('第一次执行快照: snapshot()', async function () {
        let receipt = await ERC20Instance.snapshot();
        snapshotId = receipt.logs[0].args.id;
        expectEvent(receipt, 'Snapshot', {
            id: receipt.logs[0].args.id
        }
        );
    });
});

describe("第二次将代币分配给一些账户", function () {
    ERC20.transfer(owner, sender, (EthValue * 5).toString(), '代币发送给sender');
    ERC20.transfer(owner, receiver, (EthValue * 10).toString(), '代币发送给receiver');
    ERC20.transfer(owner, purchaser, (EthValue * 15).toString(), '代币发送给purchaser');
    ERC20.transfer(owner, beneficiary, (EthValue * 25).toString(), '代币发送给beneficiary');
});
describe("第一次验证快照", async function () {
    it('第一次验证快照: balanceOfAt()', async function () {
        assert.equal(balanceBefore[owner].toString(), (await ERC20Instance.balanceOfAt(owner, snapshotId)).toString());
        assert.equal(balanceBefore[sender].toString(), (await ERC20Instance.balanceOfAt(sender, snapshotId)).toString());
        assert.equal(balanceBefore[receiver].toString(), (await ERC20Instance.balanceOfAt(receiver, snapshotId)).toString());
        assert.equal(balanceBefore[purchaser].toString(), (await ERC20Instance.balanceOfAt(purchaser, snapshotId)).toString());
        assert.equal(balanceBefore[beneficiary].toString(), (await ERC20Instance.balanceOfAt(beneficiary, snapshotId)).toString());
    });
    it('第一次验证总额快照: totalSupplyAt()', async function () {
        assert.equal(ether(ERC20Param[3].toString()).toString(), (await ERC20Instance.totalSupplyAt(snapshotId)).toString());
    });
});

describe("第二次记录账户余额", function () {
    it('第二次记录账户余额: balanceOf()', async function () {
        balanceBefore[owner] = await ERC20Instance.balanceOf(owner);
        balanceBefore[sender] = await ERC20Instance.balanceOf(sender);
        balanceBefore[receiver] = await ERC20Instance.balanceOf(receiver);
        balanceBefore[purchaser] = await ERC20Instance.balanceOf(purchaser);
        balanceBefore[beneficiary] = await ERC20Instance.balanceOf(beneficiary);
    });
});
describe("第二次执行快照", async function () {
    it('第二次执行快照: snapshot()', async function () {
        let receipt = await ERC20Instance.snapshot();
        snapshotId = receipt.logs[0].args.id;
        expectEvent(receipt, 'Snapshot', {
            id: receipt.logs[0].args.id
        }
        );
    });
});

describe("第二次验证快照", async function () {
    it('第二次验证快照: balanceOfAt()', async function () {
        assert.equal(balanceBefore[owner].toString(), (await ERC20Instance.balanceOfAt(owner, snapshotId)).toString());
        assert.equal(balanceBefore[sender].toString(), (await ERC20Instance.balanceOfAt(sender, snapshotId)).toString());
        assert.equal(balanceBefore[receiver].toString(), (await ERC20Instance.balanceOfAt(receiver, snapshotId)).toString());
        assert.equal(balanceBefore[purchaser].toString(), (await ERC20Instance.balanceOfAt(purchaser, snapshotId)).toString());
        assert.equal(balanceBefore[beneficiary].toString(), (await ERC20Instance.balanceOfAt(beneficiary, snapshotId)).toString());
    });
    it('第二次验证总额快照: totalSupplyAt()', async function () {
        assert.equal(ether(ERC20Param[3].toString()).toString(), (await ERC20Instance.totalSupplyAt(snapshotId)).toString());
    });
});