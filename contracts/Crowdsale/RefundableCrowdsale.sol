pragma solidity ^0.5.0;

import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/RefundablePostDeliveryCrowdsale.sol";


//不成功退款的众筹
contract RefundableCrowdsaleContract is
    Crowdsale,
    AllowanceCrowdsale,
    RefundablePostDeliveryCrowdsale
{
    constructor(
        uint256 rate, // 兑换比例
        address payable wallet, // 接收ETH受益人地址
        IERC20 token, // 代币地址
        address tokenWallet, // 代币从这个地址发送
        uint256 openingTime, // 众筹开始时间
        uint256 closingTime, // 众筹结束时间
        uint256 goal // 众筹目标
    )
        public
        Crowdsale(rate, wallet, token)
        AllowanceCrowdsale(tokenWallet)
        TimedCrowdsale(openingTime, closingTime)
        RefundableCrowdsale(goal)
        RefundablePostDeliveryCrowdsale()
    {}

    function _finalization() internal {
        // 写入众筹结束后的业务逻辑,当finalize()方法被调用时会执行这里
        super._finalization();
    }
}
