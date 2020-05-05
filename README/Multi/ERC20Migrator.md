# MintCoin崔棉大师的花式发币法

## 代币迁移合约
> 代币迁移合约是指在一个ERC20合约布署好之后,因为某种原因,需要放弃原有合约.每个ERC20代币持有者都必须选择参加迁移。要选择加入，用户必须为此合同批准他们要迁移的ERC20代币数量。设置批准后，任何人都可以触发向新代币合同的迁移。这样，代币持有者“上交”他们的旧余额，并将在新ERC20代币中铸造等量的ERC20代币。新的ERC20代币合约必须是可铸造的。旧ERC20代币的余额将遗留在迁移合约中,并永远的遗留在这里.


[合约文件: ERC20Migrator.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/Multi/ERC20Migrator.sol)

[测试脚本: ERC20Migrator.js](https://github.com/Fankouzu/MintCoin/blob/master/test/Multi/ERC20Migrator.js)

[布署脚本: 25_deploy_ERC20Migrator.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/25_deploy_ERC20Migrator.js)

### 在布署合约时定义以下变量
```javascript
IERC20 legacyToken,    //旧ERC20合约地址
```
### 布署合约之后执行
```javascript
//在布署之后所有旧合约的用户必须将账户中的代币批准给迁移合约
token.approve(migrator.address, ALL_TOKEN_AMOUNT);
//给新代币添加迁移合约的铸造权
newTokentoken.addMinter(migrator.address);        
//撤销当前账户的铸造权
newTokentoken.renounceMinter(); 
//设置新代币合约地址并开始迁移
migrator.beginMigration(newToken.address);
```
### 调用方法
```javascript
//返回旧合约地址
legacyToken() public view returns (IERC20) 
//返回新合约地址
newToken() public view returns (IERC20)
//设置新代币合约地址并开始迁移
beginMigration(ERC20Mintable newToken_) public
//迁移指定账户的指定数量代币到新合约
migrate(address account, uint256 amount) public
//迁移指定账户的所有代币到新合约
migrateAll(address account) public
```
