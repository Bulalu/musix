from brownie import accounts, web3, Wei, chain, interface, Vault, accounts, Vectorfied
from config import *

def main():
    deployer = accounts[0]
    vault = Vault.deploy("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", {"from": deployer})
    print(vault)
   

# >>> whale = accounts.at("0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245", force=True) 
# >>> vault = Vault.deploy("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", {"from":whale})