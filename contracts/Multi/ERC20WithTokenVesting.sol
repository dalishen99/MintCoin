pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/drafts/TokenVesting.sol";

//分期释放合约
contract ERC20WithTokenVesting is TokenVesting {
    constructor(
        address beneficiary,        //受益人
        uint256 start,              //开始时间
        uint256 cliffDuration,      //断崖时间
        uint256 duration,           //持续时间
        bool revocable              //是否可撤销
    ) public TokenVesting(beneficiary, start, cliffDuration, duration, revocable) {}
}
