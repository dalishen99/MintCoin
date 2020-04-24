const assert = require('assert');
const ERC20Contract = artifacts.require("ERC20WithMintable");
const ERC20MintedCrowdsale = artifacts.require("ERC20MintedCrowdsale");
const ERC20 = require('../ERC20/ERC20');

contract('铸造式众筹', accounts => {
    totalSupply = 1000;
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
        ERC20MintedCrowdsaleInstance = await ERC20MintedCrowdsale.new(
            rate,                        //兑换比例
            accounts[0],                //接收ETH受益人地址
            ERC20Instance.address,  //代币地址
        );
        await ERC20Instance.addMinter(ERC20MintedCrowdsaleInstance.address);
        await ERC20Instance.renounceMinter();
    });
});

    it('Testing ERC20MintedCrowdsale token', async () => {
        address = await ERC20MintedCrowdsaleInstance.token();
        assert.equal(address, ERC20Instance.address);
    });

    it('Testing ERC20MintedCrowdsale wallet', async () => {
        address = await ERC20MintedCrowdsaleInstance.wallet();
        assert.equal(address, accounts[0]);
    });

    it('Testing ERC20MintedCrowdsale rate', async () => {
        rate = await ERC20MintedCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });

    it('Testing ERC20MintedCrowdsale buyTokens', async () => {
        totalSupply_before = await ERC20Instance.totalSupply();
        assert.equal(totalSupply, web3.utils.fromWei(totalSupply_before, 'ether'));
        await ERC20MintedCrowdsaleInstance.buyTokens(accounts[1], { value: web3.utils.toWei('10', 'ether') });
        amount = await ERC20Instance.balanceOf(accounts[1]);
        assert.equal(10 * rate, web3.utils.fromWei(amount, 'ether'));
        totalSupply_after = await ERC20Instance.totalSupply();
        assert.equal(totalSupply + 10 * rate, web3.utils.fromWei(totalSupply_after, 'ether'));
    });

    it('Testing ERC20MintedCrowdsale weiRaised', async () => {
        weiRaised = await ERC20MintedCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised, 'ether'));
    });

});
