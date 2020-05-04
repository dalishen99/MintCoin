pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";

//有配额的众筹
contract IndividuallyCappedCrowdsaleContract is Crowdsale, AllowanceCrowdsale, IndividuallyCappedCrowdsale {
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
