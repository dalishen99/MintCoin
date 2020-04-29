pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/WhitelistCrowdsale.sol";

//白名单众筹
contract ERC20WhitelistCrowdsale is Crowdsale, AllowanceCrowdsale, WhitelistCrowdsale {
    constructor(
        uint256 rate,           // 兑换比例
        address payable wallet, // 接收ETH受益人地址
        IERC20 token,           // 代币地址
        address tokenWallet     // 代币从这个地址发送
    )
        AllowanceCrowdsale(tokenWallet)
        Crowdsale(rate, wallet, token)
        public
    {

    }
}
