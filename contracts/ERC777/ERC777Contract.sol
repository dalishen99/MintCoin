pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract ERC777Contract is ERC777{
    constructor(
        string memory name, //代币名称
        string memory symbol, //代币缩写
        uint256 initialSupply, //发行总量
        address[] memory defaultOperators //默认操作员数组
    ) public ERC777(name, symbol, defaultOperators) {
        _mint(msg.sender, msg.sender, initialSupply, "", "");
    }
}
