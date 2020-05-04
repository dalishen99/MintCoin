const assert = require('assert');
const { contract, accounts, web3 } = require('@openzeppelin/test-environment');
const { ether, time, expectEvent } = require('@openzeppelin/test-helpers');
const CrowdsaleContract = contract.fromArtifact("AllowanceCrowdsaleContract");
const ERC20Contract = contract.fromArtifact("ERC20FixedSupply");
const PaymentSplitterContract = contract.fromArtifact("CrowdsalePaymentSplitter");
const ERC20 = require('../inc/ERC20');
const Crowdsale = require('../inc/Crowdsale');
//股份制受益人合约
const totalSupply = '1000000000';//发行总量
[owner, sender, receiver, purchaser, beneficiary, shareholder1, shareholder2, shareholder3, shareholder4] = accounts;
EthValue = '200';
rate = '1000';
TokenValue = (EthValue * rate).toString();
describe("股份制受益人合约", function () {
    it('布署代币合约', async function () {
        ERC20Param = [
            "My Golden Coin",   //代币名称
            "MGC",              //代币缩写
            18,                 //精度
            totalSupply         //发行总量
        ];
        ERC20Instance = await ERC20Contract.new(...ERC20Param, { from: owner });
    });
    it('股份制受益人合约', async function () {
        PaymentParam = [
            [shareholder1, shareholder2, shareholder3, shareholder4],
            [10, 20, 30, 40]
        ];
        PaymentInstance = await PaymentSplitterContract.new(...PaymentParam, { from: owner });
    });
    it('布署众筹合约', async function () {
        CrowdsaleParam = [
            rate,                                       //兑换比例1ETH:100ERC20
            PaymentInstance.address,                    //接收ETH受益人地址
            ERC20Instance.address,                      //代币地址
            owner,                                      //代币从这个地址发送
        ]
        CrowdsaleInstance = await CrowdsaleContract.new(...CrowdsaleParam, { from: owner });
    });
});
describe("布署后首先执行", function () {
    it('将代币批准给众筹合约', async function () {
        await ERC20Instance.approve(CrowdsaleInstance.address, ether(totalSupply), { from: owner });
    });
});
describe("测试ERC20合约基本信息", function () {
    ERC20.detail();
});
describe("测试通用的众筹方法", function () {
    Crowdsale.token();
    it('受益人合约地址: wallet()', async function () {
        assert.equal(PaymentInstance.address, await CrowdsaleInstance.wallet());
    });
    Crowdsale.rate(rate);
    Crowdsale.tokenWallet(owner);
});
describe("测试股份制受益人合约", function () {
    it('总份额: totalShares()', async function () {
        assert.equal('100', await PaymentInstance.totalShares());
    });
    it('总释放额: totalReleased()', async function () {
        assert.equal('0', await PaymentInstance.totalReleased());
    });
    it('验证账户份额: shares()', async function () {
        assert.equal('10', await PaymentInstance.shares(shareholder1));
        assert.equal('20', await PaymentInstance.shares(shareholder2));
        assert.equal('30', await PaymentInstance.shares(shareholder3));
        assert.equal('40', await PaymentInstance.shares(shareholder4));
    });
    it('验证股东账户: payee()', async function () {
        assert.equal(shareholder1, await PaymentInstance.payee('0'));
        assert.equal(shareholder2, await PaymentInstance.payee('1'));
        assert.equal(shareholder3, await PaymentInstance.payee('2'));
        assert.equal(shareholder4, await PaymentInstance.payee('3'));
    });
    it('验证账户已释放额: released()', async function () {
        assert.equal('0', await PaymentInstance.released(shareholder1));
        assert.equal('0', await PaymentInstance.released(shareholder2));
        assert.equal('0', await PaymentInstance.released(shareholder3));
        assert.equal('0', await PaymentInstance.released(shareholder4));
    });
});
describe("测试众筹购买", function () {
    Crowdsale.token();
    it('受益人合约地址: wallet()', async function () {
        assert.equal(PaymentInstance.address, await CrowdsaleInstance.wallet());
    });
    Crowdsale.rate(rate);
    Crowdsale.tokenWallet(owner);
    Crowdsale.buyTokens(purchaser, EthValue, '购买代币');
    Crowdsale.weiRaised(EthValue, '众筹收入为' + EthValue);
    ERC20.balanceOf(TokenValue.toString(), purchaser, '购买者账户余额为' + TokenValue)
    Crowdsale.remainingTokens(totalSupply - TokenValue, '配额中剩余的代币数量');
});
describe("测试股份制合约释放方法", function () {
    it('记录股东ETH余额', async function () {
        shareholder1Balance = await web3.eth.getBalance(shareholder1);
        shareholder2Balance = await web3.eth.getBalance(shareholder2);
        shareholder3Balance = await web3.eth.getBalance(shareholder3);
        shareholder4Balance = await web3.eth.getBalance(shareholder4);
    });
    it('释放方法: release()', async function () {
        let receipt;
        receipt = await PaymentInstance.release(shareholder1);
        expectEvent(receipt, 'PaymentReleased', {
            to: shareholder1
        });
        receipt = await PaymentInstance.release(shareholder2);
        expectEvent(receipt, 'PaymentReleased', {
            to: shareholder2
        });
        receipt = await PaymentInstance.release(shareholder3);
        expectEvent(receipt, 'PaymentReleased', {
            to: shareholder3
        });
        receipt = await PaymentInstance.release(shareholder4);
        expectEvent(receipt, 'PaymentReleased', {
            to: shareholder4
        });
    });
    it('验证账户已释放额: released()', async function () {
        assert.equal(ether('20'), (await PaymentInstance.released(shareholder1)).toString());
        assert.equal(ether('40'), (await PaymentInstance.released(shareholder2)).toString());
        assert.equal(ether('60'), (await PaymentInstance.released(shareholder3)).toString());
        assert.equal(ether('80'), (await PaymentInstance.released(shareholder4)).toString());
    });
    it('验证股东ETH余额增加', async function () {
        assert.equal('20', parseInt(web3.utils.fromWei((await web3.eth.getBalance(shareholder1) - shareholder1Balance).toString(), 'ether')));
        assert.equal('40', parseInt(web3.utils.fromWei((await web3.eth.getBalance(shareholder2) - shareholder1Balance).toString(), 'ether')));
        assert.equal('60', parseInt(web3.utils.fromWei((await web3.eth.getBalance(shareholder3) - shareholder1Balance).toString(), 'ether')));
        assert.equal('80', parseInt(web3.utils.fromWei((await web3.eth.getBalance(shareholder4) - shareholder1Balance).toString(), 'ether')));
    });
});