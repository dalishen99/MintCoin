pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/TimedCrowdsale.sol";

//有时限的众筹
contract TimedCrowdsaleContract is Crowdsale, AllowanceCrowdsale, TimedCrowdsale {
    constructor(
        uint256 rate,           // 兑换比例
        address payable wallet, // 接收ETH受益人地址
        IERC20 token,           // 代币地址
        address tokenWallet,    // 代币从这个地址发送
        uint256 openingTime,    // 众筹开始时间
        uint256 closingTime     // 众筹结束时间
    )
        AllowanceCrowdsale(tokenWallet)
        TimedCrowdsale(openingTime, closingTime)
        Crowdsale(rate, wallet, token)
        public
    {

    }
}
