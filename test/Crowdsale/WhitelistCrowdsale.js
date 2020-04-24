const assert = require('assert');
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const ERC20WhitelistCrowdsale = artifacts.require("ERC20WhitelistCrowdsale"); 
const ERC20 = require('../ERC20/ERC20');

contract('白名单众筹', accounts => {
    totalSupply = 1000000000;
    rate = 100;
    describe("布署ERC20合约...", async () => {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        //测试ERC20合约的基本方法
        ERC20Instance = await ERC20(accounts, ERC20Contract, param);
    });
    describe("布署有封顶众筹合约...", () => {
        it('布署合约并且批准给众筹账户', async () => {
        ERC20WhitelistCrowdsaleInstance = await ERC20WhitelistCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20Instance.address,   //代币地址
            accounts[0]                         //代币从这个地址发送
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20Instance.approve(ERC20WhitelistCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(),'ether'));
    });
});

    it('Testing ERC20WhitelistCrowdsale token', async () => {
        address = await ERC20WhitelistCrowdsaleInstance.token();
        assert.equal(address, ERC20Instance.address);
    });

    it('Testing ERC20WhitelistCrowdsale wallet', async () => {
        address = await ERC20WhitelistCrowdsaleInstance.wallet();
        assert.equal(address, accounts[1]);
    });

    it('Testing ERC20WhitelistCrowdsale rate', async () => {
        rate = await ERC20WhitelistCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });

    it('Testing ERC20WhitelistCrowdsale tokenWallet', async () => {
        tokenWallet = await ERC20WhitelistCrowdsaleInstance.tokenWallet();
        assert.equal(accounts[0], tokenWallet);
    });

    it('Testing ERC20WhitelistCrowdsale isWhitelisted', async () => {
        isWhitelisted = await ERC20WhitelistCrowdsaleInstance.isWhitelisted(accounts[2]);
        assert.ok(!isWhitelisted);
    });

    it('Testing ERC20WhitelistCrowdsale addWhitelisted', async () => {
        await ERC20WhitelistCrowdsaleInstance.addWhitelisted(accounts[1]);
        isWhitelisted = await ERC20WhitelistCrowdsaleInstance.isWhitelisted(accounts[1]);
        assert.ok(isWhitelisted);
        await ERC20WhitelistCrowdsaleInstance.addWhitelisted(accounts[2]);
        isWhitelisted = await ERC20WhitelistCrowdsaleInstance.isWhitelisted(accounts[2]);
        assert.ok(isWhitelisted);
    });

    it('Testing ERC20WhitelistCrowdsale buyTokens', async () => {
        await ERC20WhitelistCrowdsaleInstance.buyTokens(accounts[2],{value:web3.utils.toWei('10','ether')});
        amount = await ERC20Instance.balanceOf(accounts[2]);
        assert.equal(10 * rate, web3.utils.fromWei(amount,'ether'));
    });

    it('Testing ERC20WhitelistCrowdsale weiRaised', async () => {
        weiRaised = await ERC20WhitelistCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised,'ether'));
    });

    it('Testing ERC20WhitelistCrowdsale remainingTokens', async () => {
        remainingTokens = await ERC20WhitelistCrowdsaleInstance.remainingTokens();
        assert.equal(totalSupply - 10 * rate, web3.utils.fromWei(remainingTokens,'ether'));
    });

    it('Testing ERC20WhitelistCrowdsale removeWhitelisted', async () => {
        await ERC20WhitelistCrowdsaleInstance.removeWhitelisted(accounts[1]);
        isWhitelisted = await ERC20WhitelistCrowdsaleInstance.isWhitelisted(accounts[1]);
        assert.ok(!isWhitelisted);
    });

    it('Testing ERC20WhitelistCrowdsale renounceWhitelisted', async () => {
        await ERC20WhitelistCrowdsaleInstance.renounceWhitelisted({from:accounts[2]});
        isWhitelisted = await ERC20WhitelistCrowdsaleInstance.isWhitelisted(accounts[2]);
        assert.ok(!isWhitelisted);
    });

    it('Testing ERC20WhitelistCrowdsale isWhitelistAdmin', async () => {
        isWhitelistAdmin = await ERC20WhitelistCrowdsaleInstance.isWhitelistAdmin(accounts[0]);
        assert.ok(isWhitelistAdmin);
    });

    it('Testing ERC20WhitelistCrowdsale addWhitelistAdmin', async () => {
        await ERC20WhitelistCrowdsaleInstance.addWhitelistAdmin(accounts[1]);
        isWhitelistAdmin = await ERC20WhitelistCrowdsaleInstance.isWhitelistAdmin(accounts[1]);
        assert.ok(isWhitelistAdmin);
    });

    it('Testing ERC20WhitelistCrowdsale renounceWhitelistAdmin', async () => {
        await ERC20WhitelistCrowdsaleInstance.renounceWhitelistAdmin({from:accounts[1]});
        isWhitelistAdmin = await ERC20WhitelistCrowdsaleInstance.isWhitelistAdmin(accounts[1]);
        assert.ok(!isWhitelistAdmin);
    });
});
