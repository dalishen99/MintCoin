# MintCoin崔棉大师的花式发币法

## 发行代币同时锁仓
> 发行可锁仓的ERC20代币需要同时布署两个合约文件,其原理是首先将一个ERC20代币合约布署好之后,再将代币合约的地址作为参数传递给第二个锁仓的合约.
> 在锁仓合约布署好之后还需要调用ERC20代币合约的tracsfer方法将所有代币从发送者账户传递到锁仓合约的账户中.
## 先发行后锁仓
> 先按照发行ERC20代币的方法布署好合约,记录下合约地址,然后执行先发行后锁仓的布署脚本.
> 这里注意:为了运行本示例,布署脚本中直接实例化了刚布署的ERC20合约.而在实际情况中往往不能这么做,你可以将实例化合约的代码替换成合约地址,然后通过外部调用的方法将代币转移到锁仓合约的地址上.

> 锁仓合约调用方法
```javascript
//返回发行总量
totalSupply() external view returns (uint256)
//返回指定地址的余额
balanceOf(address account) external view returns (uint256)
//发送代币,从当前账户发送到指定地址
transfer(address recipient, uint256 amount) external returns (bool)
//查询owner给予spender的配额
allowance(address owner, address spender) external view returns (uint256)
//批准spender代表发送者使用amount数量的代币
approve(address spender, uint256 amount) external returns (bool)
//spender调用这个函数发送sender账户中的amount数量的代币给recipient
transferFrom(address sender, address recipient, uint256 amount) external returns (bool)
```

### 1.固定总量代币
```
./contract/ERC20FixedSupply.sol
```
### 2.锁仓合约文件
```
./contract/ERC20WithTokenTimelock.sol
```
> 在布署合约时定义以下变量(以下合约均需要定义)
```javascript
IERC20 token            //ERC20代币地址
address beneficiary     //受益人,可以是发送者意外的另一个账户
uint256 releaseTime     //解锁时间戳
```
> 合约调用方法(下同)
```javascript
token() public view returns (IERC20)            //返回ERC20合约
beneficiary() public view returns (address)     //返回受益人地址
releaseTime() public view returns (uint256)     //返回解锁时间
release() public                                //触发解锁,任何人都可以调用,但是只能释放给受益人
```
### 3.发行代币同时锁仓的布署脚本
```
./migrations/2_deploy_contracts.js
```
### 4.先发行后锁仓的布署脚本
```
./migrations/3_deploy_contracts.js
```

> 使用方法:
```shell
//安装Truffle,安装过请忽略
$ npm install truffle -g 
//安装依赖包
$ npm install          
//编译合约  
$ truffle compile     
//打开truffle开发环境
$ truffle develop 
//布署合约
truffle(develop)> migrate 
//实例化合约
truffle(develop)> const contract = await ERC20FixedSupply.deployed() 
//调用合约方法
truffle(develop)> contract.name() 
```
> 布署到主网方法: [链接](https://github.com/Fankouzu/smart-contract/tree/master/Solidity%20Lesson%2003) [视频课](https://www.bilibili.com/video/BV1vJ41117ck/)
