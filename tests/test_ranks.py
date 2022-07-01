from brownie import accounts, Billboard
import pytest
import brownie
from scripts.deploy_token import rank_token
import conftest
from scripts.helpful_scripts import DECIMALS


@pytest.fixture(autouse=True)
def isolation(fn_isolation):
    pass


# def billboard():
#     account = accounts[0]
#     token = rank_token()
#     return Billboard.deploy(token, {"from": account})

def test_set_proposal_cost(billboard):
    owner = accounts[0]
    stewie = accounts[1]
    amount = 20

    with brownie.reverts("Ownable: caller is not the owner"):
        billboard.setProposalCost(amount, {"from": stewie})

    billboard.setProposalCost(amount, {"from": owner}) 

    assert  billboard.proposalCost() == amount * 10 ** DECIMALS
    
def test_set_upvote_cost(billboard):
    owner = accounts[0]
    stewie = accounts[1]
    amount = 20

    with brownie.reverts("Ownable: caller is not the owner"):
        billboard.setUpvoteCost(amount, {"from": stewie})

    billboard.setUpvoteCost(amount, {"from": owner}) 

    assert  billboard.upvoteCost() == amount * 10 ** DECIMALS

def test_set_proposal(billboard, rank_token):
    owner = accounts[0]
    stewie = accounts[1]
    meg = accounts[2]
    token_grant = 100 * 10 ** DECIMALS
    cid_1 = "QmZSvz8s9pMEAMhzy1tzunU2xBP2g25de48y6buM8ssYZW" 
    cid_2 = "QmZSvz8s9pMEAMhzy1tzunU2xBP2g25de48y6buM8ssWZA"

    rank_balance_before = rank_token.balanceOf(stewie)
    billboard.tokenGrant({"from": stewie})
    assert rank_token.balanceOf(stewie) == token_grant

    rank_token.approve(billboard, billboard.proposalCost(), {"from": stewie})
    tx = billboard.propose(cid_1, {"from": stewie})
    
    assert "SongProposed" in tx.events
    assert rank_token.balanceOf(stewie) == token_grant - billboard.proposalCost()

    
