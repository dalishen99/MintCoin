# MintCoin崔棉大师的花式发币法

## 多功能ERC20代币,可增发,可销毁,可暂停,有封顶


[合约文件: ERC20MultiFunction.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/Multi/ERC20FixedSupply.sol)

[测试脚本: ERC20MultiFunction.js](https://github.com/Fankouzu/MintCoin/blob/master/test/Multi/ERC20FixedSupply.js)

[布署脚本: 19_deploy_ERC20MultiFunction.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/19_deploy_ERC20MultiFunction.js)

### 在布署合约时定义以下变量
```javascript
string memory name,     //代币名称
string memory symbol,   //代币缩写
uint8 decimals,         //精度
uint256 totalSupply,    //发行总量
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
//查询指定地址是否拥有铸币权
isMinter(address account) public view returns (bool)   
//给指定地址添加铸币权,只能通过有铸币权的地址添加
addMinter(address account) public onlyMinter          
//撤销当前发送账户的铸币权 
renounceMinter() public               
//铸币                 
mint(address account, uint256 amount) public onlyMinter returns (bool) 
//调用此方法可以从调用者账户中销毁代币
burn(uint256 amount) public 
//调用此方法可以从指定地址销毁代币,代币从发送者的批准中扣除
burnFrom(address account, uint256 amount) public 
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
//返回封顶数量
cap() public view returns (uint256)     
```
