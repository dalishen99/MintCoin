# MintCoin崔棉大师的花式发币法

### 发行ERC20代币
- [固定总量代币](./README/ERC20/ERC20FixedSupply.md)
- [可销毁代币](./README/ERC20/ERC20WithBurnable.md)
- [可增发代币](./README/ERC20/ERC20WithMintable.md)
- [有封顶代币](./README/ERC20/ERC20WithCapped.md)
- [可暂停代币](./README/ERC20/ERC20WithPausable.md)
### 锁仓合约
- [发行代币同时锁仓](./README/ERC20/IssueTokenWithTimelock.md)
- [发行代币之后锁仓](./README/ERC20/IssueTokenBeforeTimelock.md)
### 发行众筹代币
- [通用的众筹](./README/Crowdsale/AllowanceCrowdsale.md)
- [可增发的众筹](./README/Crowdsale/MintedCrowdsale.md)
- [有封顶的众筹](./README/Crowdsale/CappedCrowdsale.md)
- [有配额的众筹](./README/Crowdsale/IndividuallyCappedCrowdsale.md)
- [可暂停的众筹](./README/Crowdsale/PausableCrowdsale.md)
- [有时限的众筹](./README/Crowdsale/TimedCrowdsale.md)
- [白名单众筹](./README/Crowdsale/WhitelistCrowdsale.md)
- [可终结的众筹](./README/Crowdsale/FinalizableCrowdsale.md)
- [到期后交付的众筹](./README/Crowdsale/PostDeliveryCrowdsale.md)
- [不成功退款的众筹](./README/Crowdsale/RefundableCrowdsale.md)

### 多功能代币
- [多功能ERC20代币,可增发,可销毁,可暂停,有封顶](./README/Multi/ERC20MultiFunction.md)
- [多功能众筹合约:可增发,可销毁,有封顶,有配额,可暂停,有时限,白名单,成功后交付,不成功退款](./README/Multi/MultiFunctionCrowdsale.md)
- [代币迁移合约](./README/Multi/ERC20Migrator.md)
- [可快照的ERC20代币](./README/Multi/ERC20WithSnapshot.md)
- [股份制受益人合约](./README/Multi/CrowdsalePaymentSplitter.md)
- [分期释放合约](./README/Multi/ERC20WithTokenVesting.md)

### 发行ERC721代币
- [全功能ERC721代币](./README/ERC721/ERC721Full.md)
- [可销毁的ERC721代币](./README/Crowdsale/ERC721Burnable.md)
- [可铸造ERC721代币](./README/Crowdsale/ERC721Mintable.md)
- [可暂停的ERC721代币](./README/Crowdsale/ERC721Pausable.md)

### 发行ERC777代币
- [ERC777代币](./README/ERC777/ERC777Contract.md)
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


