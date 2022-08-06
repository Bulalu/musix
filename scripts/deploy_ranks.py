from brownie import  network, config, accounts,Musix
from scripts.helpful_scripts import get_account, load_accounts
from scripts.deploy_rUSDC import rank_token
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
    proposal_cost = Web3.toWei(0.1, 'ether')
    upvote_cost = Web3.toWei(0.01, 'ether')
    amount = 1_000_000 * 10**18

    if len(Musix) > 0:
        return Musix[-1]
    else:
        print("Deploying Musix Contract Buidler")

        
        contract = Musix.deploy(token_contract, {"from": owner}, publish_source=True)

        # token_contract.approve(contract, amount, {"from":owner})
        #init fns
        # tx = contract.setProposalCost(proposal_cost, {"from": owner})
        # # print(tx.events)
        # contract.setUpvoteCost(upvote_cost, {"from": owner})
        return contract

# def propose_song():
#     owner = get_account()
#     # stewie = accounts[1]
#     # meg = accounts[2]
#     billboard_contract = billboard()
#     proposal_cost = Web3.toWei(0.1, 'ether')
#     print(owner.balance() > proposal_cost)

#     CID = 'QmNe9bWiE4dN4CsLDBHRKY4V74cvoVE4J9wftjGonZD1qx'
#     # take note of the token grant
#     # this only works because owner is the admin
#     billboard_contract.propose(CID, {"from": owner, "value": proposal_cost})
    
# def getter():
#     account = get_account(1)
#     billboard_contract = billboard()

#     print(account)


def main():
    # billboard()
    # propose_song()
    billboard()
    # print(Musix[-1])
    
    # getter()
    # Musix.deploy(accounts[1],{"from": accounts[0]})
   
   