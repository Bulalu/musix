from brownie import RankToken, config, network, accounts
from scripts.helpful_scripts import get_account, INITIAL_SUPPLY, load_accounts


load_accounts()
def rank_token():
    account = get_account()

    if len(RankToken) > 0:
        return RankToken[-1]
    else:
        print("Deploying new RankToken contract")
        
        contract = RankToken.deploy(account, INITIAL_SUPPLY, {"from": account},publish_source=config["networks"][network.show_active()]["verify"])
        return contract

def main():
    rank_token()

