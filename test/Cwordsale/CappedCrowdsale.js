const assert = require('assert');
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply"); 
const ERC20CappedCrowdsale = artifacts.require("ERC20CappedCrowdsale"); 

contract('ERC20CappedCrowdsale', accounts => {
    totalSupply = 1000000000;
    rate = 100;
    cap = web3.utils.toWei('10000','ether');  
    before(async () => {
        ERC20FixedSupplyInstance = await ERC20FixedSupply.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        );
        ERC20CappedCrowdsaleInstance = await ERC20CappedCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20FixedSupplyInstance.address,   //代币地址
            accounts[0],                        //代币从这个地址发送
            cap                                 //众筹封顶数量
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20FixedSupplyInstance.approve(ERC20CappedCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(),'ether'));
    });

    it('Testing ERC20CappedCrowdsale token', async () => {
        address = await ERC20CappedCrowdsaleInstance.token();
        assert.equal(address, ERC20FixedSupplyInstance.address);
    });

    it('Testing ERC20CappedCrowdsale wallet', async () => {
        address = await ERC20CappedCrowdsaleInstance.wallet();
        assert.equal(address, accounts[1]);
    });

    it('Testing ERC20CappedCrowdsale rate', async () => {
        rate = await ERC20CappedCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });

    it('Testing ERC20CappedCrowdsale tokenWallet', async () => {
        tokenWallet = await ERC20CappedCrowdsaleInstance.tokenWallet();
        assert.equal(accounts[0], tokenWallet);
    });

    it('Testing ERC20CappedCrowdsale buyTokens', async () => {
        await ERC20CappedCrowdsaleInstance.buyTokens(accounts[2],{value:web3.utils.toWei('10','ether')});
        amount = await ERC20FixedSupplyInstance.balanceOf(accounts[2]);
        assert.equal(10 * rate, web3.utils.fromWei(amount,'ether'));
    });

    it('Testing ERC20CappedCrowdsale weiRaised', async () => {
        weiRaised = await ERC20CappedCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised,'ether'));
    });

    it('Testing ERC20CappedCrowdsale remainingTokens', async () => {
        remainingTokens = await ERC20CappedCrowdsaleInstance.remainingTokens();
        assert.equal(totalSupply - 10 * rate, web3.utils.fromWei(remainingTokens,'ether'));
    });

    it('Testing ERC20CappedCrowdsale cap', async () => {
        instanceCap = await ERC20CappedCrowdsaleInstance.cap();
        assert.equal(web3.utils.fromWei(cap,'ether'), web3.utils.fromWei(instanceCap,'ether'));
    });

    it('Testing ERC20CappedCrowdsale capReached', async () => {
        capReached = await ERC20CappedCrowdsaleInstance.capReached();
        assert.ok(!capReached);
    });

});
