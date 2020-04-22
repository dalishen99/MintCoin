const assert = require('assert');
const ERC20FixedSupply = artifacts.require("ERC20FixedSupply");
const ERC20RefundableCrowdsale = artifacts.require("ERC20RefundableCrowdsale");

contract('ERC20RefundableCrowdsale', accounts => {
    totalSupply = 1000000000;
    rate = 100;
    before(async () => {
        ERC20FixedSupplyInstance = await ERC20FixedSupply.new(
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        );
        //众筹规则:
        //1.兑换比例1ETH:100ERC20
        //2.代币存于accounts[0]账户
        //3.众筹获得的ETH交给accounts[1]账户
        //4.众筹开始时间是当前时间
        //5.众筹结束时间是5秒后
        //6.众筹目标是2000个ERC20
        //7.没达到众筹目标,在众筹结束后可以退款
        //8.达到众筹目标,在众筹结束后提取代币
        timelock = 10;
        ERC20RefundableCrowdsaleInstance = await ERC20RefundableCrowdsale.new(
            rate,                               //兑换比例1ETH:100ERC20
            accounts[1],                        //接收ETH受益人地址
            ERC20FixedSupplyInstance.address,   //代币地址
            accounts[0],                        //代币从这个地址发送
            parseInt(new Date().getTime() / 1000) + 5,             //众筹开始时间
            parseInt(new Date().getTime() / 1000) + 5 + timelock,  //众筹结束时间
            web3.utils.toWei('20', 'ether')                  //众筹目标
        );
        //在布署之后必须将发送者账户中的代币批准给众筹合约
        await ERC20FixedSupplyInstance.approve(ERC20RefundableCrowdsaleInstance.address, web3.utils.toWei(totalSupply.toString(), 'ether'));
    });
    //验证Token地址
    it('Testing ERC20RefundableCrowdsale not reached token', async () => {
        address = await ERC20RefundableCrowdsaleInstance.token();
        assert.equal(address, ERC20FixedSupplyInstance.address);
    });
    //验证ETH受益人地址
    it('Testing ERC20RefundableCrowdsale not reached wallet', async () => {
        address = await ERC20RefundableCrowdsaleInstance.wallet();
        assert.equal(address, accounts[1]);
    });
    //验证兑换比例
    it('Testing ERC20RefundableCrowdsale not reached rate', async () => {
        rate = await ERC20RefundableCrowdsaleInstance.rate();
        assert.equal(100, rate);
    });
    //验证保存Token的账户
    it('Testing ERC20RefundableCrowdsale not reached tokenWallet', async () => {
        tokenWallet = await ERC20RefundableCrowdsaleInstance.tokenWallet();
        assert.equal(accounts[0], tokenWallet);
    });
    //验证结束时间
    it('Testing ERC20TimedCrowdsale openingTime closingTime', async () => {
        openingTime = await ERC20RefundableCrowdsaleInstance.openingTime();
        closingTime = await ERC20RefundableCrowdsaleInstance.closingTime();
        assert.ok(openingTime.toString() < closingTime.toString());
    });
    //验证购买代币,并且购买后账户中并没有获得代币
    it('Testing ERC20RefundableCrowdsale not reached buyTokens', (done) => {
        console.log('Waiting for 10 seconds ......')
        setTimeout(async () => {
            await ERC20RefundableCrowdsaleInstance.buyTokens(accounts[2], { value: web3.utils.toWei('20', 'ether') });
            amount = await ERC20FixedSupplyInstance.balanceOf(accounts[2]);
            assert.equal(0, web3.utils.fromWei(amount, 'ether'));
            done();
        }, 10000);
    });
    //验证众筹参与者购买到的Token
    it('Testing ERC20RefundableCrowdsale not reached balanceOf', async () => {
        balanceOf = await ERC20RefundableCrowdsaleInstance.balanceOf(accounts[2]);
        assert.equal(20 * rate, web3.utils.fromWei(balanceOf, 'ether'));
    });
    //验证众筹是否开始
    it('Testing ERC20RefundableCrowdsale not reached isOpen', async () => {
        assert.ok(await ERC20RefundableCrowdsaleInstance.isOpen());
    });
    //验证众筹的ETH销售额
    it('Testing ERC20RefundableCrowdsale not reached weiRaised', async () => {
        weiRaised = await ERC20RefundableCrowdsaleInstance.weiRaised();
        assert.equal(20, web3.utils.fromWei(weiRaised, 'ether'));
    });
    //验证众筹的剩余销售额
    it('Testing ERC20RefundableCrowdsale not reached remainingTokens', async () => {
        remainingTokens = await ERC20RefundableCrowdsaleInstance.remainingTokens();
        assert.equal(totalSupply - 20 * rate, web3.utils.fromWei(remainingTokens, 'ether'));
    });
    //验证众筹目标
    it('Testing ERC20RefundableCrowdsale not reached goal', async () => {
        myGoal = await ERC20RefundableCrowdsaleInstance.goal();
        assert.equal(20, web3.utils.fromWei(myGoal, 'ether'));
    });
    //验证众筹没有结束
    it('Testing ERC20RefundableCrowdsale not reached hasClosed', async () => {
        assert.ok(!await ERC20RefundableCrowdsaleInstance.hasClosed());
    });
    //验证众筹没有结束
    it('Testing ERC20RefundableCrowdsale not reached finalized', async () => {
        assert.ok(!await ERC20RefundableCrowdsaleInstance.finalized());
    });
    //验证时间到达后触发结束方法
    it('Testing ERC20RefundableCrowdsale not reached ', (done) => {
        console.log('Waiting for ' + timelock + ' seconds ......')
        setTimeout(async () => {
            await ERC20RefundableCrowdsaleInstance.finalize();
            assert.ok(await ERC20RefundableCrowdsaleInstance.finalized());
            done();
        }, timelock * 1000 + 1000);
    });
    //验证达到众筹目标
    it('Testing ERC20RefundableCrowdsale not reached goalReached', async () => {
        assert.ok(await ERC20RefundableCrowdsaleInstance.goalReached());
    });
    //验证众筹成功后可以提款
    it('Testing ERC20RefundableCrowdsale not reached withdrawTokens', async () => {
        await assert.doesNotReject(ERC20RefundableCrowdsaleInstance.withdrawTokens(accounts[2]));
    });
    //验证众筹成功后不能退回ETH
    it('Testing ERC20RefundableCrowdsale not reached claimRefund', async () => {
        await assert.rejects(ERC20RefundableCrowdsaleInstance.claimRefund(accounts[2]),/goal reached/);
    });

});
