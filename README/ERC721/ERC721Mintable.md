# MintCoin崔棉大师的花式发币法

## 可铸造ERC721代币
> ERC721代币属于非同质化代币，全功能的ERC721代币包含ERC721的元数据和可枚举功能.
> 可铸造的ERC721代币拥有一个公开的铸造方法,只有铸造管理员可以调用.

[合约文件: ERC721Mintable.sol](https://github.com/Fankouzu/MintCoin/blob/master/contracts/ERC721/ERC721Mintable.sol)

[测试脚本: ERC721Mintable.js](https://github.com/Fankouzu/MintCoin/blob/master/test/ERC721/ERC721Mintable.js)

[布署脚本: 22_deploy_ERC721Mintable.js](https://github.com/Fankouzu/MintCoin/blob/master/migrations/22_deploy_ERC721Mintable.js)

### 在布署合约时定义以下变量
```javascript
string memory name,     //代币名称
string memory symbol,   //代币缩写
string memory baseURI,   //代币基础链接
```
### 调用方法
```javascript
//返回代币名称
name() public view returns (string memory)
//返回代币缩写
symbol() public view returns (string memory)
//token的基础链接地址
baseURI() external view returns (string memory) 
//根据tokenid返回数据连接地址
tokenURI(uint256 tokenId) external view returns (string memory)
//返回指定账户拥有的代币数量
balanceOf(address owner) public view returns (uint256)
//根据tokenid返回拥有者
ownerOf(uint256 tokenId) public view returns (address)
//批准代币
approve(address to, uint256 tokenId) public
//获取令牌ID的批准地址；如果未设置地址或tokenID不存在，则返回零；。
getApproved(uint256 tokenId) public view returns (address)
//将拥有者的所有代币批准给指定地址
setApprovalForAll(address to, bool approved) public
//获取操作者是否将代币全部批准给指定地址
isApprovedForAll(address owner, address operator) public view returns (bool)
//发送批准
transferFrom(address from, address to, uint256 tokenId) public
//安全发送批准
safeTransferFrom(address from, address to, uint256 tokenId) public
//获取请求的所有者的令牌列表的给定索引处的令牌ID
tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)
//获取合约的代币总量
totalSupply() public view returns (uint256)
//通过索引获取代币
tokenByIndex(uint256 index) public view returns (uint256)
//铸币方法
mint(address to, uint256 tokenId) public onlyMinter returns (bool)
//安全铸币方法
safeMint(address to, uint256 tokenId) public onlyMinter returns (bool)
//带URI铸币方法
mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) public onlyMinter returns (bool)
//查询指定地址是否拥有铸币权
isMinter(address account) public view returns (bool)   
//给指定地址添加铸币权,只能通过有铸币权的地址添加
addMinter(address account) public onlyMinter          
//撤销当前发送账户的铸币权 
renounceMinter() public       
```
