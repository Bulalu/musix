import React, { useState, useEffect } from "react";
import "./pages.css";
import { Tag, Widget, Blockie, Tooltip, Icon, Form, Table, Information } from "web3uikit";
import { musix_address, token_address } from "./address.js";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import axios from "axios";
import MyYoutube from "../utils/youtube_api";


const Proposal = () => {

  const { state: songDetails } = useLocation();
  const { Moralis, isInitialized } = useMoralis();
  const [latestVote, setLatestVote] = useState();
  const [percUp, setPercUp] = useState(0);
  const [song, setSong] = useState()
  const [percDown, setPercDown] = useState(0);
  const [upvotes, setUpVotes] = useState([]);
  const [score, setSongScore] = useState(0);
  const [sub, setSub] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();

  useEffect(() => {
    if (isInitialized) {
      
      async function getUpVotes() {
        const Upvotes = Moralis.Object.extend("Upvotes");
        const query = new Moralis.Query(Upvotes);
        query.equalTo("cid", songDetails.description);
        query.descending("createdAt");
        const results = await query.find();
        // console.log("query query", results)

        const voters = results.map((e) => [
          e.attributes.upvoter,
        ]);

        setUpVotes(voters);
      }

      async function getSongScore() {
        let options = {
          contractAddress: musix_address,
          functionName: "getSongScore",
          abi: [{"inputs":[{"internalType":"address","name":"_address","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"string","name":"cid","type":"string"}],"name":"SongProposed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"upvoter","type":"address"},{"indexed":false,"internalType":"string","name":"cid","type":"string"}],"name":"SongUpvoted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"UpdateProposalCost","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"proposer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"UpdateUpvoteCost","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"withdrawer","type":"address"},{"indexed":false,"internalType":"string","name":"cid","type":"string"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[],"name":"DECIMALS","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proposalCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"cid","type":"string"}],"name":"propose","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"receivedTokenGrant","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setProposalCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setUpvoteCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"songs","outputs":[{"internalType":"uint256","name":"submittedTime","type":"uint256"},{"internalType":"uint256","name":"submittedInBlock","type":"uint256"},{"internalType":"uint256","name":"currentUpvotes","type":"uint256"},{"internalType":"uint256","name":"allTimeUpvotes","type":"uint256"},{"internalType":"uint256","name":"numUpvoters","type":"uint256"},{"internalType":"address","name":"proposer","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenGrant","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenGrantSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"cid","type":"string"}],"name":"upvote","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"upvoteCost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
          
        }

        const results = await Moralis.executeFunction(options);
        console.log("results", results)

      }


      async function fetchSong() {
        const song = await getSongs(songDetails.id)
        console.log("SONGI SONGI", songDetails.id)
        setSong(song)

      }
      
      getUpVotes()
      // getSongScore()


    }
  }, [Moralis.Object, Moralis.Query, isInitialized, songDetails.id]);

  async function approveTokens(amount) {
    let options = {
      contractAddress: token_address,
      functionName: "approve",
      abi: [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "spender",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      params: {
        spender: musix_address,
        amount: amount,
        
      }
    }

    const ba = await contractProcessor.fetch({
      params: options,  
    });

    // let balance =  (parseInt(ba._hex))/ DECIMALS
    
    // if ( balance && balance >= (20)) {
    //   return true
    // } else {
    //   return false
    // }

  }

  async function upvoteSong(amount) {
    // const web3 = await Moralis.enableWeb3();
    await approveTokens(amount)
    console.log("SONG DETAILS", songDetails.description)
    let options = {
      contractAddress: musix_address,
      functionName: "upvote",
      abi: [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "cid",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "upvote",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
      ],
      params: {
        cid: songDetails.description,
        amount: amount,
      },
      
      // msgValue: Moralis.Units.ETH(amount)
      // msgValue: amount
    };

    
    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log("Vote Cast Succesfully");
        setSub(false);
      },
 
      onError: (status) => {
        console.log(status.error.message);
        alert(status.error.message);
        setSub(false);
      }

    });

  }

  async function getSongs(ipfs_hash){

    try {
      const URL =  `https://gateway.pinata.cloud/ipfs/${ipfs_hash}`
      const response = await axios.get(URL)
      const data = await response.data
      return data

    } catch (error) {
      console.log(error.response)
      return error.response
    }

  }

  // console.log("SDSDSD", song)


  return (
    <>
      <div className="contentProposal">
        <div className="proposal">
          <Link to="/">
            <div className="backHome">
              <Icon fill="#ffffff" size={20} svg="chevronLeft" />
              Overview
            </div>
          </Link>
          <div>{songDetails.description}</div>
          <div className="proposalOverview">
            <Tag color={songDetails.color} text={songDetails.text} />
            <div className="proposer">
              <span>Proposed By </span>
              <Tooltip content={songDetails.proposer}>
                <Blockie seed={songDetails.proposer} />
              </Tooltip>
            </div>
          </div>
       
        </div>
        
        <div className="songsDiv">
        
          <MyYoutube id={songDetails.video_id} />
          {/* <Information
               style={{ 
                width: "40%",
                height: "20%",
                // margin: "auto",
                justifyContent: "center",
               }}
              information={`${score} ETH`}
              topic="Song Score"
            /> */}
          
        </div>
        <div className="votesDiv">
          <Table
            style={{ width: "60%" }}
            columnsConfig="90% 10%"
            data={upvotes}
            header={[<span>Voters</span>]}
            pageSize={5}
          />

          <Form
            // isDisabled={proposalDetails.text !== "Ongoing"}
            style={{
              width: "35%",
              height: "250px",
              border: "1px solid rgba(6, 158, 252, 0.2)",
            }}
            buttonConfig={{
              isLoading: sub,
              loadingText: "Casting Vote",
              text: "Vote",
              theme: "secondary",
            }}
            data={[
              {
                inputWidth: "100%",
                name: "Cast Vote",
                // options: ["For", "Against"],
                type: "text",
                validation: {
                  required: true,
                },
              },
            ]}
            onSubmit={async (e) => {
              let amountInWei = Moralis.Units.ETH(e.data[0].inputResult);
              // const busdInWei = Moralis.Units.Token("0.5", "18")
              console.log("amountInWei", amountInWei)
              await upvoteSong(amountInWei)
              setSub(true);
            }}
            title="Cast Vote"
          />
        </div>
      </div>
      {/* <div className="voting"></div> */}
    </>
  );
};

export default Proposal;
