const assert = require('assert');
const ERC20WithCapped = artifacts.require("ERC20WithCapped"); 

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
    it('Testing ERC20WithCapped Detail', async () => {

        const symbol = await Instance.symbol();
        const name = await Instance.name();
        const decimals = await Instance.decimals();
        const totalSupply = await Instance.totalSupply();
        const cap = await Instance.cap();
        const creatorBalance = await Instance.balanceOf(accounts[0]);
        const noCreatorBalance = await Instance.balanceOf(accounts[1]);

        assert.equal('My Golden Coin', name);
        assert.equal('MGC', symbol);
        assert.equal('18', decimals.toString());
        assert.equal(web3.utils.fromWei(totalSupply,'ether'), web3.utils.fromWei(creatorBalance,'ether'));
        assert.equal(noCreatorBalance, '0');
        assert.equal(cap, web3.utils.toWei('1000000000','ether'));
    });

    it('Testing ERC20WithMintable cap', async () => {
        await assert.rejects(Instance.mint(accounts[0],web3.utils.toWei('1000000000','ether')),/cap exceeded/);
    });

});
