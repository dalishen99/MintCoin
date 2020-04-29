pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/crowdsale/Crowdsale.sol";
import "@openzeppelin/contracts/crowdsale/distribution/RefundablePostDeliveryCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/PausableCrowdsale.sol";
import "@openzeppelin/contracts/crowdsale/validation/WhitelistCrowdsale.sol";

//多功能众筹合约:可增发,可销毁,有封顶,有配额,可暂停,有时限,白名单,成功后交付,不成功退款
contract MultiFunctionCrowdsaleERC20 is
    ERC20,
    ERC20Detailed,
    ERC20Mintable,
    ERC20Burnable
{
    constructor(
        string memory name, //代币名称
        string memory symbol, //代币缩写
        uint8 decimals, //精度
        uint256 totalSupply //发行总量
    ) public ERC20Detailed(name, symbol, decimals) {
        _mint(msg.sender, totalSupply * (10**uint256(decimals)));
    }
}


contract MultiFunctionCrowdsale is
    Crowdsale,
    CappedCrowdsale,
    IndividuallyCappedCrowdsale,
    MintedCrowdsale,
    PausableCrowdsale,
    RefundablePostDeliveryCrowdsale,
    WhitelistCrowdsale
{
    constructor(
        uint256 rate, // 兑换比例
        address payable wallet, // 接收ETH受益人地址
        IERC20 token, // 代币地址
        address tokenWallet, // 代币从这个地址发送
        uint256 openingTime, // 众筹开始时间
        uint256 closingTime, // 众筹结束时间
        uint256 goal, // 众筹目标
        uint256 cap             // 封顶数量,单位是wei
    )
        public
        CappedCrowdsale(cap)
        Crowdsale(rate, wallet, token)
        TimedCrowdsale(openingTime, closingTime)
        RefundableCrowdsale(goal)
        RefundablePostDeliveryCrowdsale()
    {}

    function _finalization() internal {
        // 写入众筹结束后的业务逻辑,当finalize()方法被调用时会执行这里
        super._finalization();
    }
}
