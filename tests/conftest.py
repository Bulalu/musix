
from brownie import accounts, web3, Wei, chain, interface, Vault, accounts, Vectorfied
from config import *
from dotmap import DotMap
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


@pytest.fixture()
def deployed():
    """
    Deploys vault and strategy
    """

    deployer = accounts[0]
    name = "Ranks USDC Stablecoin Vault"
    symbol = "rvUSDC"
    vault = Vault.deploy(USDC_AVAX, name, symbol, {"from": deployer})
    # initialize shit
    vault.setFeePercent(FEE, {"from": deployer})
    vault.setHarvestDelay(HARVEST_DELAY, {"from": deployer})
    vault.setHarvestWindow(HARVEST_WINDOW, {"from": deployer})
    
    vault.initialize({"from": deployer})


    # Strategy
    strategy = Vectorfied.deploy(vault, POOL, ROUTER, {"from": deployer})

    # tokens
    usdc = interface.IERC20(USDC_AVAX)
    ptp = interface.IERC20(PTP)
    vtx = interface.IERC20(VTX)

    return DotMap (
        deployer=deployer,
        vault=vault,
        strategy=strategy,
        usdc=usdc,
        ptp=ptp,
        vtx=vtx,

    )