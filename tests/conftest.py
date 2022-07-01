from brownie import accounts, web3, Wei, chain
from brownie import Contract
import pytest

INITIAL_SUPPLY = 1_000_000 * (10 ** 6)
@pytest.fixture(scope="module", autouse=True)
def rank_token(RankToken):
    rank_token = RankToken.deploy(accounts[0],INITIAL_SUPPLY, {"from": accounts[0]})
    return rank_token



@pytest.fixture(scope="module", autouse=True)
def billboard(Billboard, rank_token):
    billboard = Billboard.deploy(rank_token, {"from": accounts[0]})
    rank_token.approve(billboard, INITIAL_SUPPLY, {"from": accounts[0]})
    billboard.setUpvoteCost(10, {"from": accounts[0]}) 
    billboard.setProposalCost(20, {"from": accounts[0]}) 
    return billboard