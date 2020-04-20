pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/token/ERC20/TokenTimelock.sol";


//锁仓合约
contract ERC20WithTokenTimelock is TokenTimelock {
    constructor(
        IERC20 token, //ERC20代币合约地址
        address beneficiary, //受益人
        uint256 releaseTime //解锁时间戳
    ) public TokenTimelock(token, beneficiary, releaseTime) {}
}
