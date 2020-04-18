# MintCoin崔棉大师的花式发币法

## 发行可锁仓的ERC20代币
> 发行可锁仓的ERC20代币需要同时布署两个合约文件,其原理是首先将一个ERC20代币合约布署好之后,再将代币合约的地址作为参数传递给第二个锁仓的合约.
> 在锁仓合约布署好之后还需要调用ERC20代币合约的tracsfer方法将所有代币从发送者账户传递到锁仓合约的账户中.
### 1.固定总量代币
```
./contract/ERC20FixedSupply.sol
```
### 2.锁仓合约文件
```
./contract/ERC20WithTokenTimelock.sol
```
### 3.布署脚本
```
./migrations/2_deploy_contracts.js
```

> 使用方法:
```shell
//安装Truffle,安装过请忽略
$ npm install truffle -g 
//安装依赖包
$ npm install          
//编译合约  
$ truffle compile     
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
