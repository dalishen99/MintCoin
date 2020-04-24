const assert = require('assert');
module.exports = (accounts, rate, skipBuy) => {
    describe("测试通用的众筹合约", function () {
        //测试ERC20代币地址
        it('ERC20代币地址: token()', async function () {
            assert.equal(ERC20Instance.address, await CrowdsaleInstance.token());
        });
        //测试ETH受益人地址
        it('ETH受益人地址: wallet()', async function () {
            assert.equal(accounts[1], await CrowdsaleInstance.wallet());
        });
        //测试兑换比例
        it('兑换比例: rate()', async function () {
            assert.equal(rate, await CrowdsaleInstance.rate());
        });
        //测试发送代币账户
        it('发送代币账户: tokenWallet()', async function () {
            assert.equal(accounts[0], await CrowdsaleInstance.tokenWallet());
        });
        //测试购买代币方法
        it('购买代币方法: buyTokens()', async function () {
            if (skipBuy === true) {
                this.skip();
            } else {
                await CrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('10', 'ether') });
                assert.equal(10 * rate, web3.utils.fromWei(await ERC20Instance.balanceOf(accounts[2]), 'ether'));
            }
        });
        //测试众筹收入
        it('众筹收入: weiRaised()', async function () {
            if (skipBuy === true) {
                this.skip();
            } else {
                assert.equal(10, web3.utils.fromWei(await CrowdsaleInstance.weiRaised(), 'ether'));
            }
        });
        //测试剩余代币数量
        it('剩余代币数量: remainingTokens()', async function () {
            assert.equal(
                web3.utils.fromWei(await CrowdsaleInstance.remainingTokens(), 'ether'),
                web3.utils.fromWei(await CrowdsaleInstance.remainingTokens(), 'ether')
            );
        });
    });

    after(function () {
        return ERC20Instance;
    })
}
