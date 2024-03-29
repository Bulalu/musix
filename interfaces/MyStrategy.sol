// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.10;

import {ERC20} from "../contracts/Solmate/tokens/ERC20.sol";

/// @notice Minimal interface for Vault compatible strategies.
/// @dev Designed for out of the box compatibility with Fuse cTokens.
/// @dev Like cTokens, strategies must be transferrable ERC20s.
abstract contract Strategy is ERC20 {
    /// @notice Returns whether the strategy accepts ETH or an ERC20.
    /// @return True if the strategy accepts ETH, false otherwise.
    /// @dev Only present in Fuse cTokens, not Compound cTokens.
    function isCEther() external view virtual returns (bool);

    /// @notice Withdraws a specific amount of underlying tokens from the strategy.
    /// @param _amountNeeded The amount of underlying tokens to withdraw.
   
    // function redeemUnderlying(uint256 amount) external virtual returns (uint256);
    function withdraw(uint256 _amountNeeded) external virtual returns (uint256 err, uint256 amountFreed);
    /// @notice Returns a user's strategy balance in underlying tokens.
    /// @param user The user to get the underlying balance of.
    /// @return The user's strategy balance in underlying tokens.
    /// @dev May mutate the state of the strategy by accruing interest.
    function balanceOfUnderlying(address user) external virtual returns (uint256);

    /// @notice Returns the Vault this Strategy is assigned to
    function vault() external virtual view returns (address);

    /// @notice returns the current liquid value of the Strategy
    /// @dev This call relys on outside contracts and has the potential to be manipulated
    /// @return The value in Underlying the strategy currently holds
    function estimatedTotalAssets() external virtual view returns (uint256);

    /// @notice This is called to get an accurate non-manipulatable amount the strategy holds
    /// Used by the vault to get an accurate account during the harvest
    /// @dev may change the state pending on the current strategy being deployed
    /// @return The actual amount of assets the strategy hold in underlying
    function actualTotalAssets() external virtual returns(uint256);
}

/// @notice Minimal interface for Vault strategies that accept ERC20s.
/// @dev Designed for out of the box compatibility with Fuse cERC20s.
abstract contract ERC20Strategy is Strategy {
    /// @notice Returns the underlying ERC20 token the strategy accepts.
    /// @return The underlying ERC20 token the strategy accepts.
    function underlying() external view virtual returns (ERC20);

    /// @notice Deposit a specific amount of underlying tokens into the strategy.
    /// @param amount The amount of underlying tokens to deposit.
    /// @return An error code, or 0 if the deposit was successful.
    // function mint(uint256 amount) external virtual returns (uint256);
    function deposit(uint256 amount) external virtual returns (uint256);
}

/// @notice Minimal interface for Vault strategies that accept ETH.
/// @dev Designed for out of the box compatibility with Fuse cEther.
abstract contract ETHStrategy is Strategy {
    /// @notice Deposit a specific amount of ETH into the strategy.
    /// @dev The amount of ETH is specified via msg.value. Reverts on error.
    function mint() external payable virtual;
}