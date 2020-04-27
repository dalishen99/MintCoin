const assert = require('assert');
const {ether} = require('@openzeppelin/test-helpers');
module.exports = (rate, skipBuy) => {
    describe("测试通用的众筹合约", function () {
        //测试ERC20代币地址
        it('ERC20代币地址: token()', async function () {
            assert.equal(ERC20Instance.address, await CrowdsaleInstance.token());
        });
        //测试ETH受益人地址
        it('ETH受益人地址: wallet()', async function () {
            assert.equal(sender, await CrowdsaleInstance.wallet());
        });
        //测试兑换比例
        it('兑换比例: rate()', async function () {
            assert.equal(rate, await CrowdsaleInstance.rate());
        });
        //测试发送代币账户
        it('发送代币账户: tokenWallet()', async function () {
            assert.equal(owner, await CrowdsaleInstance.tokenWallet());
        });
        //测试购买代币方法
        it('购买代币方法: buyTokens()', async function () {
            if (skipBuy === true) {
                this.skip();
            } else {
                await CrowdsaleInstance.buyTokens(sender, { value: eth,from:sender });
                assert.equal(ether((10 * rate).toString()).toString(), (await ERC20Instance.balanceOf(sender)).toString());
            }
        });
        //测试众筹收入
        it('众筹收入: weiRaised()', async function () {
            if (skipBuy === true) {
                this.skip();
            } else {
                assert.equal(ether('10'), (await CrowdsaleInstance.weiRaised()).toString());
            }
        });
        //测试剩余代币数量
        it('剩余代币数量: remainingTokens()', async function () {
            assert.equal(
                (await ERC20Instance.balanceOf(owner)),
                (await CrowdsaleInstance.remainingTokens()).toString()
            );
        });
    });

    after(function () {
        return ERC20Instance;
    })
}
