const assert = require('assert');
const ERC20WithMintable = artifacts.require("ERC20WithMintable");
const ERC20MintedCrowdsale = artifacts.require("ERC20MintedCrowdsale");

contract('ERC20MintedCrowdsale', accounts => {
    totalSupply = 1000;
    rate = 100;
    before(async () => {
        ERC20WithMintableInstance = await ERC20WithMintable.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        );
        ERC20MintedCrowdsaleInstance = await ERC20MintedCrowdsale.new(
            rate,                        //兑换比例
            accounts[0],                //接收ETH受益人地址
            ERC20WithMintableInstance.address,  //代币地址
        );
        await ERC20WithMintableInstance.addMinter(ERC20MintedCrowdsaleInstance.address);
        await ERC20WithMintableInstance.renounceMinter();
    });

    it('Testing ERC20MintedCrowdsale token', async () => {
        address = await ERC20MintedCrowdsaleInstance.token();
        assert.equal(address, ERC20WithMintableInstance.address);
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
        totalSupply_before = await ERC20WithMintableInstance.totalSupply();
        assert.equal(totalSupply, web3.utils.fromWei(totalSupply_before, 'ether'));
        await ERC20MintedCrowdsaleInstance.buyTokens(accounts[1], { value: web3.utils.toWei('10', 'ether') });
        amount = await ERC20WithMintableInstance.balanceOf(accounts[1]);
        assert.equal(10 * rate, web3.utils.fromWei(amount, 'ether'));
        totalSupply_after = await ERC20WithMintableInstance.totalSupply();
        assert.equal(totalSupply + 10 * rate, web3.utils.fromWei(totalSupply_after, 'ether'));
    });

    it('Testing ERC20MintedCrowdsale weiRaised', async () => {
        weiRaised = await ERC20MintedCrowdsaleInstance.weiRaised();
        assert.equal(10, web3.utils.fromWei(weiRaised, 'ether'));
    });

});
