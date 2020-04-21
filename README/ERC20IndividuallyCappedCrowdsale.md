# MintCoin崔棉大师的花式发币法

## 有配额的众筹
> 众筹代币是指在代币发行后,任何一个地址都可以向众筹地址使用ETH购买代币.

> 代币和ETH的兑换比例在合约布署同时设定.

> 所有的众筹合约都要在一个ERC20代币布署成功后再布署众筹合约,布署脚本中已经设置了一个固定总量的众筹合约

> 有配额的众筹是指购买代币的账户必须在设置配额后才可以购买代币

[合约文件: ERC20IndividuallyCappedCrowdsale.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC20/ERC20IndividuallyCappedCrowdsale.sol)

[测试脚本: ERC20IndividuallyCappedCrowdsale.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC20IndividuallyCappedCrowdsale.js)

[布署脚本: 12_deploy_IndividuallyCappedCrowdsale.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/12_deploy_IndividuallyCappedCrowdsale.js)

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
//设置指定账户的封顶数量,单位是wei
setCap(address beneficiary, uint256 cap) external onlyCapper
//获取指定账户的封顶配额
getCap(address beneficiary) public view returns (uint256)
//获取指定账户提供的ETH数量
getContribution(address beneficiary) public view returns (uint256)
//返回指定账户是否拥有设置配额的权限
isCapper(address account) public view returns (bool)
//给指定账户添加设置配额的权限
addCapper(address account) public onlyCapper
//撤销当前账户的设置配额权限
renounceCapper() public
```
