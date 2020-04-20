# MintCoin崔棉大师的花式发币法

## 众筹代币
> 使用方法:
```shell
$ npm install truffle -g //安装过请忽略
$ npm install            //安装依赖包
$ vim migrations/2_deploy_contracts.js  //编辑布署文件
$ truffle compile        //编译合约
```
```javascript
//可以将ERC20FixedSupply替换成自己想要布署的合约名称
const Migrations = artifacts.require("ERC20FixedSupply"); 

module.exports = function(deployer) {
    deployer.deploy(Migrations,
    //布署合约时需要提供构造函数的参数
    //注意参数的数量,封顶合约要多一个参数
    "My Golden Coin","MGC",18,1000000000);
};
```
```
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
---

### 1.固定总量代币
```
./contract/ERC20FixedSupply.sol
```
> 在布署合约时定义以下变量(以下合约均需要定义)
```javascript
string memory name,     //代币名称
string memory symbol,   //代币缩写
uint8 decimals ,        //精度
uint256 totalSupply     //发行总量
```
> 标准ERC20代币方法(以下合约均包含这些方法)
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
### 2.奖励矿工代币
```
./contract/ERC20WithMinerReward.sol
```
```javascript
// block.coinbase 为当前区块的矿工地址,将原来的msg.sender替换成它就可以实现奖励矿工
_mint(block.coinbase, totalSupply * (10 ** uint256(decimals)));
```

### 3.可销毁代币
```
./contract/ERC20WithBurnable.sol
```
```javascript
burn(uint256 amount) public //调用此方法可以从调用者账户中销毁代币
burnFrom(address account, uint256 amount) public //调用此方法可以从指定地址销毁代币,代币从发送者的批准中扣除
```

### 4.可增发代币
```
./contract/ERC20WithMintable.sol
```
```javascript
isMinter(address account) public view returns (bool)   //查询指定地址是否拥有铸币权
addMinter(address account) public onlyMinter           //给指定地址添加铸币权,只能通过有铸币权的地址添加
renounceMinter() public                                //撤销当前发送账户的铸币权
```

### 5.有封顶代币
```
./contract/ERC20WithCapped.sol
```
> 布署合约时构造函数增加
```javascript
uint256 cap             //封顶数量 
```
```
cap() public view returns (uint256)     //返回封顶数量
```

### 6.可暂停代币
```
./contract/ERC20WithPausable.sol
```
```javascript
isPauser(address account) public view returns (bool)      //返回指定地址是否拥有暂停权  
addPauser(address account) public onlyPauser              //给指定地址添加暂停权限,只有通过有暂停权的地址添加
renouncePauser() public                                   //撤销当前发送账户的暂停权
paused() public view returns (bool)                       //返回合约当前是否已经暂停
pause() public onlyPauser whenNotPaused                   //暂停合约
unpause() public onlyPauser whenPaused                    //恢复合约
```
