const assert = require('assert');
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply"); 
const ERC20AllowanceCrowdsale = artifacts.require("ERC20AllowanceCrowdsale"); 

contract('ERC20AllowanceCrowdsale', accounts => {
    totalSupply = 1000000000;
    rate = 100;
    before(async () => {
        ERC20FixedSupplyInstance = await ERC20FixedSupply.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        );
        ERC20AllowanceCrowdsaleInstance = await ERC20AllowanceCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20FixedSupplyInstance.address,   //代币地址
            accounts[0]                         //代币从这个地址发送
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20FixedSupplyInstance.approve(ERC20AllowanceCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(),'ether'));
    });

    it('Testing ERC20AllowanceCrowdsale token', async () => {
        address = await ERC20AllowanceCrowdsaleInstance.token();
        assert.equal(address, ERC20FixedSupplyInstance.address);
    });

    it('Testing ERC20AllowanceCrowdsale wallet', async () => {
        address = await ERC20AllowanceCrowdsaleInstance.wallet();
        assert.equal(address, accounts[1]);
    });

    it('Testing ERC20AllowanceCrowdsale rate', async () => {
        rate = await ERC20AllowanceCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });

    it('Testing ERC20AllowanceCrowdsale tokenWallet', async () => {
        tokenWallet = await ERC20AllowanceCrowdsaleInstance.tokenWallet();
        assert.equal(accounts[0], tokenWallet);
    });

    it('Testing ERC20AllowanceCrowdsale buyTokens', async () => {
        await ERC20AllowanceCrowdsaleInstance.buyTokens(accounts[2],{value:web3.utils.toWei('10','ether')});
        amount = await ERC20FixedSupplyInstance.balanceOf(accounts[2]);
        assert.equal(10 * rate, web3.utils.fromWei(amount,'ether'));
    });

    it('Testing ERC20AllowanceCrowdsale weiRaised', async () => {
        weiRaised = await ERC20AllowanceCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised,'ether'));
    });

    it('Testing ERC20AllowanceCrowdsale remainingTokens', async () => {
        remainingTokens = await ERC20AllowanceCrowdsaleInstance.remainingTokens();
        assert.equal(totalSupply - 10 * rate, web3.utils.fromWei(remainingTokens,'ether'));
    });

});
