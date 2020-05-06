pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Sender.sol";


contract ERC777Contract is ERC777, IERC777Sender, IERC777Recipient {
    
    bytes32 constant internal ERC1820_ACCEPT_MAGIC = keccak256(abi.encodePacked("ERC1820_ACCEPT_MAGIC"));
    event DoneStuffTokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);
    event DoneStuffTokensReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);

    constructor(
        string memory name, //代币名称
        string memory symbol, //代币缩写
        uint256 initialSupply, //发行总量
        address[] memory defaultOperators //默认操作员
    ) public ERC777(name, symbol, defaultOperators) {
        _mint(msg.sender, msg.sender, initialSupply, "", "");
    }
    function tokensToSend(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external {
        emit DoneStuffTokensToSend(operator, from, to, amount, userData, operatorData);

    }
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external{
        // do stuff
        emit DoneStuffTokensReceived(operator, from, to, amount, userData, operatorData);
    }
}
