# MintCoin崔棉大师的花式发币法

## 不成功退款的众筹
> 众筹代币是指在代币发行后,任何一个地址都可以向众筹地址使用ETH购买代币.

> 代币和ETH的兑换比例在合约布署同时设定.

> 所有的众筹合约都要在一个ERC20代币布署成功后再布署众筹合约,布署脚本中已经设置了一个固定总量的ERC20合约

> 不成功退款的众筹是指在成功后交付的众筹的基础上,设置了众筹目标(以ETH数量衡量).
> 当众筹时间到达后,如果众筹目标没有到达,购买者可以通过claimRefund()方法退回ETH.
> 当众筹时间到达后,如果到达了众筹目标,购买者才可以通过withdrawTokens()方法提取到ERC20代币.

[合约文件: RefundableCrowdsale.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/Crowdsale/RefundableCrowdsale.sol)

[测试脚本1(到达众筹目标): RefundableCrowdsaleReached.js](https://github.com/Fankouzu/MintCoin/blob/master/test/Crowdsale/RefundableCrowdsaleReached.js)

[测试脚本2(没到达众筹目标): RefundableCrowdsaleNotReach.js](https://github.com/Fankouzu/MintCoin/blob/master/test/Crowdsale/RefundableCrowdsaleNotReach.js)

[布署脚本: 14_deploy_RefundableCrowdsale.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/14_deploy_RefundableCrowdsale.js)

### 在布署合约时定义以下变量
```javascript
uint256 rate               //兑换比例1ETH兑换多少ERC20代币
address payable wallet     //接收ETH受益人地址
IERC20 token               //代币地址
address tokenWallet        //代币从这个地址发送
uint256 openingTime        //众筹开始时间
uint256 closingTime        //众筹结束时间
uint256 goal               //众筹目标
```
### 在布署众筹合约之后需要执行ERC20的方法
```javascript
//在布署之后必须将发送者账户中的代币批准给众筹合约
token.approve(crowdsale.address, SOME_TOKEN_AMOUNT);
```
### 调用方法
```javascript
//返回代币地址
token() public view returns (IERC20)          
//返回受益人地址              
wallet() public view returns (address payable)              
//返回兑换比例
rate() public view returns (uint256) 
//返回销售额
weiRaised() public view returns (uint256)         
//购买代币,代币发送给指定地址          
buyTokens(address beneficiary) public nonReentrant payable  
//特殊方法
//返回代币现存地址
tokenWallet() public view returns (address)                 
//检查配额中剩余的代币数量
remainingTokens() public view returns (uint256)
//返回众筹开始时间
openingTime() public view returns (uint256)
//返回众筹结束时间
closingTime() public view returns (uint256)
//返回众筹是否开始
isOpen() public view returns (bool)
//返回众筹是否结束
hasClosed() public view returns (bool)
//返回合约是否已经结束
finalized() public view returns (bool)
//触发合约结束方法
finalize() public
//返回存储在合约上的ERC20数量
balanceOf(address account) public view returns (uint256)
//当众筹结束后,并且到达了众筹目标,触发可以提取ERC20
withdrawTokens(address beneficiary) public
//返回众筹目标,ETH的数量
goal() public view returns (uint256)
//当众筹结束后,并且没有达到目标时,触发这个方法可以给购买者退款
claimRefund(address payable refundee) public
//返回众筹目标是否到达
goalReached() public view returns (bool)
```
