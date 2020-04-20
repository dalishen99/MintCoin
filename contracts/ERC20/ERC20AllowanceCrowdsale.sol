pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";

//普通的众筹
contract ERC20AllowanceCrowdsale is Crowdsale, AllowanceCrowdsale {
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
