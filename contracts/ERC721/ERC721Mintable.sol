pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721MetadataMintable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
//可铸造的ERC721代币
contract ERC721MintableContract is ERC721Full, ERC721Mintable, ERC721MetadataMintable, ERC721Holder{
    constructor(
        string memory name, //代币名称
        string memory symbol,//代币缩写
        string memory baseURI//代币基本地址
    ) 
    ERC721Full(name, symbol) 
    public {
        _setBaseURI(baseURI);
    }
}