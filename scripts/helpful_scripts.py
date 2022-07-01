from brownie import (
    accounts,
    network,
    config,
    RankToken
)


LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["hardhat", "development", "ganache"]
DECIMALS = 6
INITIAL_SUPPLY = 1_000_000 * (10 ** 6)





def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        return accounts[0]
    if id:
        return accounts.load(id)
    return accounts.add(config["wallets"]["from_key"])

def load_accounts():
    if network.show_active() == "rinkeby":
        accounts.add(config["wallets"]["from_key"])
        accounts.add(config["wallets"]["from_key"])
        accounts.add(config["wallets"]["from_key"])





