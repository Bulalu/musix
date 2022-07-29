import pytest
from brownie import Contract


@pytest.fixture
def usdc():
    yield Contract.from_explorer('0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E')

@pytest.fixture
def pool():
    yield Contract.from_explorer("0x1338b4065e25AD681c511644Aa319181FC3d64CC")

@pytest.fixture
def whale(accounts):
    yield accounts.at("0x52A258ED593C793251a89bfd36caE158EE9fC4F8", force=True)


def test_avax_shit(deployed):
   
    vault = deployed.vault
    strategy = deployed.strategy
    print("Vault:", vault)
    print("Strategy:", strategy)



# >>> whale = accounts.at("0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245", force=True) 
# >>>vault = Vault.deploy("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", {"from":whale}) 
# brownie networks add Ethereum ganache-local host=http://127.0.0.1:7545 chainid=5777
