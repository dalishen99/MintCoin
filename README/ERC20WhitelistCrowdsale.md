# MintCoin崔棉大师的花式发币法

## 白名单众筹
> 众筹代币是指在代币发行后,任何一个地址都可以向众筹地址使用ETH购买代币.

> 代币和ETH的兑换比例在合约布署同时设定.

> 所有的众筹合约都要在一个ERC20代币布署成功后再布署众筹合约,布署脚本中已经设置了一个固定总量的众筹合约

> 白名单众筹是指只能被加入到白名单的账户才可以参与购买代币的众筹

[合约文件: ERC20WhitelistCrowdsale.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC20/ERC20WhitelistCrowdsale.sol)

[测试脚本: ERC20WhitelistCrowdsale.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC20WhitelistCrowdsale.js)

[布署脚本: 15_deploy_WhitelistCrowdsale.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/15_deploy_WhitelistCrowdsale.js)

### 在布署合约时定义以下变量
```javascript
uint256 rate               //兑换比例1ETH兑换多少ERC20代币
address payable wallet     //接收ETH受益人地址
IERC20 token               //代币地址
address tokenWallet        //代币从这个地址发送
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
//返回指定账户是否在白名单
isWhitelisted(address account) public view returns (bool)
//添加指定账户到白名单
addWhitelisted(address account) public onlyWhitelistAdmin
//从白名单移除指定账户
removeWhitelisted(address account) public onlyWhitelistAdmin
//从白名单撤销自己的账户
renounceWhitelisted() public
//返回指定账户是否是白名单管理员
isWhitelistAdmin(address account) public view returns (bool)
//添加指定账户到白名单管理员
addWhitelistAdmin(address account) public onlyWhitelistAdmin
//从白名单管理员撤销自己的账户
renounceWhitelistAdmin() public
```
