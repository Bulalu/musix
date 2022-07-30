import pytest
from brownie import Contract, chain
from config import *

#ockedProfit() 
def test_vault_config(deployed):
    vault = deployed.vault
    strategy = deployed.strategy

    assert vault.name() == "Ranks USDC Stablecoin Vault"
    assert vault.symbol() == "rvUSDC"
    assert vault.feePercent() == FEE
    assert vault.harvestDelay() == HARVEST_DELAY
    assert vault.harvestWindow() == HARVEST_WINDOW
    assert vault.UNDERLYING() == USDC_AVAX
    assert vault.isInitialized() == True
    assert vault.totalFloat() == 0
    assert strategy.underlying() == vault.UNDERLYING()
    assert vault.getStrategyData(strategy)["trusted"] == True
    assert vault.getStrategyData(strategy)["balance"] == 0

def test_r_we_winning(deployed, whale, usdc):
   
    deployer = deployed.deployer
    vault = deployed.vault
    strategy = deployed.strategy
    
    # whale deposits into vault
    balance = usdc.balanceOf(whale)
    print(f"Whale USDC Balance: {balance/10**6}")

    amount_to_deposit_whale = balance * 0.6
    usdc.approve(vault, balance, {"from": whale})
    vault.deposit(amount_to_deposit_whale, whale, {"from": whale})
   
    # in USDC
    vault_holdings = vault.totalFloat()
    shares = vault.balanceOf(whale) #rvUSDC
    print(f"Whale Shares: {shares/10**6}")
    assert shares > 0
    assert shares == vault.previewDeposit(amount_to_deposit_whale)
    assert vault_holdings == amount_to_deposit_whale
    
    
    # vault deposits 90% USDC to strategy
    amount_to_deposit_vault = int(vault_holdings * 0.9)
    vault.depositIntoStrategy(strategy, amount_to_deposit_vault, {"from": deployer})
    new_vault_holdings = vault.totalFloat()
    # the amount of USDC that the strategy owes the vault
    strategy_debt = int(strategy.currentDebt())

    assert strategy_debt == amount_to_deposit_vault == int(vault.getStrategyData(strategy)["balance"])
    assert new_vault_holdings == vault_holdings - amount_to_deposit_vault
   
    balance_of_usdc_before_harvest = strategy.estimatedTotalAssets()
    
    # wingardium leviosa  🧪 ✨ 💸
    print("strategy at work ser!")
    strategy.actualTotalAssets({"from": deployer})

    chain.sleep(HARVEST_WINDOW + 10)
    chain.mine()
    strategy.actualTotalAssets({"from": deployer})
    
   
    balance_of_usdc_after_harvest = strategy.estimatedTotalAssets()
    assert balance_of_usdc_after_harvest > balance_of_usdc_before_harvest
    print(f"Profit: ${(balance_of_usdc_after_harvest - balance_of_usdc_before_harvest)/10**6}")



