# MintCoin崔棉大师的花式发币法

## 铸造式众筹

> 代币发行时可以设置一个初始总量,也可以设置为0,当代币以指定的兑换比例销售时才铸造代币,销售多少铸造多少.

> 代币和ETH的兑换比例在合约布署同时设定.

> 所有的众筹合约都要在一个ERC20代币布署成功后再布署众筹合约,布署脚本中已经设置了一个可增发代币的众筹合约


[合约文件: ERC20MintedCrowdsale.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/Crowdsale/MintedCrowdsale.sol)

[测试脚本: ERC20MintedCrowdsale.js](https://github.com/Fankouzu/MintCoin/blob/master/test/Crowdsale/MintedCrowdsale.js)

[布署脚本: 10_deploy_MintedCrowdsale.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/10_deploy_MintedCrowdsale.js)

### 在布署合约时定义以下变量
```javascript
uint256 rate               //兑换比例1ETH兑换多少ERC20代币
address payable wallet     //接收ETH受益人地址
IERC20 token               //代币地址
```
### 在布署众筹合约之后需要执行ERC20的方法
```javascript
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
```
