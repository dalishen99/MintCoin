pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/PausableCrowdsale.sol";

//可暂停的众筹
contract ERC20PausableCrowdsale is Crowdsale, AllowanceCrowdsale, PausableCrowdsale {
    constructor(
        uint256 rate,           // 兑换比例
        address payable wallet, // 接收ETH受益人地址
        IERC20 token,           // 代币地址
        address tokenWallet     // 代币从这个地址发送
    )
        AllowanceCrowdsale(tokenWallet)
        PausableCrowdsale()
        Crowdsale(rate, wallet, token)
        public
    {

    }
}
