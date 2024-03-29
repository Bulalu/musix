pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IERC4626} from "../interfaces/IERC4626.sol";
import {IERC20} from "../interfaces/IERC20.sol";





 contract Musix is Ownable {
    /* WTF does this do?
        A platform where users are incentived to find lit content before they get mass adoption.
        WHY?. i think its pretty cool when you have a chance to earn for finding a cool song from early on
        - A cool way to discover music,
        - Get rewarded for your sweet music taste
        - Promotes underground artist work
    */

    uint256 public  constant MUL = 10 ** 18;

    
    uint256 public proposalCost = 20 * MUL; // 20 rank tokens
    uint256 public upvoteCost = 10 * MUL;   // 10 rank tokens
    address public tokenAddress;
    address public vault;
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
    // uint public tokenGrantSize = 100 * (10 ** DECIMALS);


    /**** ****** ******* ****** ****** 
                EVENTS
    ****** ******* ****** ****** ****/


    event SongProposed(address indexed proposer, string cid);
    event SongUpvoted(address indexed upvoter, string cid, uint256 amount);
    event Withdrawal(address indexed withdrawer, string cid, uint tokens);
    event UpdateProposalCost(address indexed proposer, uint amount);
    event UpdateUpvoteCost(address indexed proposer, uint amount);
    event UpdateVault(address  vault);
    constructor(address _address) {
        tokenAddress = _address;
        underlying = IERC20(_address);
    }


    /**** ****** ******* ****** ****** 
                INITS
    ****** ******* ****** ****** ****/

    function setProposalCost(uint256 _amount)  public onlyOwner {
        proposalCost = _amount * MUL;
        emit UpdateProposalCost(msg.sender, _amount);

    }

    function setUpvoteCost(uint256 _amount)  public onlyOwner {
        upvoteCost = _amount * MUL;
        emit UpdateUpvoteCost(msg.sender, _amount);

    }
    
    /**** ****** ******* ****** ****** 
              PROPOSE &  UPVOTE LOGIC SER
    ****** ******* ****** ****** ****/



    function propose(string calldata cid, uint256 _amount) payable public {
        require(songs[cid].numUpvoters == 0, "already proposed");
        require(underlying.balanceOf(msg.sender) >= _amount, "sorry bro, not enough tokens to propose");
        

        underlying.transferFrom(msg.sender, address(this), _amount);
        
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
        // require(msg.value >= upvoteCost, "Musix: Not enough tokens to upvote");
        require(underlying.balanceOf(msg.sender) >= upvoteCost, "Musix: Not enough tokens to upvote");

        Song storage song = songs[cid];
        // uint256 amount = msg.value;
        underlying.transferFrom(msg.sender, address(this), amount);

        require(song.upvotes[msg.sender].index == 0, "Musix: you have already upvoted this song");

        song.currentUpvotes += amount;
        song.allTimeUpvotes += amount;
        song.numUpvoters++;
        song.upvotes[msg.sender].index = song.numUpvoters;

        emit SongUpvoted(msg.sender, cid, amount);
    }




        function setVault(address _vault) public onlyOwner {
        vault = _vault;
        emit UpdateVault(vault);
    }

    
    // deposits into the vault
    function deposit(uint256 amount) public onlyOwner {
        require(vault != address(0), "vault not set");
        require(underlying.balanceOf(address(this)) >= amount, "Not enough tokens");

        underlying.approve(vault, amount);
        IERC4626(vault).deposit(amount, address(this));
    }

    function getSongScore(string calldata cid) public view returns (uint256) {
        Song storage song = songs[cid];
        uint256 score = song.allTimeUpvotes;
        return score;
    }






 }