from brownie import accounts, Musix
import pytest
import brownie
from scripts.deploy_token import rank_token
import conftest
from scripts.helpful_scripts import DECIMALS


@pytest.fixture(autouse=True)
def isolation(fn_isolation):
    pass



def test_set_proposal_cost(rank_token, musix):
    owner = accounts[0]
    stewie = accounts[1]
    amount = 20
    

    with brownie.reverts("Ownable: caller is not the owner"):
        musix.setProposalCost(amount, {"from": stewie})

    musix.setProposalCost(amount, {"from": owner}) 

    assert  musix.proposalCost() == amount * 10 ** DECIMALS
    
def test_set_upvote_cost(musix):
    owner = accounts[0]
    stewie = accounts[1]
    amount = 20

    with brownie.reverts("Ownable: caller is not the owner"):
        musix.setUpvoteCost(amount, {"from": stewie})

    musix.setUpvoteCost(amount, {"from": owner}) 

    assert  musix.upvoteCost() == amount * 10 ** DECIMALS

def test_set_proposal(musix, rank_token):
    owner = accounts[0]
    stewie = accounts[1]
    meg = accounts[2]
    token_grant = 100 * 10 ** DECIMALS
    cid_1 = "QmZSvz8s9pMEAMhzy1tzunU2xBP2g25de48y6buM8ssYZW" 
    cid_2 = "QmZSvz8s9pMEAMhzy1tzunU2xBP2g25de48y6buM8ssWZA"

    rank_balance_before = rank_token.balanceOf(stewie)
    rank_token.transfer(stewie, token_grant, {"from": owner})
    assert rank_token.balanceOf(stewie) == token_grant

    rank_token.approve(musix, musix.proposalCost(), {"from": stewie})
    tx = musix.propose(cid_1, {"from": stewie})

    assert "SongProposed" in tx.events
    assert rank_token.balanceOf(stewie) == token_grant - musix.proposalCost()

    with brownie.reverts("already proposed"):
        musix.propose(cid_1, {"from": stewie})

    rank_token.transfer(owner, rank_token.balanceOf(stewie), {"from":stewie})

    with brownie.reverts("sorry bro, not enough tokens to propose"):
        musix.propose(cid_2, {"from": stewie})




    
    
