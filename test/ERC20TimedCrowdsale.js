const assert = require('assert');
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const ERC20TimedCrowdsale = artifacts.require("ERC20TimedCrowdsale");

contract('ERC20TimedCrowdsale', accounts => {
    totalSupply = 1000000000;
    rate = 100;
    timelock = 10;
    before(async () => {
        ERC20FixedSupplyInstance = await ERC20FixedSupply.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        );
        //众筹开始时间
        openingTime = parseInt(new Date().getTime() / 1000)
        //众筹结束时间
        closingTime = parseInt(new Date().getTime() / 1000 + timelock)
        ERC20TimedCrowdsaleInstance = await ERC20TimedCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20FixedSupplyInstance.address,   //代币地址
            accounts[0],                        //代币从这个地址发送
            openingTime,                        //众筹开始时间
            closingTime                         //众筹结束时间
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20FixedSupplyInstance.approve(ERC20TimedCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
    });

    it('Testing ERC20TimedCrowdsale token', async () => {
        address = await ERC20TimedCrowdsaleInstance.token();
        assert.equal(address, ERC20FixedSupplyInstance.address);
    });

    it('Testing ERC20TimedCrowdsale wallet', async () => {
        address = await ERC20TimedCrowdsaleInstance.wallet();
        assert.equal(address, accounts[1]);
    });

    it('Testing ERC20TimedCrowdsale rate', async () => {
        rate = await ERC20TimedCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });

    it('Testing ERC20TimedCrowdsale tokenWallet', async () => {
        tokenWallet = await ERC20TimedCrowdsaleInstance.tokenWallet();
        assert.equal(accounts[0], tokenWallet);
    });

    it('Testing ERC20TimedCrowdsale openingTime', async () => {
        assert.equal(openingTime, await ERC20TimedCrowdsaleInstance.openingTime());
    });

    it('Testing ERC20TimedCrowdsale closingTime', async () => {
        assert.equal(closingTime, await ERC20TimedCrowdsaleInstance.closingTime());
    });

    it('Testing ERC20TimedCrowdsale isOpen', async () => {
        assert.ok(await ERC20TimedCrowdsaleInstance.isOpen());
    });

    it('Testing ERC20TimedCrowdsale buyTokens', async () => {
        await ERC20TimedCrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') });
        amount = await ERC20FixedSupplyInstance.balanceOf(accounts[2]);
        assert.equal(10 * rate, web3.utils.fromWei(amount, 'ether'));
    });

    it('Testing ERC20TimedCrowdsale weiRaised', async () => {
        weiRaised = await ERC20TimedCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised, 'ether'));
    });

    it('Testing ERC20TimedCrowdsale remainingTokens', async () => {
        remainingTokens = await ERC20TimedCrowdsaleInstance.remainingTokens();
        assert.equal(totalSupply - 10 * rate, web3.utils.fromWei(remainingTokens, 'ether'));
    });

    it('Testing ERC20TimedCrowdsale hasClosed', async () => {
        assert.ok(!await ERC20TimedCrowdsaleInstance.hasClosed());
    });

});
