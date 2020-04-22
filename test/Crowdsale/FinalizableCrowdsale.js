const assert = require('assert');
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const ERC20FinalizableCrowdsale = artifacts.require("ERC20FinalizableCrowdsale");

contract('ERC20FinalizableCrowdsale', accounts => {
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

        ERC20FinalizableCrowdsaleInstance = await ERC20FinalizableCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20FixedSupplyInstance.address,   //代币地址
            accounts[0],                        //代币从这个地址发送
            parseInt(new Date().getTime() / 1000),             //众筹开始时间
            parseInt(new Date().getTime() / 1000 + timelock)   //众筹结束时间
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20FixedSupplyInstance.approve(ERC20FinalizableCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
    });

    it('Testing ERC20FinalizableCrowdsale token', async () => {
        address = await ERC20FinalizableCrowdsaleInstance.token();
        assert.equal(address, ERC20FixedSupplyInstance.address);
    });

    it('Testing ERC20FinalizableCrowdsale wallet', async () => {
        address = await ERC20FinalizableCrowdsaleInstance.wallet();
        assert.equal(address, accounts[1]);
    });

    it('Testing ERC20FinalizableCrowdsale rate', async () => {
        rate = await ERC20FinalizableCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });

    it('Testing ERC20FinalizableCrowdsale tokenWallet', async () => {
        tokenWallet = await ERC20FinalizableCrowdsaleInstance.tokenWallet();
        assert.equal(accounts[0], tokenWallet);
    });

    it('Testing ERC20TimedCrowdsale openingTime closingTime', async () => {
        openingTime = await ERC20FinalizableCrowdsaleInstance.openingTime();
        closingTime = await ERC20FinalizableCrowdsaleInstance.closingTime();
        assert.ok(openingTime.toString() < closingTime.toString());
    });

    it('Testing ERC20FinalizableCrowdsale isOpen', async () => {
        assert.ok(await ERC20FinalizableCrowdsaleInstance.isOpen());
    });

    it('Testing ERC20FinalizableCrowdsale buyTokens', async () => {
        await ERC20FinalizableCrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') });
        amount = await ERC20FixedSupplyInstance.balanceOf(accounts[2]);
        assert.equal(10 * rate, web3.utils.fromWei(amount, 'ether'));
    });

    it('Testing ERC20FinalizableCrowdsale weiRaised', async () => {
        weiRaised = await ERC20FinalizableCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised, 'ether'));
    });

    it('Testing ERC20FinalizableCrowdsale remainingTokens', async () => {
        remainingTokens = await ERC20FinalizableCrowdsaleInstance.remainingTokens();
        assert.equal(totalSupply - 10 * rate, web3.utils.fromWei(remainingTokens, 'ether'));
    });

    it('Testing ERC20FinalizableCrowdsale hasClosed', async () => {
        assert.ok(!await ERC20FinalizableCrowdsaleInstance.hasClosed());
    });

    it('Testing ERC20FinalizableCrowdsale finalized', async () => {
        assert.ok(!await ERC20FinalizableCrowdsaleInstance.finalized());
    });

    it('Testing ERC20FinalizableCrowdsale finalize', (done) => {
        console.log('Waiting for ' + timelock + ' seconds ......')
        setTimeout(async () => {
            await ERC20FinalizableCrowdsaleInstance.finalize();
            assert.ok(await ERC20FinalizableCrowdsaleInstance.finalized());
            done();
        }, timelock * 1000 + 1000);
    });

});
