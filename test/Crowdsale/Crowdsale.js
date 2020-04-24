const assert = require('assert');
module.exports = (accounts, Contract, rate, CrowdsaleParam) => {
    before(async function () {
        //布署众筹合约
        CrowdsaleInstance = await Contract.new(
            rate,                               //兑换比例
            accounts[1],                        //接收ETH受益人地址
            ERC20Instance.address,              //代币地址
            accounts[0],                         //代币从这个地址发送
            ...CrowdsaleParam
        );
        ERC20Instance.approve(
            CrowdsaleInstance.address,
            web3.utils.toWei(totalSupply.toString(), 'ether'));
    });
    describe("测试通用的众筹合约", function () {
        //测试ERC20代币地址
        it('ERC20代币地址: token()', async function () {
            const tokenAddress = await CrowdsaleInstance.token();
            assert.equal(ERC20Instance.address, tokenAddress);
        });
        //测试ETH受益人地址
        it('ETH受益人地址: wallet()', async function () {
            const wallet = await CrowdsaleInstance.wallet();
            assert.equal(accounts[1], wallet);
        });
        //测试兑换比例
        it('兑换比例: rate()', async function () {
            assert.equal(rate, await CrowdsaleInstance.rate());
        });
        //测试发送代币账户
        it('发送代币账户: tokenWallet()', async function () {
            const tokenWallet = await CrowdsaleInstance.tokenWallet();
            assert.equal(accounts[0], tokenWallet);
        });
        //测试购买代币方法
        it('购买代币方法: buyTokens()', async function () {
            if (typeof CrowdsaleInstance.isOpen === typeof undefined) {
                await CrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') });
                const amount = await ERC20Instance.balanceOf(accounts[2]);
                assert.equal(10 * rate, web3.utils.fromWei(amount, 'ether'));
            } else {
                this.skip();
            }
        });
        //测试众筹收入
        it('众筹收入: weiRaised()', async function () {
            if (typeof CrowdsaleInstance.isOpen === typeof undefined) {
                const weiRaised = await CrowdsaleInstance.weiRaised();
                assert.equal(10, web3.utils.fromWei(weiRaised, 'ether'));
            } else {
                this.skip();
            }
        });
        //测试剩余代币数量
        it('剩余代币数量: remainingTokens()', async function () {
            const remainingTokens = await CrowdsaleInstance.remainingTokens();
            const accounts0Balance = await CrowdsaleInstance.remainingTokens();
            assert.equal(
                web3.utils.fromWei(accounts0Balance, 'ether'),
                web3.utils.fromWei(remainingTokens, 'ether')
            );
        });
    });

    after(function () {
        return ERC20Instance;
    })
}
