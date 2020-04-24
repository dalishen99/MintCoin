const assert = require('assert');
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const ERC20IndividuallyCappedCrowdsale = artifacts.require("ERC20IndividuallyCappedCrowdsale"); 
const ERC20 = require('../ERC20/ERC20');

contract('有配额的众筹', accounts => {
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
        ERC20IndividuallyCappedCrowdsaleInstance = await ERC20IndividuallyCappedCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20Instance.address,   //代币地址
            accounts[0]                         //代币从这个地址发送
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20Instance.approve(ERC20IndividuallyCappedCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(),'ether'));
    });
});

    it('Testing ERC20IndividuallyCappedCrowdsale token', async () => {
        address = await ERC20IndividuallyCappedCrowdsaleInstance.token();
        assert.equal(address, ERC20Instance.address);
    });

    it('Testing ERC20IndividuallyCappedCrowdsale wallet', async () => {
        address = await ERC20IndividuallyCappedCrowdsaleInstance.wallet();
        assert.equal(address, accounts[1]);
    });

    it('Testing ERC20IndividuallyCappedCrowdsale rate', async () => {
        rate = await ERC20IndividuallyCappedCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });

    it('Testing ERC20IndividuallyCappedCrowdsale tokenWallet', async () => {
        tokenWallet = await ERC20IndividuallyCappedCrowdsaleInstance.tokenWallet();
        assert.equal(accounts[0], tokenWallet);
    });

    it('Testing ERC20IndividuallyCappedCrowdsale setCap getCap', async () => {
        await ERC20IndividuallyCappedCrowdsaleInstance.setCap(accounts[2],web3.utils.toWei('10','ether'));
        const accounts2Cap = await ERC20IndividuallyCappedCrowdsaleInstance.getCap(accounts[2]);
        assert.equal(web3.utils.toWei('10','ether'), accounts2Cap);
    });

    it('Testing ERC20IndividuallyCappedCrowdsale buyTokens', async () => {
        await ERC20IndividuallyCappedCrowdsaleInstance.buyTokens(accounts[2],{value:web3.utils.toWei('10','ether')});
        amount = await ERC20Instance.balanceOf(accounts[2]);
        assert.equal(10 * rate, web3.utils.fromWei(amount,'ether'));
    });

    it('Testing ERC20IndividuallyCappedCrowdsale getContribution', async () => {
        getContribution = await ERC20IndividuallyCappedCrowdsaleInstance.getContribution(accounts[2]);
        assert.equal(10, web3.utils.fromWei(getContribution,'ether'));
    });

    it('Testing ERC20IndividuallyCappedCrowdsale weiRaised', async () => {
        weiRaised = await ERC20IndividuallyCappedCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised,'ether'));
    });

    it('Testing ERC20IndividuallyCappedCrowdsale remainingTokens', async () => {
        remainingTokens = await ERC20IndividuallyCappedCrowdsaleInstance.remainingTokens();
        assert.equal(totalSupply - 10 * rate, web3.utils.fromWei(remainingTokens,'ether'));
    });

    it('Testing ERC20IndividuallyCappedCrowdsale isCapper', async () => {
        accounts1IsCapper = await ERC20IndividuallyCappedCrowdsaleInstance.isCapper(accounts[1]);
        assert.ok(!accounts1IsCapper);
    });

    it('Testing ERC20IndividuallyCappedCrowdsale addCapper', async () => {
        await ERC20IndividuallyCappedCrowdsaleInstance.addCapper(accounts[1]);
        accounts1IsCapper = await ERC20IndividuallyCappedCrowdsaleInstance.isCapper(accounts[1]);
        assert.ok(accounts1IsCapper);
    });

    it('Testing ERC20IndividuallyCappedCrowdsale addCapper', async () => {
        await ERC20IndividuallyCappedCrowdsaleInstance.renounceCapper({from:accounts[1]});
        accounts1IsCapper = await ERC20IndividuallyCappedCrowdsaleInstance.isCapper(accounts[1]);
        assert.ok(!accounts1IsCapper);
    });

});
