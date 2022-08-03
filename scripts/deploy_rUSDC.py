from brownie import MockUSDC, config, network, accounts
from scripts.helpful_scripts import get_account, INITIAL_SUPPLY, load_accounts


def rank_token():
    account = get_account()

    if len(MockUSDC) > 0:
        return MockUSDC[-1]
    else:
        print("Deploying new MockUSDC contract")
        
        contract = MockUSDC.deploy(account, INITIAL_SUPPLY, {"from": account},publish_source=config["networks"][network.show_active()]["verify"])
        return contract

def main():
    rank_token()
