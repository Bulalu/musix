// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MockUSDC is ERC20{

    // allow testers to mint only once
    mapping(address => bool) public testers;
    // max amount users can mint
    uint256 public maxAmount = 100 * 10 ** 18;

     constructor( address owner, uint256 initialSupply) ERC20("RANKS USDC", "rUSDC") {
        
        
        _mint(owner, initialSupply);
    }

    

    function mint( uint256 amount) public  {
        // require(hasRole(MINTER_ROLE, _msgSender()), "ERC20PresetMinterPauser: must have minter role to mint");
        require(testers[msg.sender] == false && amount <= maxAmount, "ERC20PresetMinterPauser: cannot mint more than max amount");
        testers[msg.sender] = true;
        _mint(msg.sender, amount);
    }
}