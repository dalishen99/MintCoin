module.exports = (accounts, ERC20Contract, param) => {
    before(async function () {
        //布署代币合约
        ERC20Instance = await ERC20Contract.new(...param);
    });
    describe("测试ERC20合约的基本信息", async function () {
        it('代币名称: name()', async function () {
            assert.equal(param[0], await ERC20Instance.name());
        });
        it('代币缩写: symbol()', async function () {
            assert.equal(param[1], await ERC20Instance.symbol());
        });
        it('代币精度: decimals()', async function () {
            const decimals = await ERC20Instance.decimals();
            assert.equal(param[2], decimals.toString());
        });
    });
    describe("测试ERC20合约的标准方法", async function () {
        //测试代币总量
        it('代币总量: totalSupply()', async function () {
            assert.equal(param[3], web3.utils.fromWei(await ERC20Instance.totalSupply(), 'ether'));
        });
        //测试创建者账户余额
        it('账户余额: balanceOf()', async function () {
            assert.equal(param[3], web3.utils.fromWei(await ERC20Instance.balanceOf(accounts[0]), 'ether'));
        });
        //测试代币发送,从账户0发送到账户1,再查询账户1余额
        it('代币发送: transfer()', async function () {
            await ERC20Instance.transfer(accounts[1], web3.utils.toWei('100', 'ether'), { from: accounts[0] });
            assert.equal(100, web3.utils.fromWei(await ERC20Instance.balanceOf(accounts[1]), 'ether'));
        });
        //测试批准代币,账户0批准100个代币给账户2,再查询账户0给账户2的批准为100
        it('批准代币: approve()', async function () {
            await ERC20Instance.approve(accounts[2], web3.utils.toWei('100', 'ether'), { from: accounts[0] });
            assert.equal(100, web3.utils.fromWei(await ERC20Instance.allowance(accounts[0], accounts[2]), 'ether'));
        });
        //测试发送批准,账户2将账户0的100个代币发送给账户3,再查询账户3的余额为100
        it('发送批准: transferFrom()', async function () {
            await ERC20Instance.transferFrom(accounts[0], accounts[3], web3.utils.toWei('100', 'ether'), { from: accounts[2] });
            assert.equal(100, web3.utils.fromWei(await ERC20Instance.balanceOf(accounts[3]), 'ether'));
        });
        //测试增加批准额,账户0给账户2增加100个代币的批准,再查询账户0给账户2的批准为100
        it('增加批准额: increaseAllowance()', async function () {
            await ERC20Instance.increaseAllowance(accounts[2], web3.utils.toWei('100', 'ether'), { from: accounts[0] });
            assert.equal(100, web3.utils.fromWei(await ERC20Instance.allowance(accounts[0], accounts[2]), 'ether'));
        });
        //测试减少批准额,账户0减少账户2的批准额100个代币,再查询账户0给账户2的批准为0
        it('减少批准额: decreaseAllowance()', async function () {
            await ERC20Instance.decreaseAllowance(accounts[2], web3.utils.toWei('100', 'ether'), { from: accounts[0] });
            assert.equal(0, web3.utils.fromWei(await ERC20Instance.allowance(accounts[0], accounts[2]), 'ether'));
        });
    });
    after(()=>{
        return ERC20Instance;
    })
}
