pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IERC20.sol";


contract Pool is Ownable{

    address token;
    IERC20 rankToken;

    constructor(address _address) {
        token = _address;
        rankToken = IERC20(_address);
    }

    event Withdraw(uint256 amount, address to);

    function withdraw() public onlyOwner {
        uint256 balance = rankToken.balanceOf(address(this));
        rankToken.transfer(payable(address(this)), balance);

        emit Withdraw(balance, msg.sender);

    }
}