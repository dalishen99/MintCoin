const assert = require('assert');
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const ERC20WithTokenTimelock = artifacts.require("ERC20WithTokenTimelock");

contract('ERC20WithTokenTimelock', accounts => {
    before(async () => {
        totalSupply = 1000000000; //发行总量
        amount = 1000;            //锁仓总量
        timelock = 10;            //锁仓10秒
        ERC20FixedSupplyInstance = await ERC20FixedSupply.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        );

        ERC20WithTokenTimelockInstance = await ERC20WithTokenTimelock.new(
            ERC20FixedSupplyInstance.address,           //ERC20代币合约地址
            accounts[1],                                //受益人为当前账户
            parseInt(new Date().getTime() / 1000 + timelock)  //解锁时间戳
        );
        ERC20FixedSupplyInstance.transfer(ERC20WithTokenTimelockInstance.address, web3.utils.toWei(amount.toString(), 'ether'));
    });

    it('Testing ERC20WithTokenTimelock token()', async () => {
        const ERC20WithTokenTimelockToken = await ERC20WithTokenTimelockInstance.token();
        assert.equal(ERC20FixedSupplyInstance.address, ERC20WithTokenTimelockToken);
    });

    it('Testing ERC20WithTokenTimelock accounts[0] balance', async () => {
        const account0Blance = await ERC20FixedSupplyInstance.balanceOf(accounts[0]);
        assert.equal(totalSupply - amount, web3.utils.fromWei(account0Blance, 'ether'));
    });

    it('Testing ERC20WithTokenTimelock ERC20WithTokenTimelockInstance balance', async () => {
        const ERC20WithTokenTimelockInstanceBlance = await ERC20FixedSupplyInstance.balanceOf(ERC20WithTokenTimelockInstance.address);
        assert.equal(amount, web3.utils.fromWei(ERC20WithTokenTimelockInstanceBlance, 'ether'));
    });

    it('Testing ERC20WithTokenTimelock beneficiary', async () => {
        const beneficiary = await ERC20WithTokenTimelockInstance.beneficiary();
        assert.equal(accounts[1], beneficiary);
    });

    it('Testing ERC20WithTokenTimelock releaseTime', async () => {
        const releaseTime = await ERC20WithTokenTimelockInstance.releaseTime();
        assert.ok(parseInt(new Date().getTime() / 1000) < releaseTime.toString());
    });


    it('Testing ERC20WithTokenTimelock release', async () => {
        await assert.rejects(ERC20WithTokenTimelockInstance.release(),/current time is before release time/);
    });

});