pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IERC20.sol";

/**
    ROADMAP BILLBOARD REWARDER
    A platform where users are incentived to find lit content before they get mass adoption.
    WHY?. i think its pretty cool when you have a chance to earn for finding a cool song from early on
    - A cool way to discover music,
    - Get rewarded for you sweet music taste
    - Promotes underground artist work

    FUNCTIONS
    - propose A song that you think will be a banger
    - vote on the proposed song
    - withdraw your rewards

    IDEA
    - maybe a user can only propose for the song they own as NFT
    - there should be a propose fee and vote fee
    - users should have the RANK TOKEN to vote and propose

    QUESTION
    - is there a limit to how many times a user can propose a song
    - how to do the math for calculation


 */


 contract Billboard is Ownable {
    /* WTF does this do?
        A platform where users are incentived to find lit content before they get mass adoption.
        WHY?. i think its pretty cool when you have a chance to earn for finding a cool song from early on
        - A cool way to discover music,
        - Get rewarded for your sweet music taste
        - Promotes underground artist work
    */

    uint8 public  constant DECIMALS = 6;

    
    uint256 public proposalCost; // 20 rank tokens
    uint256 public upvoteCost;   // 10 rank tokens
    address public tokenAddress;
    IERC20 rankToken;

    struct Song {
        // Tracks the time when the song was initially submitted
        uint256 submittedTime;
        // Tracks the block when the song was initially submitted (to facilitate calculating a score that decays over time)
        uint256 submittedInBlock;
        // Tracks the number of tokenized votes not yet withdrawn from the song.  We use this to calculate withdrawable amounts.
        uint256 currentUpvotes;
        // Tracks the total number of tokenized votes this song has received.  We use this to rank songs.
        uint256 allTimeUpvotes;
        // Tracks the number of upvoters (!= allTimeUpvotes when upvoteCost != 1)
        uint256 numUpvoters;
        // Maps a user's address to their place in the "queue" of users who have upvoted this song.  Used to calculate withdrawable amounts.
        mapping(address => Upvote) upvotes;
    }


    struct Upvote {
        uint index; // 1-based index
        uint withdrawnAmount;
    }

    mapping(string => Song) public songs;

    // This mapping tracks which addresses we've seen before.  If an address has never been seen, and
    // its balance is 0, then it receives a token grant the first time it proposes or upvotes a song.
    // This helps us prevent users from re-upping on tokens every time they hit a 0 balance.
    mapping(address => bool) public receivedTokenGrant;
    uint public tokenGrantSize = 100 * (10 ** DECIMALS);


    /**** ****** ******* ****** ****** 
                EVENTS
    ****** ******* ****** ****** ****/

    event SongProposed(address indexed proposer, string cid);
    event SongUpvoted(address indexed upvoter, string cid);
    event Withdrawal(address indexed withdrawer, string cid, uint tokens);
    event UpdateProposalCost(address indexed proposer, uint amount);
    event UpdateUpvoteCost(address indexed proposer, uint amount);
    constructor(address _address) {
        tokenAddress = _address;
        rankToken = IERC20(_address);
    }


    /**** ****** ******* ****** ****** 
                INITS
    ****** ******* ****** ****** ****/

    function setProposalCost(uint256 _amount)  public onlyOwner {
        proposalCost = _amount * (10 ** DECIMALS);
        emit UpdateProposalCost(msg.sender, _amount);

    }

    function setUpvoteCost(uint256 _amount)  public onlyOwner {
        upvoteCost = _amount * (10 ** DECIMALS);
        emit UpdateUpvoteCost(msg.sender, _amount);

    }
    
    /**** ****** ******* ****** ****** 
              PROPOSE &  UPVOTE LOGIC SER
    ****** ******* ****** ****** ****/

    modifier maybeTokenGrant {
        if (receivedTokenGrant[msg.sender] == false) {
            receivedTokenGrant[msg.sender] = true;
            rankToken.transferFrom(owner(), msg.sender, tokenGrantSize);
        }
        _;
    }

    function tokenGrant() public {
        // create a bool function where you can choose to stop the grant 
        // inorder to avoid people claiming with new addresses
        if (receivedTokenGrant[msg.sender] == false) {
            receivedTokenGrant[msg.sender] = true;
            rankToken.transferFrom(owner(), msg.sender, tokenGrantSize);
        }
    }

    function propose(string calldata cid) maybeTokenGrant public {
        require(songs[cid].numUpvoters == 0, "already proposed");
        require(rankToken.balanceOf(msg.sender) >= proposalCost, "sorry bro, not enough tokens to propose");

        rankToken.transferFrom(msg.sender, address(this), proposalCost);
        
        Song storage song = songs[cid];
        song.submittedInBlock = block.number;
        song.submittedTime = block.timestamp;
        song.currentUpvotes += proposalCost;
        song.allTimeUpvotes += proposalCost;
        song.numUpvoters++;
        song.upvotes[msg.sender].index = song.numUpvoters;

        emit SongProposed(msg.sender, cid);


    }



    






 }