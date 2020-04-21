pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";

//有封顶的众筹
contract ERC20CappedCrowdsale is Crowdsale, AllowanceCrowdsale, CappedCrowdsale {
    constructor(
        uint256 rate,           // 兑换比例
        address payable wallet, // 接收ETH受益人地址
        IERC20 token,           // 代币地址
        address tokenWallet,    // 代币从这个地址发送
        uint256 cap             // 封顶数量,单位是wei
    )
        AllowanceCrowdsale(tokenWallet)
        CappedCrowdsale(cap)
        Crowdsale(rate, wallet, token)
        public
    {

    }
}