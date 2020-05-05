const CrowdsalePaymentSplitter = artifacts.require("CrowdsalePaymentSplitter"); 
//股份制受益人合约
module.exports = (deployer,network,accounts) => {
    deployer.deploy(CrowdsalePaymentSplitter,
        [accounts[0],accounts[1],accounts[2],accounts[3]],  //股东账户
        ['10','20','30','40']                               //股份比例
    )
};