const assert = require('assert');
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const ERC20WithTokenTimelock = artifacts.require("ERC20WithTokenTimelock");
const ERC20 = require('./ERC20');

contract('可锁仓代币', accounts => {
    totalSupply = 1000000000; //发行总量
    amount = 1000;            //锁仓总量
    timelock = 10;            //锁仓10秒
    beneficiary = accounts[4];//锁仓受益人
    describe("布署合约...",async () => {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        //测试ERC20合约的基本方法
        ERC20Instance = await ERC20(accounts, ERC20Contract, param);
    });
    describe("布署可锁仓代币", () => {
        it('布署合约并且传送代币到锁仓账户', async () => {
            ERC20WithTokenTimelockInstance = await ERC20WithTokenTimelock.new(
                ERC20Instance.address,                                   //ERC20代币合约地址
                beneficiary,                                        //受益人为当前账户
                parseInt(new Date().getTime() / 1000) + timelock    //解锁时间戳
            );
            await assert.doesNotReject(ERC20Instance.transfer(
                ERC20WithTokenTimelockInstance.address,
                web3.utils.toWei(amount.toString(), 'ether')
            ));
        });
    });

    describe("测试可锁仓代币的特殊方法", () => {
        //测试返回锁仓代币地址
        it('返回锁仓代币地址: token()', async () => {
            const ERC20WithTokenTimelockToken = await ERC20WithTokenTimelockInstance.token();
            assert.equal(ERC20Instance.address, ERC20WithTokenTimelockToken);
        });
        //测试锁仓数量
        it('锁仓数量: balance()', async () => {
            const ERC20WithTokenTimelockInstanceBlance = await ERC20Instance.balanceOf(ERC20WithTokenTimelockInstance.address);
            assert.equal(amount, web3.utils.fromWei(ERC20WithTokenTimelockInstanceBlance, 'ether'));
        });
        //测试返回受益人
        it('返回受益人: beneficiary()', async () => {
            const tonekBeneficiary = await ERC20WithTokenTimelockInstance.beneficiary();
            assert.equal(beneficiary, tonekBeneficiary);
        });
        //测试返回解锁时间
        it('返回解锁时间: releaseTime()', async () => {
            const releaseTime = await ERC20WithTokenTimelockInstance.releaseTime();
            assert.ok(parseInt(new Date().getTime() / 1000) < releaseTime.toString());
        });
        //测试未到时间不能解锁
        it('未到时间不能解锁: rejects release()', async () => {
            await assert.rejects(ERC20WithTokenTimelockInstance.release(), /current time is before release time/);
        });
        //测试解锁方法
        it('解锁方法: release()', (done) => {
            console.log('  Waiting for ' + timelock + ' seconds ......')
            setTimeout(async () => {
                assert.equal(0, web3.utils.fromWei(await ERC20Instance.balanceOf(beneficiary), 'ether'));
                await assert.doesNotReject(ERC20WithTokenTimelockInstance.release());
                assert.equal(
                    amount,
                    web3.utils.fromWei(await ERC20Instance.balanceOf(beneficiary), 'ether')
                );
                done();
            }, timelock * 1000);
        });

    });
});
