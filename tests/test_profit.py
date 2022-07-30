import pytest
from brownie import Contract
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

def test_avax_shit(deployed, whale, usdc):
   
    vault = deployed.vault
    strategy = deployed.strategy
    deployer = deployed.deployer
   

    # whale deposits into vault
    balance = usdc.balanceOf(whale)
    print(f"Whale USDC Balance: {balance}")

    amount_to_deposit_whale = balance * 0.6
    usdc.approve(vault, balance, {"from": whale})
    vault.deposit(amount_to_deposit_whale, whale, {"from": whale})
   
    # in USDC
    vault_holdings = vault.totalFloat()
    shares = vault.balanceOf(whale) #rvUSDC
    print(f"Whale Shares: {shares}")
    assert shares > 0
    assert shares == vault.previewDeposit(amount_to_deposit_whale)
    assert vault_holdings == amount_to_deposit_whale
    
    

    # vault deposits 90% USDC to strategy
    amount_to_deposit_vault = vault_holdings * 0.9
    vault.depositIntoStrategy(strategy, amount_to_deposit_vault, {"from": deployer})
    new_vault_holdings = vault.totalFloat()
    assert strategy.currentDebt() == amount_to_deposit_vault == vault.getStrategyData(strategy)["balance"]
    assert new_vault_holdings == vault_holdings - amount_to_deposit_vault
    # vault.approve(strategy, amount_to_deposit_vault, {"from": vault})




# >>> whale = accounts.at("0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245", force=True) 
# >>>vault = Vault.deploy("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", {"from":whale}) 
# brownie networks add Ethereum ganache-local host=http://127.0.0.1:7545 chainid=5777
