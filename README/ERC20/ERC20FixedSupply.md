# MintCoin崔棉大师的花式发币法

## 固定总量代币

[合约文件: ERC20FixedSupply.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC20/ERC20FixedSupply.sol)

[测试脚本: ERC20FixedSupply.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC20/ERC20FixedSupply.js)

[布署脚本: 2_deploy_ERC20FixedSupply.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/2_deploy_ERC20FixedSupply.js)

### 在布署合约时定义以下变量
```javascript
string memory name,     //代币名称
string memory symbol,   //代币缩写
uint8 decimals ,        //精度
uint256 totalSupply     //发行总量
```
### 调用方法
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
