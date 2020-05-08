pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Sender.sol";
import "@openzeppelin/contracts/introspection/ERC1820Implementer.sol";
import "@openzeppelin/contracts/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract TokensSender is ERC1820Implementer, IERC777Sender, Ownable {
    bool private allowTokensToSend;
    using SafeMath for uint256;
    // keccak256("ERC777TokensSender")
    bytes32 private constant TOKENS_SENDER_INTERFACE_HASH = 0x29ddb589b1fb5fc7cf394961c1adf5f8c6454761adf795e67fe149f658abe895;

    mapping(address => address) public token;
    mapping(address => address) public operator;
    mapping(address => address) public from;
    mapping(address => address) public to;
    mapping(address => uint256) public amount;
    mapping(address => bytes) public data;
    mapping(address => bytes) public operatorData;
    mapping(address => uint256) public balanceOf;

    IERC1820Registry internal constant ERC1820_REGISTRY = IERC1820Registry(
        0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24
    );

    constructor(bool _setInterface) public {
        if (_setInterface) {
            ERC1820_REGISTRY.setInterfaceImplementer(
                address(this),
                TOKENS_SENDER_INTERFACE_HASH,
                address(this)
            );
        }
        _registerInterfaceForAddress(TOKENS_SENDER_INTERFACE_HASH, msg.sender);
        allowTokensToSend = true;
    }

    function tokensToSend(
        address _operator,
        address _from,
        address _to,
        uint256 _amount,
        bytes calldata _data,
        bytes calldata _operatorData
    ) external {
        require(allowTokensToSend, "Send not allowed");
        token[_to] = msg.sender;
        operator[_to] = _operator;
        from[_to] = _from;
        to[_to] = _to;
        amount[_to] = amount[_to].add(_amount);
        data[_to] = _data;
        operatorData[_to] = _operatorData;
        balanceOf[_from] = IERC777(msg.sender).balanceOf(_from);
        balanceOf[_to] = IERC777(msg.sender).balanceOf(_to);
    }

    function acceptTokensToSend() public onlyOwner {
        allowTokensToSend = true;
    }

    function rejectTokensToSend() public onlyOwner {
        allowTokensToSend = false;
    }
}
