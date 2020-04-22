const assert = require('assert');
const ERC20WithCapped = artifacts.require("ERC20WithCapped"); 
const {ERC20} = require('./ERC20');

contract('ERC20WithCapped', accounts => {
    before(async () => {
        Instance = await ERC20WithCapped.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            1000,               //初始发行量
            1000000000          //封顶上限
        );
    });
    
    it('Testing ERC20FixedSupply Detail', async () => {
        await ERC20(Instance,accounts);
    });

    it('Testing ERC20FixedSupply transfer', async () => {
        await Instance.transfer(accounts[1],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account1Balance = await Instance.balanceOf(accounts[1]);
        assert.equal(100, web3.utils.fromWei(account1Balance,'ether'));
    });

    it('Testing ERC20FixedSupply approve allowance', async () => {
        await Instance.approve(accounts[2],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account2Allowance = await Instance.allowance(accounts[0],accounts[2]);
        assert.equal(100, web3.utils.fromWei(account2Allowance,'ether'));
    });
    
    it('Testing ERC20FixedSupply transferFrom', async () => {
        await Instance.transferFrom(accounts[0],accounts[3],web3.utils.toWei('100','ether'),{from:accounts[2]});
        const account3Balance = await Instance.balanceOf(accounts[3]);
        assert.equal(100, web3.utils.fromWei(account3Balance,'ether'));
    });
    
    it('Testing ERC20FixedSupply increaseAllowance', async () => {
        await Instance.increaseAllowance(accounts[2],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account2Allowance = await Instance.allowance(accounts[0],accounts[2]);
        assert.equal(100, web3.utils.fromWei(account2Allowance,'ether'));
    });
    
    it('Testing ERC20FixedSupply decreaseAllowance', async () => {
        await Instance.decreaseAllowance(accounts[2],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account2Allowance = await Instance.allowance(accounts[0],accounts[2]);
        assert.equal(0, web3.utils.fromWei(account2Allowance,'ether'));
    });

    it('Testing ERC20WithMintable cap', async () => {
        await assert.rejects(Instance.mint(accounts[0],web3.utils.toWei('1000000000','ether')),/cap exceeded/);
    });

});
