const assert = require('assert');
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const ERC20PostDeliveryCrowdsale = artifacts.require("ERC20PostDeliveryCrowdsale");

contract('ERC20PostDeliveryCrowdsale', accounts => {
    totalSupply = 1000000000;
    rate = 100;
    timelock = 5;
    before(async () => {
        ERC20FixedSupplyInstance = await ERC20FixedSupply.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        );

        ERC20PostDeliveryCrowdsaleInstance = await ERC20PostDeliveryCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20FixedSupplyInstance.address,   //代币地址
            accounts[0],                        //代币从这个地址发送
            parseInt(new Date().getTime() / 1000),             //众筹开始时间
            parseInt(new Date().getTime() / 1000 + timelock)   //众筹结束时间
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20FixedSupplyInstance.approve(ERC20PostDeliveryCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
    });

    it('Testing ERC20PostDeliveryCrowdsale token', async () => {
        address = await ERC20PostDeliveryCrowdsaleInstance.token();
        assert.equal(address, ERC20FixedSupplyInstance.address);
    });

    it('Testing ERC20PostDeliveryCrowdsale wallet', async () => {
        address = await ERC20PostDeliveryCrowdsaleInstance.wallet();
        assert.equal(address, accounts[1]);
    });

    it('Testing ERC20PostDeliveryCrowdsale rate', async () => {
        rate = await ERC20PostDeliveryCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });

    it('Testing ERC20PostDeliveryCrowdsale tokenWallet', async () => {
        tokenWallet = await ERC20PostDeliveryCrowdsaleInstance.tokenWallet();
        assert.equal(accounts[0], tokenWallet);
    });

    it('Testing ERC20TimedCrowdsale openingTime closingTime', async () => {
        openingTime = await ERC20PostDeliveryCrowdsaleInstance.openingTime();
        closingTime = await ERC20PostDeliveryCrowdsaleInstance.closingTime();
        assert.ok(openingTime.toString() < closingTime.toString());
    });

    it('Testing ERC20PostDeliveryCrowdsale isOpen', async () => {
        assert.ok(await ERC20PostDeliveryCrowdsaleInstance.isOpen());
    });

    it('Testing ERC20PostDeliveryCrowdsale buyTokens', async () => {
        await ERC20PostDeliveryCrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') });
        amount = await ERC20FixedSupplyInstance.balanceOf(accounts[2]);
        assert.equal(0, web3.utils.fromWei(amount, 'ether'));
    });

    it('Testing ERC20PostDeliveryCrowdsale weiRaised', async () => {
        weiRaised = await ERC20PostDeliveryCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised, 'ether'));
    });

    it('Testing ERC20PostDeliveryCrowdsale remainingTokens', async () => {
        remainingTokens = await ERC20PostDeliveryCrowdsaleInstance.remainingTokens();
        assert.equal(totalSupply - 10 * rate, web3.utils.fromWei(remainingTokens, 'ether'));
    });

    it('Testing ERC20PostDeliveryCrowdsale hasClosed', async () => {
        assert.ok(!await ERC20PostDeliveryCrowdsaleInstance.hasClosed());
    });

    it('Testing ERC20PostDeliveryCrowdsale balanceOf', async () => {
        amount = await ERC20PostDeliveryCrowdsaleInstance.balanceOf(accounts[2]);
        assert.equal(10 * rate, web3.utils.fromWei(amount, 'ether'));
    });

    it('Testing ERC20PostDeliveryCrowdsale withdrawTokens', (done) => {
        console.log('Waiting for ' + timelock + ' seconds ......')
        setTimeout(async () => {
            await ERC20PostDeliveryCrowdsaleInstance.withdrawTokens(accounts[2]);
            amount = await ERC20FixedSupplyInstance.balanceOf(accounts[2]);
            assert.equal(10 * rate, web3.utils.fromWei(amount, 'ether'));
            done();
        }, timelock * 1000 + 1000);
    });

});
