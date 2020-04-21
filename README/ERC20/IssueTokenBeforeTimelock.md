# MintCoin崔棉大师的花式发币法

## 发行代币之后锁仓
### 注意
> 先按照发行ERC20代币的方法布署好合约,记录下合约地址,然后执行先发行后锁仓的布署脚本.

> 而在实际情况中往往不能这么做,你可以将实例化合约的代码替换成合约地址,然后通过外部调用的方法将代币转移到锁仓合约的地址上.

> 为了运行本示例,布署脚本中直接实例化了刚布署的ERC20合约.

[合约文件: WithTokenTimelock.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC20/ERC20WithTokenTimelock.sol)

[测试脚本: WithTokenTimelock.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC20/ERC20WithTokenTimelock.js)

[布署脚本: 8_deploy_IssueTokenBeforeTimelock.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/8_deploy_IssueTokenBeforeTimelock.js)

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
