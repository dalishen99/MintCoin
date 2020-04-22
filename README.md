# MintCoin崔棉大师的花式发币法

### 发行ERC20代币
- [固定总量代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20/ERC20FixedSupply.md)
- [可销毁代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20/ERC20WithBurnable.md)
- [可增发代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20/ERC20WithMintable.md)
- [有封顶代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20/ERC20WithCapped.md)
- [可暂停代币](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20/ERC20WithPausable.md)
### 发行锁仓代币
- [发行代币同时锁仓](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20/IssueTokenWithTimelock.md)
- [发行代币之后锁仓](https://github.com/Fankouzu/MintCoin/blob/master/README/ERC20/IssueTokenBeforeTimelock.md)
### 发行众筹代币
- [通用众筹合约](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/AllowanceCrowdsale.md)
- [铸造式众筹合约](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/MintedCrowdsale.md)
- [有封顶众筹合约](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/CappedCrowdsale.md)
- [有配额的众筹](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/IndividuallyCappedCrowdsale.md)
- [可暂停的众筹](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/PausableCrowdsale.md)
- [有时限的众筹](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/TimedCrowdsale.md)
- [白名单众筹](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/WhitelistCrowdsale.md)
- [可终结的众筹](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/FinalizableCrowdsale.md)
- [成功后交付的众筹](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/PostDeliveryCrowdsale.md)
- [不成功退款的众筹](https://github.com/Fankouzu/MintCoin/blob/master/README/Crowdsale/RefundableCrowdsale.md)
---
### 安装
```shell
$ npm install            //安装依赖包
```
### 布署到测试节点
```shell
$ npm run compile        //编译合约
$ npm run node           //打开一个测试节点
$ npm run test           //测试合约
$ npm run migrate        //布署合约到测试节点
```
### 布署合约到truffle
```shell
$ truffle develop           //打开truffle开发环境
truffle(develop)> compile   //编译合约
truffle(develop)> test      //测试合约
truffle(develop)> migrate   //布署合约
```
### 布署到主网 
- [链接](https://github.com/Fankouzu/smart-contract/tree/master/Solidity%20Lesson%2003) 
- [视频课](https://www.bilibili.com/video/BV1vJ41117ck/)
---


