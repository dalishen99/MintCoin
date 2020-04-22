const assert = require('assert');

const ERC20 = async (Instance,accounts) => {
    const symbol = await Instance.symbol();
    const name = await Instance.name();
    const decimals = await Instance.decimals();
    const totalSupply = await Instance.totalSupply();
    const creatorBalance = await Instance.balanceOf(accounts[0]);
    const noCreatorBalance = await Instance.balanceOf(accounts[1]);

    assert.equal('My Golden Coin', name);
    assert.equal('MGC', symbol);
    assert.equal('18', decimals.toString());
    assert.equal(web3.utils.fromWei(totalSupply, 'ether'), web3.utils.fromWei(creatorBalance, 'ether'));
    assert.equal(noCreatorBalance, '0');
}

module.exports = {
    ERC20
};
