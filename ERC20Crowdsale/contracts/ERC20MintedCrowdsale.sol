pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";


//可增发代币
contract ERC20WithMintable is ERC20, ERC20Detailed, ERC20Mintable{
    constructor(
        string memory name, //代币名称
        string memory symbol, //代币缩写
        uint8 decimals, //精度
        uint256 totalSupply //发行总量
    ) public ERC20Detailed(name, symbol, decimals) {
        _mint(msg.sender, totalSupply * (10**uint256(decimals)));
    }
}

contract ERC20MintedCrowdsale is Crowdsale, MintedCrowdsale {
    constructor(
        uint256 rate,           // 兑换比例1ETH:100ERC20
        address payable wallet, // 接收ETH受益人地址
        IERC20 token            // 代币地址
    )
        MintedCrowdsale()
        Crowdsale(rate, wallet, token)
        public
    {

    }
}
