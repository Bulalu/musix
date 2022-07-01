from brownie import Billboard, network, config, accounts
from scripts.helpful_scripts import get_account, load_accounts
from scripts.deploy_token import rank_token
from web3 import Web3

# testing accounts
alice = accounts.at("0xbEF1311D71e7271414922Bb9171Ca1DDc7BC4c3A", force=True)
bob = accounts.at("0xDc5724989bB493F76DEa44CE61BE6d9e37253cEc", force=True)

load_accounts()
def billboard():
    # account = get_account()
    owner = accounts[0]
    stewie = accounts[1]
    meg = accounts[2]

    token_contract = rank_token()
    proposal_cost = 20 #20 * 10
    upvote_cost = 10
    amount = 1_000_000 * 10**18

    if len(Billboard) > 0:
        return Billboard[-1]
    else:
        print("Deploying Billboard Contract Buidler")

        #publish_source=config["networks"][network.show_active()]["verify"]
        contract = Billboard.deploy(token_contract, {"from": owner})

        token_contract.approve(contract, amount, {"from":owner})
        #init fns
        tx = contract.setProposalCost(proposal_cost, {"from": owner})
        # print(tx.events)
        contract.setUpvoteCost(upvote_cost, {"from": owner})
        return contract

def propose_song():
    owner = accounts[0]
    stewie = accounts[1]
    meg = accounts[2]
    billboard_contract = billboard()
    
    CID = 'QmZSvz8s9pMEAMhzy1tzunU2xBP2g25de48y6buM8ssYZW'
    
    print("proposing a new song ser")
    print(f"Rank Token Balance before deposting{rank_token().balanceOf(stewie)}")
    billboard_contract.propose(CID, {"from": owner})
    print(meg.balance())
    print(f"Rank Token Balance after deposting{rank_token().balanceOf(stewie)}")

def getter():
    account = get_account(1)
    billboard_contract = billboard()

    # print(f"ProposolCost {billboard_contract.proposalCost()}")
    # print(f"Upvote Cost {billboard_contract.upvoteCost()}")
    # print(rank_token().allowance(account, billboard_contract))
    print(account)


def main():
    # billboard()
    propose_song()
    # getter()
    # load_accounts()
    # print(accounts[0].balance())
    # print(accounts[1].balance())
    # print(accounts[2].balance())
   