const assert = require('assert');
const ERC20WithPausable = artifacts.require("ERC20WithPausable"); 
const {ERC20} = require('./ERC20');

contract('ERC20WithPausable', accounts => {
    before(async () => {
        Instance = await ERC20WithPausable.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            1000000000          //发行总量
        );
    });

    it('Testing ERC20FixedSupply Detail', async () => {
        await ERC20(Instance,accounts);
    });

    it('Testing ERC20WithPausable transfer', async () => {
        await Instance.transfer(accounts[1],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account1Balance = await Instance.balanceOf(accounts[1]);
        assert.equal(100, web3.utils.fromWei(account1Balance,'ether'));
    });

    it('Testing ERC20WithPausable approve', async () => {
        await Instance.approve(accounts[2],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account2Allowance = await Instance.allowance(accounts[0],accounts[2]);
        assert.equal(100, web3.utils.fromWei(account2Allowance,'ether'));
    });
    
    it('Testing ERC20WithPausable transferFrom', async () => {
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

    it('Testing ERC20WithPausable isPauser', async () => {
        const isPauser = await Instance.isPauser(accounts[0]);
        assert.ok(isPauser);
    });

    it('Testing ERC20WithPausable addPauser', async () => {
        await Instance.addPauser(accounts[1],{from:accounts[0]});
        isPauser = await Instance.isPauser(accounts[1]);
        assert.ok(isPauser);
    });

    it('Testing ERC20WithPausable paused', async () => {
        await Instance.paused({from:accounts[1]});
        const isPause = await Instance.paused();
        assert.ok(!isPause);
    });

    it('Testing ERC20WithPausable pause', async () => {
        await Instance.pause({from:accounts[1]});
        const isPause = await Instance.paused();
        assert.ok(isPause);
    });

    it('Testing ERC20WithPausable transfer pause', async () => {
        await assert.rejects(Instance.transfer(accounts[1],web3.utils.toWei('100','ether'),{from:accounts[0]}),/paused/);
    });

    it('Testing ERC20WithPausable unpause', async () => {
        await Instance.unpause({from:accounts[1]});
        const isPause = await Instance.paused();
        assert.ok(!isPause);
    });

    it('Testing ERC20WithPausable renouncePauser', async () => {
        await Instance.renouncePauser({from:accounts[1]});
        isPauser = await Instance.isPauser(accounts[1]);
        assert.ok(!isPauser);
    });
});
