# MintCoin崔棉大师的花式发币法

## 可销毁代币
> 可销毁的代币是指代币在发行之后,持有者可以销毁自己持有的代币,也可以通过批准方法让第三方负责销毁.

[合约文件: WithBurnable.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC20/ERC20WithBurnable.sol)

[测试脚本: WithBurnable.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC20/ERC20WithBurnable.js)

[布署脚本: 3_deploy_ERC20WithBurnable.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/3_deploy_ERC20WithBurnable.js)

### 在布署合约时定义以下变量
```javascript
string memory name,     //代币名称
string memory symbol,   //代币缩写
uint8 decimals ,        //精度
uint256 totalSupply     //发行总量
```
### 调用方法
```javascript
//返回代币名称
name() public view returns (string memory)
//返回代币缩写
symbol() public view returns (string memory)
//返回代币精度
decimals() public view returns (uint8)
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
//增加给予spender的配额
increaseAllowance(address spender, uint256 addedValue) public returns (bool)
//减少给予spender的配额
decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool)
//特殊方法
//调用此方法可以从调用者账户中销毁代币
burn(uint256 amount) public 
//调用此方法可以从指定地址销毁代币,代币从发送者的批准中扣除
burnFrom(address account, uint256 amount) public 
```
