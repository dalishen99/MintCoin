const assert = require('assert');
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const ERC20WithTokenTimelock = artifacts.require("ERC20WithTokenTimelock");
const ERC20 = require('./ERC20');

contract('可锁仓代币', accounts => {
    totalSupply = 1000000000; //发行总量
    lockAmount = 1000;            //锁仓总量
    beneficiary = accounts[4];//锁仓受益人
    describe("布署合约...",async function () {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        //测试ERC20合约的基本方法
        ERC20Instance = await ERC20(accounts, ERC20Contract, param);
    });
    describe("布署可锁仓代币", function () {
        it('布署合约并且传送代币到锁仓账户', async function () {
            TokenTimelockInstance = await ERC20WithTokenTimelock.new(
                ERC20Instance.address,                        //ERC20代币合约地址
                beneficiary,                                  //受益人为当前账户
                Math.ceil(new Date().getTime() / 1000) + 5    //解锁时间戳
            );
            await assert.doesNotReject(ERC20Instance.transfer(
                TokenTimelockInstance.address,
                web3.utils.toWei(lockAmount.toString(), 'ether')
            ));
        });
    });

    describe("测试可锁仓代币的特殊方法", function () {
        //测试返回锁仓代币地址
        it('返回锁仓代币地址: token()', async function () {
            assert.equal(ERC20Instance.address, await TokenTimelockInstance.token());
        });
        //测试锁仓数量
        it('锁仓数量: balance()', async function () {
            assert.equal(lockAmount, web3.utils.fromWei(await ERC20Instance.balanceOf(TokenTimelockInstance.address), 'ether'));
        });
        //测试返回受益人
        it('返回受益人: beneficiary()', async function () {
            assert.equal(beneficiary, await TokenTimelockInstance.beneficiary());
        });
        //测试返回解锁时间
        it('返回解锁时间: releaseTime()', async function () {
            const releaseTime = await TokenTimelockInstance.releaseTime();
            assert.ok(Math.ceil(new Date().getTime() / 1000) < releaseTime.toString());
        });
        //测试未到时间不能解锁
        it('未到时间不能解锁: rejects release()', async function () {
            await assert.rejects(TokenTimelockInstance.release(), /current time is before release time/);
        });
        //测试解锁方法
        it('解锁方法: release()', function (done) {
            console.log('  Waiting for 10 seconds ......')
            setTimeout(async function () {
                assert.equal(0, web3.utils.fromWei(await ERC20Instance.balanceOf(beneficiary), 'ether'));
                await assert.doesNotReject(TokenTimelockInstance.release());
                assert.equal(
                    lockAmount,
                    web3.utils.fromWei(await ERC20Instance.balanceOf(beneficiary), 'ether')
                );
                done();
            }, 10000);
        });

    });
});
