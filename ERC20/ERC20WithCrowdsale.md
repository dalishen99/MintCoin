# MintCoin崔棉大师的花式发币法

## 众筹代币
> 众筹代币是指在代币发行后,任何一个地址都可以向众筹地址使用ETH购买代币.
> 代币和ETH的兑换比例在合约布署同时设定.
> 众筹代币可以有以下几种形式

### 0.固定总量代币和通用众筹合约
> 所有的众筹合约都要在一个ERC20代币布署成功后再布署众筹合约
```
./contract/ERC20FixedSupply.sol
```
> 布署合约时设定
```javascript
uint256 rate,               //兑换比例1ETH兑换多少ERC20代币
address payable wallet,     //接收ETH受益人地址
IERC20 token,               //代币地址
```
> 众筹合约的通用调用方法(省略了ERC20的调用方法)
```javascript
token() public view returns (IERC20)                        //返回代币地址
wallet() public view returns (address payable)              //返回受益人地址
rate() public view returns (uint256)                        //返回兑换比例
weiRaised() public view returns (uint256)                   //返回销售额
buyTokens(address beneficiary) public nonReentrant payable  //购买代币,代币发送给指定地址
```

### 1.普通的众筹
```
./contract/ERC20AllowanceCrowdsale.sol
```
> 布署合约时设定
```javascript
address tokenWallet         //代币从这个地址发送
```
> 调用方法
```javascript
tokenWallet() public view returns (address)                 //返回代币现存地址
remainingTokens() public view returns (uint256)             //检查配额中剩余的代币数量
```

### 2.铸造式众筹
> 代币发行时可以设置一个初始总量,也可以设置为0,
> 当代币以指定的兑换比例销售时才铸造代币,销售多少铸造多少.
```
./contract/ERC20MintedCrowdsale.sol
```
> 布署合约时设定
```javascript
token.addMinter(crowdsale.address);        //添加众筹合约的铸造权
token.renounceMinter();                    //撤销当前账户的铸造权
```
> 铸造式众筹的调用方法包含众筹合约的通用调用方法和[可增发代币](https://github.com/Fankouzu/MintCoin/tree/master/ERC20#4%E5%8F%AF%E5%A2%9E%E5%8F%91%E4%BB%A3%E5%B8%81)的调用方法


---

> 使用方法:
```shell
$ npm install            //安装依赖包
$ npm run compile        //编译合约
$ npm run node           //打开一个测试节点
$ npm run migrate        //布署合约到测试节点
$ npm run test           //测试合约
```
> 布署到truffle  
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
> 布署到主网方法: 
[链接](https://github.com/Fankouzu/smart-contract/tree/master/Solidity%20Lesson%2003) 
[视频课](https://www.bilibili.com/video/BV1vJ41117ck/)
