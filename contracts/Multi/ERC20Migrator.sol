pragma solidity ^0.5.0;
import "@openzeppelin/contracts/drafts/ERC20Migrator.sol";

//代币迁移合约
contract ERC20MigratorContract is ERC20Migrator {
    constructor(
        IERC20 legacyToken    //旧代币合约
    )
        ERC20Migrator(legacyToken)
        public
    {

    }
}
