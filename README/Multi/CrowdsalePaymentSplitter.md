# MintCoin崔棉大师的花式发币法

## 股份制受益人合约
> 股份制受益人合约是指在众筹合约的基础上，将众筹受益人地址设置为股份制受益人的合约地址，这样当众筹获得收益后，ETH会被保存到股份制受益人合约.当合约设置的股东想要取回收益时，可以从股份制受益人合约按照布署时设定的股份比例取回收益.

> 股东和股份比例在布署合约时设定,后期不能更改.

[合约文件: CrowdsalePaymentSplitter.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/Multi/AllowanceCrowdsale.sol)

[测试脚本: CrowdsalePaymentSplitter.js](https://github.com/Fankouzu/MintCoin/blob/master/test/Multi/AllowanceCrowdsale.js)

[布署脚本: 27_deploy_CrowdsalePaymentSplitter.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/27_deploy_CrowdsalePaymentSplitter.js)

### 在布署合约时定义以下变量
```javascript
address[] memory payees,    //股东数组
uint256[] memory shares     //股份比例
```
### 调用方法
```javascript
//返回股份比例的总和
totalShares() public view returns (uint256)
//返回总共释放的数额
totalReleased() public view returns (uint256) 
//返回指定账户的股份数额
shares(address account) public view returns (uint256)
//释放指定账户已释放的数额
released(address account) public view returns (uint256)
//返回股东账户地址
payee(uint256 index) public view returns (address)
//释放方法
release(address payable account) public
```
