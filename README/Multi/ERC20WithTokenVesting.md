# MintCoin崔棉大师的花式发币法

## 分期释放合约
> 分期释放合约类似于锁仓合约,区别是被锁定的ERC20代币将按照合约布署时规定的时间周期逐步释放给受益人.
> 释放周期的计算方法为:在`start`开始时间之后计算,以秒为单位,直到`cliffDuration`断崖时间之后可以释放,在`duration`持续时间到达之后结束.
> 例如:锁仓4年,1年之后开始释放,这样就是start=now();cliffDuration=1 year;duration=4 year;
> 在`cliffDuration`之后的任何时间都可以调用释放方法,释放数额的计算方法为: 锁仓总数额 * ((当前时间 - 开始时间) / 持续时间) - 已释放数


[合约文件: ERC20WithTokenVesting.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/Multi/ERC20WithTokenVesting.sol)

[测试脚本: ERC20WithTokenVesting.js](https://github.com/Fankouzu/MintCoin/blob/master/test/Multi/ERC20WithTokenVesting.js)

[布署脚本: 28_deploy_ERC20WithTokenVesting.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/28_deploy_ERC20WithTokenVesting.js)

### 在布署合约时定义以下变量
```javascript
address beneficiary,        //受益人
uint256 start,              //开始时间
uint256 cliffDuration,      //断崖时间
uint256 duration,           //持续时间
bool revocable              //是否可撤销
```
### 布署合约之后执行
```javascript
//在布署之后所有旧合约的用户必须将账户中的代币批准给迁移合约
token.transfer(ERC20WithTokenVesting.address, SOME_TOKEN_AMOUNT);
```
### 调用方法
```javascript
//返回受益人地址
beneficiary() public view returns (address)
//返回开始时间
start() public view returns (uint256)
//返回断崖时间
cliff() public view returns (uint256)
//返回持续时间
duration() public view returns (uint256)
//返回能否撤销
revocable() public view returns (bool)
//返回已经释放数量
released(address token) public view returns (uint256)
//返回是否撤销
revoked(address token) public view returns (bool)
//释放方法
release(IERC20 token) public
//撤销方法
revoke(IERC20 token) public onlyOwner
```
