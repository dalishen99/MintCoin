const ERC20Contract = artifacts.require("ERC20WithBurnable");
const ERC20 = require('./ERC20');

contract('可销毁代币', accounts => {
    describe("布署合约...",async function () {
        const param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            1000000000          //发行总量
        ];
        //测试ERC20合约的基本方法
        ERC20Instance = await ERC20(accounts, ERC20Contract, param);
    });
    describe("测试可销毁代币的特殊方法", function () {
        //测试销毁方法
        it('销毁方法: burn()', async function () {
            await ERC20Instance.burn(web3.utils.toWei('100', 'ether'), { from: accounts[3] });
            const account3Balance = await ERC20Instance.balanceOf(accounts[3]);
            assert.equal(0, web3.utils.fromWei(account3Balance, 'ether'));
        });
        //测试销毁批准方法,先将账户0的100个代币批准给账户2,然后使用账户2销毁账户0的100个代币
        it('销毁批准方法: burnFrom()', async function () {
            const accounts0BalanceBefore = await ERC20Instance.balanceOf(accounts[0]);
            await ERC20Instance.approve(accounts[2], web3.utils.toWei('100', 'ether'), { from: accounts[0] });
            await ERC20Instance.burnFrom(accounts[0], web3.utils.toWei('100', 'ether'), { from: accounts[2] });
            
            assert.equal(0, web3.utils.fromWei(await ERC20Instance.allowance(accounts[0], accounts[2]), 'ether'));
            const accounts0BalanceAfter = await ERC20Instance.balanceOf(accounts[0]);
            assert.equal(
                web3.utils.fromWei(accounts0BalanceBefore, 'ether') - 100,
                web3.utils.fromWei(accounts0BalanceAfter, 'ether')
            );
        });
    });
});
