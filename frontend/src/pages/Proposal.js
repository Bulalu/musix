import React, { useState, useEffect } from "react";
import "./pages.css";
import { Tag, Widget, Blockie, Tooltip, Icon, Form, Table } from "web3uikit";
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
  const [votes, setVotes] = useState([]);
  const [sub, setSub] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();

  useEffect(() => {
    if (isInitialized) {
      
      async function getVotes() {
        
        const Votes = Moralis.Object.extend("Votes");
        const query = new Moralis.Query(Votes);
        query.equalTo("proposal", songDetails.id);
        query.descending("createdAt");
        const results = await query.find();
        if (results.length > 0) {
          setLatestVote(results[0].attributes);
          setPercDown(
            (
              (Number(results[0].attributes.votesDown) /
                (Number(results[0].attributes.votesDown) +
                  Number(results[0].attributes.votesUp))) *
              100
            ).toFixed(0)
          );
          setPercUp(
            (
              (Number(results[0].attributes.votesUp) /
                (Number(results[0].attributes.votesDown) +
                  Number(results[0].attributes.votesUp))) *
              100
            ).toFixed(0)
          );
        }


        const votesDirection = results.map((e) => [
          e.attributes.voter,
          <Icon
            fill={e.attributes.votedFor ? "#2cc40a" : "#d93d3d"}
            size={24}
            svg={e.attributes.votedFor ? "checkmark" : "arrowCircleDown"}
          />,
        ]);

        setVotes(votesDirection);

      }

      async function fetchSong() {
        const song = await getSongs(songDetails.id)
        console.log("SONGI SONGI", songDetails.id)
        setSong(song)

      }
      getVotes();
      // fetchSong()


    }
  }, [Moralis.Object, Moralis.Query, isInitialized, songDetails.id]);



  async function castVote(status) {
    // const web3 = await Moralis.enableWeb3();
    let options = {
      contractAddress: "0x8316B2Bd5876AC2816a1Aa851e18cF8D1de47C24",
      functionName: "voteOnProposal",
      abi: [
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "_vote",
              "type": "bool"
            }
          ],
          "name": "voteOnProposal",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
      ],
      params: {
        _id: songDetails.id,
        _vote: status,
      },
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
       
        <MyYoutube id={songDetails.video_id} />
      </div>
      {/* <div className="voting"></div> */}
    </>
  );
};

export default Proposal;
