pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/introspection/ERC1820Implementer.sol";
import "@openzeppelin/contracts/introspection/IERC1820Registry.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract TokensRecipient is ERC1820Implementer, IERC777Recipient, Ownable {

    bool private allowTokensReceived;
    using SafeMath for uint256;

    mapping(address => address) public token;
    mapping(address => address) public operator;
    mapping(address => address) public from;
    mapping(address => address) public to;
    mapping(address => uint256) public amount;
    mapping(address => bytes) public data;
    mapping(address => bytes) public operatorData;
    mapping(address => uint256) public balanceOf;

    IERC1820Registry constant internal ERC1820_REGISTRY = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);

    constructor(bool _setInterface) public {
        if (_setInterface) {     
            ERC1820_REGISTRY.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
        }
        _registerInterfaceForAddress(keccak256("ERC777TokensRecipient"),msg.sender);
        allowTokensReceived = true;
    }

    function tokensReceived(
        address _operator,
        address _from,
        address _to,
        uint256 _amount,
        bytes calldata _data,
        bytes calldata _operatorData
    )
        external
    {
        require(allowTokensReceived, "Receive not allowed");
        token[_from] = msg.sender;
        operator[_from] = _operator;
        from[_from] = _from;
        to[_from] = _to;
        amount[_from] = amount[_from].add(_amount);
        data[_from] = _data;
        operatorData[_from] = _operatorData;
        balanceOf[_from] = IERC777(msg.sender).balanceOf(_from);
        balanceOf[_to] = IERC777(msg.sender).balanceOf(_to);
    }

    function acceptTokens() public onlyOwner { allowTokensReceived = true; }

    function rejectTokens() public onlyOwner { allowTokensReceived = false; }
}
