const assert = require('assert');
const ERC20Contract = artifacts.require("ERC20FixedSupply");
const ERC20PostDeliveryCrowdsale = artifacts.require("ERC20PostDeliveryCrowdsale");
const ERC20 = require('../ERC20/ERC20');

contract('成功后交付的众筹', accounts => {
    totalSupply = 1000000000;
    rate = 100;
    timelock = 5;
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
        ERC20PostDeliveryCrowdsaleInstance = await ERC20PostDeliveryCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20Instance.address,   //代币地址
            accounts[0],                        //代币从这个地址发送
            parseInt(new Date().getTime() / 1000) + 5,             //众筹开始时间
            parseInt(new Date().getTime() / 1000) + 5 + timelock   //众筹结束时间
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20Instance.approve(ERC20PostDeliveryCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
    });
});

    it('Testing ERC20PostDeliveryCrowdsale token', async () => {
        address = await ERC20PostDeliveryCrowdsaleInstance.token();
        assert.equal(address, ERC20Instance.address);
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
        amount = await ERC20Instance.balanceOf(accounts[2]);
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
        console.log('Waiting for ' + (timelock+10) + ' seconds ......')
        setTimeout(async () => {
            await ERC20PostDeliveryCrowdsaleInstance.withdrawTokens(accounts[2]);
            amount = await ERC20Instance.balanceOf(accounts[2]);
            assert.equal(10 * rate, web3.utils.fromWei(amount, 'ether'));
            done();
        }, timelock * 1000 + 10000);
    });

});
