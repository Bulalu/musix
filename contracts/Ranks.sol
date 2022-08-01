pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IERC20.sol";



 contract Musix is Ownable {
    /* WTF does this do?
        A platform where users are incentived to find lit content before they get mass adoption.
        WHY?. i think its pretty cool when you have a chance to earn for finding a cool song from early on
        - A cool way to discover music,
        - Get rewarded for your sweet music taste
        - Promotes underground artist work
    */

    uint256 public  constant DECIMALS = 10**18;

    
    uint256 public proposalCost = 20 * DECIMALS;
    uint256 public upvoteCost = 10 * DECIMALS;   // 10 rank tokens
    address public tokenAddress;
    IERC20 underlying;

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
        // the proposer
        address proposer;
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
    event SongUpvoted(address indexed upvoter, string cid, uint256 amount);
    event Withdrawal(address indexed withdrawer, string cid, uint tokens);
    event UpdateProposalCost(address indexed proposer, uint amount);
    event UpdateUpvoteCost(address indexed proposer, uint amount);
    constructor(address _address) {
        tokenAddress = _address;
        underlying = IERC20(_address);
    }


    /**** ****** ******* ****** ****** 
                INITS
    ****** ******* ****** ****** ****/

    function setProposalCost(uint256 _amount)  public onlyOwner {
        proposalCost = _amount * (10 ** DECIMALS);
        emit UpdateProposalCost(msg.sender, _amount);

    }

    //don't limit how much users can upvote for now
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
            underlying.transferFrom(owner(), msg.sender, tokenGrantSize);
        }
        _;
    }

  

    function propose(string calldata cid) payable public {
        require(songs[cid].numUpvoters == 0, "already proposed");
        require(msg.value >= proposalCost, "sorry bro, not enough tokens to propose");
        

        underlying.transferFrom(msg.sender, address(this), proposalCost);
        
        Song storage song = songs[cid];
        song.submittedInBlock = block.number;
        song.submittedTime = block.timestamp;
        song.currentUpvotes += proposalCost;
        song.allTimeUpvotes += proposalCost;
        song.numUpvoters++;
        song.upvotes[msg.sender].index = song.numUpvoters;
        song.proposer = msg.sender;

        emit SongProposed(msg.sender, cid);


    }



    function upvote(string calldata cid, uint256 amount) external payable {
        require(msg.value >= upvoteCost, "Musix: Not enough tokens to upvote");
        require(underlying.balanceOf(msg.sender) >= amount, "Musix: Not enough tokens to upvote");

        Song storage song = songs[cid];
        // uint256 amount = msg.value;
        underlying.transferFrom(msg.sender, address(this), amount);

        require(song.upvotes[msg.sender].index == 0, "you have already upvoted this song");

        song.currentUpvotes += amount;
        song.allTimeUpvotes += amount;
        song.numUpvoters++;
        song.upvotes[msg.sender].index = song.numUpvoters;

        emit SongUpvoted(msg.sender, cid, msg.value);
    }


    // function withdrawETH() external onlyOwner {
    //     uint256 balance = address(this).balance;
    //     address(payable(address(this)).transfer(balance, msg.sender);
    // }






 }