pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";

//可增发的众筹
contract ERC20MintedCrowdsale is Crowdsale, MintedCrowdsale {
    constructor(
        uint256 rate,           // 兑换比例
        address payable wallet, // 接收ETH受益人地址
        IERC20 token            // 代币地址
    )
        Crowdsale(rate, wallet, token)
        public
    {

    }
}
