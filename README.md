# MintCoin崔棉大师的花式发币法

## 合约文件
### ERC20合约
- [固定总量代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20FixedSupply.md)
- [可销毁代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20WithBurnable.md)
- [可增发代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20WithMintable.md)
- [有封顶代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20WithCapped.md)
- [可暂停代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20WithPausable.md)
### 锁仓合约
- [发行代币同时锁仓](https://github.com/Fankouzu/MintCoin/blob/master/README/IssueTokenWithTimelock.md)
- [发行代币之后锁仓](https://github.com/Fankouzu/MintCoin/blob/master/README/IssueTokenBeforeTimelock.md)
### 众筹合约
- [通用众筹合约](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20AllowanceCrowdsale.md)
- [铸造式众筹合约](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20MintedCrowdsale.md)

## 使用方法:
### 安装
```shell
$ npm install            //安装依赖包
$ npm run compile        //编译合约
$ npm run node           //打开一个测试节点
$ npm run test           //测试合约
$ npm run migrate        //布署合约到测试节点
```
### 布署合约到truffle
```
$ truffle develop           //打开truffle开发环境
truffle(develop)> compile   //编译合约
truffle(develop)> test      //测试合约
truffle(develop)> migrate   //布署合约
```
### 布署到主网方法: 
- [链接](https://github.com/Fankouzu/smart-contract/tree/master/Solidity%20Lesson%2003) 
- [视频课](https://www.bilibili.com/video/BV1vJ41117ck/)
---


