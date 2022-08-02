
from brownie import accounts, web3, Wei, chain, Contract, interface, Vault, accounts, Vectorfied
from config import *
from dotmap import DotMap
import pytest

INITIAL_SUPPLY = 1_000_000 * (10 ** 18)
@pytest.fixture(scope="module", autouse=True)
def rank_token(RankToken):
    rank_token = RankToken.deploy(accounts[0],INITIAL_SUPPLY, {"from": accounts[0]})
    return rank_token


@pytest.fixture()
def musix(Musix, rank_token):

    musix = Musix.deploy( rank_token, {"from": accounts[0]})
    rank_token.approve(musix, INITIAL_SUPPLY * 0.5, {"from": accounts[0]})
    # musix.setUpvoteCost(10, {"from": accounts[0]}) 
    # musix.setProposalCost(20, {"from": accounts[0]}) 
    return musix


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

    vault.trustStrategy(strategy, {"from": deployer})

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


@pytest.fixture
def usdc():
    yield Contract.from_explorer('0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E')

# @pytest.fixture
# def pool():
#     yield Contract.from_explorer("0x1338b4065e25AD681c511644Aa319181FC3d64CC")

@pytest.fixture
def whale(accounts):
    yield accounts.at("0xBF14DB80D9275FB721383a77C00Ae180fc40ae98", force=True)
