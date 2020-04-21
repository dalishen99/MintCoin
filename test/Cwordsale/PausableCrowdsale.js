const assert = require('assert');
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply"); 
const ERC20PausableCrowdsale = artifacts.require("ERC20PausableCrowdsale"); 

contract('ERC20PausableCrowdsale', accounts => {
    totalSupply = 1000000000;
    rate = 100;
    before(async () => {
        ERC20FixedSupplyInstance = await ERC20FixedSupply.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        );
        ERC20PausableCrowdsaleInstance = await ERC20PausableCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20FixedSupplyInstance.address,   //代币地址
            accounts[0]                         //代币从这个地址发送
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20FixedSupplyInstance.approve(ERC20PausableCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(),'ether'));
    });

    it('Testing ERC20PausableCrowdsale token', async () => {
        address = await ERC20PausableCrowdsaleInstance.token();
        assert.equal(address, ERC20FixedSupplyInstance.address);
    });

    it('Testing ERC20PausableCrowdsale wallet', async () => {
        address = await ERC20PausableCrowdsaleInstance.wallet();
        assert.equal(address, accounts[1]);
    });

    it('Testing ERC20PausableCrowdsale rate', async () => {
        rate = await ERC20PausableCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });

    it('Testing ERC20PausableCrowdsale tokenWallet', async () => {
        tokenWallet = await ERC20PausableCrowdsaleInstance.tokenWallet();
        assert.equal(accounts[0], tokenWallet);
    });

    it('Testing ERC20PausableCrowdsale buyTokens', async () => {
        await ERC20PausableCrowdsaleInstance.buyTokens(accounts[2],{value:web3.utils.toWei('10','ether')});
        amount = await ERC20FixedSupplyInstance.balanceOf(accounts[2]);
        assert.equal(10 * rate, web3.utils.fromWei(amount,'ether'));
    });

    it('Testing ERC20PausableCrowdsale weiRaised', async () => {
        weiRaised = await ERC20PausableCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised,'ether'));
    });

    it('Testing ERC20PausableCrowdsale remainingTokens', async () => {
        remainingTokens = await ERC20PausableCrowdsaleInstance.remainingTokens();
        assert.equal(totalSupply - 10 * rate, web3.utils.fromWei(remainingTokens,'ether'));
    });

    it('Testing ERC20WithPausable isPauser', async () => {
        const isPauser = await ERC20PausableCrowdsaleInstance.isPauser(accounts[0]);
        assert.ok(isPauser);
    });

    it('Testing ERC20WithPausable addPauser', async () => {
        await ERC20PausableCrowdsaleInstance.addPauser(accounts[1],{from:accounts[0]});
        isPauser = await ERC20PausableCrowdsaleInstance.isPauser(accounts[1]);
        assert.ok(isPauser);
    });

    it('Testing ERC20WithPausable paused', async () => {
        await ERC20PausableCrowdsaleInstance.paused({from:accounts[1]});
        const isPause = await ERC20PausableCrowdsaleInstance.paused();
        assert.ok(!isPause);
    });

    it('Testing ERC20WithPausable pause', async () => {
        await ERC20PausableCrowdsaleInstance.pause({from:accounts[1]});
        const isPause = await ERC20PausableCrowdsaleInstance.paused();
        assert.ok(isPause);
    });

    it('Testing ERC20WithPausable unpause', async () => {
        await ERC20PausableCrowdsaleInstance.unpause({from:accounts[1]});
        const isPause = await ERC20PausableCrowdsaleInstance.paused();
        assert.ok(!isPause);
    });

    it('Testing ERC20WithPausable renouncePauser', async () => {
        await ERC20PausableCrowdsaleInstance.renouncePauser({from:accounts[1]});
        isPauser = await ERC20PausableCrowdsaleInstance.isPauser(accounts[1]);
        assert.ok(!isPauser);
    });

});
