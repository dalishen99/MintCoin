# MintCoin崔棉大师的花式发币法

## 可暂停代币
> 可暂停代币是指代币发行后,可以拥有权限的账户可以将代币所有功能暂停,当你的合约发生异常情况下将会有用
[合约文件: ERC20WithPausable.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC20/ERC20WithPausable.sol)

[测试脚本: ERC20WithPausable.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC20/ERC20WithPausable.js)

[布署脚本: 6_deploy_ERC20WithPausable.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/6_deploy_ERC20WithPausable.js)

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
```
