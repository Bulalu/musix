
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0;
pragma experimental ABIEncoderV2;

import { IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC4626  {
    
    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);

   
    /*//////////////////////////////////////////////////////////////
                        DEPOSIT/WITHDRAWAL LOGIC
    //////////////////////////////////////////////////////////////*/

    function deposit(uint256 assets, address receiver) external  returns (uint256 shares);

 

 

    
}
