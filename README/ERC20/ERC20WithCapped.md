# MintCoin崔棉大师的花式发币法

## 有封顶代币
> 有封顶的代币指的是在可增发代币的基础上设置了铸造封顶数额,当铸造到达封顶数额时将抛出异常.

[合约文件: ERC20WithCapped.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC20/ERC20WithCapped.sol)

[测试脚本: ERC20WithCapped.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC20/ERC20WithCapped.js)

[布署脚本: 5_deploy_ERC20WithCapped.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/5_deploy_ERC20WithCapped.js)

### 在布署合约时定义以下变量
```javascript
string memory name,     //代币名称
string memory symbol,   //代币缩写
uint8 decimals ,        //精度
uint256 totalSupply     //发行总量
uint256 cap             //封顶数量 
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
//返回封顶数量
cap() public view returns (uint256)     
//查询指定地址是否拥有铸币权
isMinter(address account) public view returns (bool)   
//给指定地址添加铸币权,只能通过有铸币权的地址添加
addMinter(address account) public onlyMinter          
//撤销当前发送账户的铸币权 
renounceMinter() public               
//铸币                 
mint(address account, uint256 amount) public onlyMinter returns (bool) 
```
