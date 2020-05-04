# MintCoin崔棉大师的花式发币法

## 多功能众筹合约:可增发,可销毁,有封顶,有配额,可暂停,有时限,白名单,成功后交付,不成功退款

[合约文件: MultiFunctionCrowdsale.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/Crowdsale/MultiFunctionCrowdsale.sol)

[测试脚本: MultiFunctionCrowdsale.js](https://github.com/Fankouzu/MintCoin/blob/master/test/Crowdsale/MultiFunctionCrowdsale.js)

[布署脚本: 20_deploy_MultiFunctionCrowdsale.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/20_deploy_MultiFunctionCrowdsale.js)

### 在布署合约时定义以下变量
```javascript
uint256 rate              //兑换比例1ETH兑换多少ERC20代币
address payable wallet    //接收ETH受益人地址
IERC20 token              //代币地址
address tokenWallet       //代币从这个地址发送
uint256 openingTime       // 众筹开始时间
uint256 closingTime       // 众筹结束时间
uint256 goal              // 众筹目标
uint256 cap               // 封顶数量,单位是wei
```
### 在布署众筹合约之后需要执行ERC20的方法
```javascript
//在布署之后必须将发送者账户中的代币批准给众筹合约
token.approve(crowdsale.address, SOME_TOKEN_AMOUNT);
//添加众筹合约的铸造权
token.addMinter(crowdsale.address);        
//撤销当前账户的铸造权
token.renounceMinter();  
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
//调用此方法可以从调用者账户中销毁代币
burn(uint256 amount) public 
//调用此方法可以从指定地址销毁代币,代币从发送者的批准中扣除
burnFrom(address account, uint256 amount) public 
//返回封顶数量
cap() public view returns (uint256)            
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
//返回指定地址是否拥有暂停权 
isPauser(address account) public view returns (bool)       
//给指定地址添加暂停权限,只有通过有暂停权的地址添加
addPauser(address account) public onlyPauser              
//撤销当前发送账户的暂停权
renouncePauser() public        
//返回合约当前是否已经暂停                           
paused() public view returns (bool)                    
//暂停合约   
pause() public onlyPauser whenNotPaused         
//恢复合约          
unpause() public onlyPauser whenPaused                  
//返回众筹开始时间
openingTime() public view returns (uint256)
//返回众筹结束时间
closingTime() public view returns (uint256)
//返回众筹是否开始
isOpen() public view returns (bool)
//返回众筹是否结束
hasClosed() public view returns (bool)
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
