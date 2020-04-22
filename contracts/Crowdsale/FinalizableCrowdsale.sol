pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/FinalizableCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/TimedCrowdsale.sol";


//可终结的众筹
contract ERC20FinalizableCrowdsale is
    Crowdsale,
    AllowanceCrowdsale,
    TimedCrowdsale,
    FinalizableCrowdsale
{
    constructor(
        uint256 rate, // 兑换比例
        address payable wallet, // 接收ETH受益人地址
        IERC20 token, // 代币地址
        address tokenWallet, // 代币从这个地址发送
        uint256 openingTime, // 众筹开始时间
        uint256 closingTime // 众筹结束时间
    )
        public
        AllowanceCrowdsale(tokenWallet)
        TimedCrowdsale(openingTime, closingTime)
        FinalizableCrowdsale()
        Crowdsale(rate, wallet, token)
    {}

    function _finalization() internal {
        // 写入众筹结束后的业务逻辑,当finalize()方法被调用时会执行这里
        super._finalization();
    }
}
