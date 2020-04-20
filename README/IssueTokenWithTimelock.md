# MintCoin崔棉大师的花式发币法

## 发行代币同时锁仓
### 注意
> 发行可锁仓的ERC20代币需要同时布署两个合约文件,其原理是首先将一个ERC20代币合约布署好之后,再将代币合约的地址作为参数传递给第二个锁仓的合约.

> 在锁仓合约布署好之后还需要调用ERC20代币合约的tracsfer方法将所有代币从发送者账户传递到锁仓合约的账户中.

>以上两点已经在布署脚本中设置好了

[合约文件: ERC20WithTokenTimelock.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC20/ERC20WithTokenTimelock.sol)

[测试脚本: ERC20WithTokenTimelock.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC20WithTokenTimelock.js)

[布署脚本: 7_deploy_IssueTokenWithTimelock.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/7_deploy_IssueTokenWithTimelock.js)

### 在布署合约时定义以下变量
```javascript
IERC20 token            //ERC20代币地址
address beneficiary     //受益人,可以是发送者以外的另一个账户
uint256 releaseTime     //解锁时间戳
```
### 调用方法(已省略ERC20调用方法)
```javascript
token() public view returns (IERC20)            //返回ERC20合约
beneficiary() public view returns (address)     //返回受益人地址
releaseTime() public view returns (uint256)     //返回解锁时间
release() public                                //触发解锁,任何人都可以调用,但是只能释放给受益人
```
