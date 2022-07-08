from brownie import Billboard, network, config, accounts
from scripts.helpful_scripts import get_account, load_accounts
from scripts.deploy_token import rank_token
from web3 import Web3

# testing accounts
# alice = accounts.at("0xbEF1311D71e7271414922Bb9171Ca1DDc7BC4c3A", force=True)
# bob = accounts.at("0xDc5724989bB493F76DEa44CE61BE6d9e37253cEc", force=True)

# load_accounts()

def billboard():
    owner = get_account()
    # owner = accounts[0]
    # stewie = accounts[1]
    # meg = accounts[2]

    token_contract = rank_token()
    proposal_cost = 20 #20 * 10
    upvote_cost = 10
    amount = 1_000_000 * 10**18

    if len(Billboard) > 0:
        return Billboard[-1]
    else:
        print("Deploying Billboard Contract Buidler")

        
        contract = Billboard.deploy(token_contract, {"from": owner}, publish_source=config["networks"][network.show_active()]["verify"])

        token_contract.approve(contract, amount, {"from":owner})
        #init fns
        tx = contract.setProposalCost(proposal_cost, {"from": owner})
        # print(tx.events)
        contract.setUpvoteCost(upvote_cost, {"from": owner})
        return contract

def propose_song():
    owner = get_account()
    # stewie = accounts[1]
    # meg = accounts[2]
    billboard_contract = billboard()

    CID = 'QmZSvz8s9pMEAMhzy1tzunU2xBP2g25de48y6buM8ssYZW'
    # take note of the token grant
    # this only works because owner is the admin
    billboard_contract.propose(CID, owner, {"from": owner})
    
def getter():
    account = get_account(1)
    billboard_contract = billboard()

    print(account)


def main():
    # billboard()
    propose_song()
    # getter()
   
   