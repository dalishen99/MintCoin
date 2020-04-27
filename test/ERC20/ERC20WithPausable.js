const assert = require('assert');
const { contract } = require('@openzeppelin/test-environment');
const {expectRevert} = require('@openzeppelin/test-helpers');
const ERC20Contract = contract.fromArtifact('ERC20WithPausable');
const ERC20 = require('../inc/ERC20');

    describe("可暂停代币",async function () {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            1000000000          //发行总量
        ];
        //测试ERC20合约的基本方法
    ERC20Instance = await ERC20(ERC20Contract, param);
    });

    describe("测试可暂停代币的特殊方法", function () {
        //测试是暂停者
        it('是暂停者: isPauser()', async function () {
            assert.ok(await ERC20Instance.isPauser(owner));
        });
        //测试添加暂停者
        it('添加暂停者: addPauser()', async function () {
            await ERC20Instance.addPauser(sender, { from: owner });
            assert.ok(await ERC20Instance.isPauser(sender));
        });
        //测试是否已暂停
        it('是否已暂停: paused()', async function () {
            await ERC20Instance.paused();
            assert.ok(!await ERC20Instance.paused());
        });
        //测试暂停方法
        it('暂停方法: pause()', async function () {
            await ERC20Instance.pause({ from: sender });
            assert.ok(await ERC20Instance.paused());
        });
        //测试暂停后发送代币
        it('暂停后发送代币: transfer()', async function () {
            await expectRevert(ERC20Instance.transfer(sender, value, { from: owner }), 'paused');
        });
        //测试恢复方法
        it('恢复方法: unpause()', async function () {
            await ERC20Instance.unpause({ from: sender });
            assert.ok(!await ERC20Instance.paused());
        });
        //测试撤销暂停权
        it('撤销暂停权: renouncePauser()', async function () {
            await ERC20Instance.renouncePauser({ from: sender });
            assert.ok(!await ERC20Instance.isPauser(sender));
        });
    });
