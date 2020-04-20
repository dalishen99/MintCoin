pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Capped.sol";


//有封顶代币
contract ERC20WithCapped is ERC20, ERC20Detailed, ERC20Mintable, ERC20Capped {
    constructor(
        string memory name, //代币名称
        string memory symbol, //代币缩写
        uint8 decimals, //精度
        uint256 initalSupply, //初始总量
        uint256 cap //封顶数量
    ) public ERC20Detailed(name, symbol, decimals) ERC20Capped(cap * (10**uint256(decimals))){
        _mint(msg.sender, initalSupply * (10**uint256(decimals)));
    }
}
