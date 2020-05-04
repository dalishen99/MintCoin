pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";


//多功能ERC20代币,可增发,可销毁,可暂停,有封顶
contract ERC20MultiFunction is
    ERC20,
    ERC20Detailed,
    ERC20Burnable,
    ERC20Capped,
    ERC20Pausable
{
    constructor(
        string memory name, //代币名称
        string memory symbol, //代币缩写
        uint8 decimals, //精度
        uint256 totalSupply, //发行总量
        uint256 cap //封顶数量
    ) public ERC20Detailed(name, symbol, decimals) ERC20Capped(cap * (10**uint256(decimals))){
        _mint(msg.sender, totalSupply * (10**uint256(decimals)));
    }
}
