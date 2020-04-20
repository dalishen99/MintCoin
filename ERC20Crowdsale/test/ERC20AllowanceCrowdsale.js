const assert = require('assert');
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply"); 
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply"); 

contract('ERC20FixedSupply', accounts => {
    before(async () => {
        Instance = await ERC20FixedSupply.deployed();
    });
    it('Testing ERC20FixedSupply Detail', async () => {

        const symbol = await Instance.symbol();
        const name = await Instance.name();
        const decimals = await Instance.decimals();
        const totalSupply = await Instance.totalSupply();
        const creatorBalance = await Instance.balanceOf(accounts[0]);
        const noCreatorBalance = await Instance.balanceOf(accounts[1]);

        assert.equal('My Golden Coin', name);
        assert.equal('MGC', symbol);
        assert.equal('18', decimals.toString());
        assert.equal(web3.utils.fromWei(totalSupply,'ether'), web3.utils.fromWei(creatorBalance,'ether'));
        assert.equal(noCreatorBalance, '0');
    });

    it('Testing ERC20FixedSupply transfer', async () => {
        await Instance.transfer(accounts[1],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account1Balance = await Instance.balanceOf(accounts[1]);
        assert.equal(100, web3.utils.fromWei(account1Balance,'ether'));
    });

    it('Testing ERC20FixedSupply approve', async () => {
        await Instance.approve(accounts[2],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account2Allowance = await Instance.allowance(accounts[0],accounts[2]);
        assert.equal(100, web3.utils.fromWei(account2Allowance,'ether'));
    });
    
    it('Testing ERC20FixedSupply transferFrom', async () => {
        await Instance.transferFrom(accounts[0],accounts[3],web3.utils.toWei('100','ether'),{from:accounts[2]});
        const account3Balance = await Instance.balanceOf(accounts[3]);
        assert.equal(100, web3.utils.fromWei(account3Balance,'ether'));
    });
});
