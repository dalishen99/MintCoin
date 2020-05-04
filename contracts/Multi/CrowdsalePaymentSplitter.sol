pragma solidity ^0.5.0;
import "@openzeppelin/contracts/payment/PaymentSplitter.sol";

//股份制受益人合约
contract CrowdsalePaymentSplitter is PaymentSplitter {
    constructor(
        address[] memory payees,    //受益人数组
        uint256[] memory shares     //受益人股份比例
    )
        PaymentSplitter(payees,shares)
        public payable
    {

    }
}
