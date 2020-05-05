# MintCoin崔棉大师的花式发币法

## 可快照的ERC20代币
> 可快照的ERC20代币使用快照机制扩展了ERC20代币。创建快照后，将记录当时的余额和总供应量，以供以后访问。

> 快照由内部Snapshot函数创建，该内部函数将发出Snapshot事件并返回快照ID.要获取快照时的总供应量，请totalSupplyAt使用快照ID 调用该函数.要在快照时获取帐户余额，请balanceOfAt使用快照ID和帐户地址调用该函数.


[合约文件: ERC20WithSnapshot.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/Multi/ERC20WithSnapshot.sol)

[测试脚本: ERC20WithSnapshot.js](https://github.com/Fankouzu/MintCoin/blob/master/test/Multi/ERC20WithSnapshot.js)

[布署脚本: 26_deploy_ERC20WithSnapshot.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/26_deploy_ERC20WithSnapshot.js)

### 在布署合约时定义以下变量
```javascript
string memory name,     //代币名称
string memory symbol,   //代币缩写
uint8 decimals,         //精度
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
//快照合约的特殊方法
//创建快照
snapshot() public returns (uint256)
//根据快照ID查询指定地址的余额
balanceOfAt(address account, uint256 snapshotId) public view returns (uint256)
//根据快照ID查询发行总量
totalSupplyAt(uint256 snapshotId) public view returns(uint256)
//
```
