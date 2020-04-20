const assert = require('assert');
const ERC20WithMintable = artifacts.require("ERC20WithMintable"); 

contract('ERC20WithMintable', accounts => {
    before(async () => {
        Instance = await ERC20WithMintable.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            1000000000          //发行总量
        );
    });
    it('Testing ERC20WithMintable Detail', async () => {

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

    it('Testing ERC20WithMintable transfer', async () => {
        await Instance.transfer(accounts[1],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account1Balance = await Instance.balanceOf(accounts[1]);
        assert.equal(100, web3.utils.fromWei(account1Balance,'ether'));
    });

    it('Testing ERC20WithMintable approve', async () => {
        await Instance.approve(accounts[2],web3.utils.toWei('100','ether'),{from:accounts[0]});
        const account2Allowance = await Instance.allowance(accounts[0],accounts[2]);
        assert.equal(100, web3.utils.fromWei(account2Allowance,'ether'));
    });
    
    it('Testing ERC20WithMintable transferFrom', async () => {
        await Instance.transferFrom(accounts[0],accounts[3],web3.utils.toWei('100','ether'),{from:accounts[2]});
        const account3Balance = await Instance.balanceOf(accounts[3]);
        assert.equal(100, web3.utils.fromWei(account3Balance,'ether'));
    });

    it('Testing ERC20WithMintable mint', async () => {
        await Instance.mint(accounts[4],web3.utils.toWei('100','ether'));
        const account4Balance = await Instance.balanceOf(accounts[4]);
        assert.equal(100, web3.utils.fromWei(account4Balance,'ether'));
    });

    it('Testing ERC20WithMintable isMinter', async () => {
        const isMinter = await Instance.isMinter(accounts[0]);
        assert.ok(isMinter);
    });

    it('Testing ERC20WithMintable addMinter', async () => {
        await Instance.addMinter(accounts[1],{from:accounts[0]});
        isMinter = await Instance.isMinter(accounts[1]);
        assert.ok(isMinter);
    });

    it('Testing ERC20WithMintable renounceMinter', async () => {
        await Instance.renounceMinter({from:accounts[1]});
        isMinter = await Instance.isMinter(accounts[1]);
        assert.ok(!isMinter);
    });
});
