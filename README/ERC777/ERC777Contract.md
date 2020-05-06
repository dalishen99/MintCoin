# MintCoin崔棉大师的花式发币法

## ERC777代币

### 介绍
ERC777像ERC20一样，ERC777是可替代令牌的标准，并且专注于在交易令牌时允许更复杂的交互。该标准还带来了多种改进，例如消除了容易引起歧义的decimals，其杀手级功能是发送和接收的钩子。钩子方法是合约中的一个功能，当向其发送和接收代币时会被调用，这意味着账户和合约可以对发送和接收代币做出反应。
### 文件
[合约文件: ERC777Contract.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC777/ERC777Contract.sol)

[发送接口合约: TokensSender.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC777/TokensSender.sol)

[接收接口合约: TokensRecipient.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC777/TokensRecipient.sol)

[测试脚本: ERC777Contract.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC777/ERC777Contract.js)

[布署脚本: 29_deploy_ERC777Contract.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/29_deploy_ERC777Contract.js)
### 布署
#### ERC777合约
在布署合约时定义以下变量
```javascript
string memory name, //代币名称
string memory symbol, //代币缩写
uint256 initialSupply, //发行总量
address[] memory defaultOperators //默认操作员数组
```
#### 发送接口合约
在调用ERC777合约的发送方法(transfer,send,burn,operatorSend,operatorBurn)时,合约都会到ERC1820注册表查询发送者的发送接口地址,如果发送者注册了发送接口合约地址,发送接口合约中的tokensToSend()方法就会被调用.以下就是发送接口合约的布署和注册方法.
在布署合约时定义以下变量
```javascript
bool _setInterface //是否为合约自身注册接口
```
在布署合约之后注册接口
```javascript
await ERC1820Registry.setInterfaceImplementer(
    senderAddress,//发送代币的账户地址
    web3.utils.keccak256("ERC777TokensSender"),//ERC777TokensSender接口的keccak256哈希值
    TokensSender.address,//发送接口合约的地址
);
```
#### 接收接口合约
在调用ERC777合约的发送方法(transfer,send,burn,operatorSend,operatorBurn)时,合约都会到ERC1820注册表查询接收者的接收接口地址,如果接收者注册了接收接口合约地址,接收接口合约中的tokensReceived()方法就会被调用.以下就是接收接口合约的布署和注册方法.
在布署合约时定义以下变量
```javascript
bool _setInterface //是否为合约自身注册接口
```
在布署合约之后注册接口
```javascript
await ERC1820Registry.setInterfaceImplementer(
    receiverAddress,//发送代币的账户地址
    web3.utils.keccak256("ERC777TokensRecipient"),//ERC777TokensRecipient接口的keccak256哈希值
    TokensRecipient.address,//接收接口合约的地址
);
```
### ERC777调用方法
#### 兼容ERC20的方法

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
//调用此方法可以从调用者账户中销毁代币
burn(uint256 amount) public 
```
#### ERC777新增方法
```javascript
//返回代币的最小单位
granularity() public view returns (uint256)
//代替transfer的发送方法
send(address recipient, uint256 amount, bytes memory data) public
//验证指定地址的操作员地址
isOperatorFor(address operator,address tokenHolder) public view returns (bool)
//为当前账户设置操作员
authorizeOperator(address operator) public
//为当前账户撤销操作员
revokeOperator(address operator) public
//返回默认操作员数组
defaultOperators() public view returns (address[] memory)
//操作员发送方法
operatorSend(address sender,address recipient,uint256 amount,bytes memory data,bytes memory operatorData)
//操作员销毁方法
operatorBurn(address account, uint256 amount, bytes memory data, bytes memory operatorData) public
```
#### 发送接口合约
```javascript
//ERC777代币发送时通过ERC1820注册表查找到发送接口合约之后,调用这个接口
tokensToSend(address _operator,address _from,address _to,uint _amount,bytes calldata _data,bytes calldata _operatorData)external
//接受代币发送方法
acceptTokensToSend() public onlyOwner 
//拒绝代币发送方法
rejectTokensToSend() public onlyOwner
```
#### 接收接口合约
```javascript
//ERC777代币发送时通过ERC1820注册表查找到接收接口合约之后,调用这个接口
tokensReceived(address _operator,address _from,address _to,uint _amount,bytes calldata _data,bytes calldata _operatorData)external
//接受接收代币方法
acceptTokens() public onlyOwner 
//拒绝接收代币方法
rejectTokens() public onlyOwner
```