import React, { useEffect, useState, styled } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, LinkTo, Input, Hero, Button} from "web3uikit";
import { Link } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction} from "react-moralis";
import { musix_address, token_address } from "./address.js";
import axios from "axios";
import {} from 'dotenv/config'
import { Alert } from '@mui/material';


const Home = () => {
  
  const { Moralis, isInitialized } = useMoralis();
 
  const Web3Api = useMoralisWeb3Api();
  const contractProcessor = useWeb3ExecuteFunction();
  const [sub, setSub] = useState();
  const [hashes, setSongHashes] = useState()
  const [totalSongs, setTotalSongs] = useState(0);
  const [myipfsHash, setIPFSHASH] = useState()
  const [rankBalance, setRankTokenBalance] = useState()
  const DECIMALS = 1000000
  const { authenticate, isAuthenticated, isAuthenticating, user, account, logout } = useMoralis();
   
  async function mintUSDC() {
    let options = {
      contractAddress: token_address,
      functionName: "mint",
      abi: [
        {
          "inputs": [],
          "name": "mint",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      // params: {
      //   spender: musix_address,
      //   amount: amount,
        
      // }
    }

    const ba = await contractProcessor.fetch({
      params: options,  
    });

  }
 
  async function allInOne(yt_link) {

    if (isAuthenticated) {

       // fetch data from youtube
    let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
    
    let url = "https://www.googleapis.com/youtube/v3/videos?key=" + process.env.REACT_APP_YOUTUBE_API_KEY +"&part=snippet&id=" + yt_link.match(re)[7]
    const response = await axios.get(url)
    const data_ = await response.data
    const data_to_pin = await  {
      "id": data_.items[0]?.id,
      "title": data_.items[0]?.snippet?.title,
      "published":data_.items[0]?.snippet?.publishedAt,
      "image":data_.items[0]?.snippet?.thumbnails?.high?.url,
      "yt_link": yt_link
}
    console.log("data_to_pin", data_to_pin)
    // pin this data to ipfs
    const URL =  `https://api.pinata.cloud/pinning/pinJSONToIPFS`
    const json_data = JSON.stringify(data_to_pin)
    console.log("json stringfied", json_data)
    const response_ = await axios.post(
      URL,
      json_data,
      {
          headers: {
              "Content-Type": 'application/json', 
              'pinata_api_key': process.env.REACT_APP_API_KEY,
              'pinata_secret_api_key': process.env.REACT_APP_API_SECRET

          }
      }
  )
  

  const ipfs_hash = response_.data.IpfsHash
  console.log("ipfs hash", ipfs_hash)
  setIPFSHASH(ipfs_hash)

  // approving the contract to transfer
  const proposal_cost = Moralis.Units.Token("20", "18")
  await approveTokens(proposal_cost)
  
  // submitting hash to contract
  let options = {
    contractAddress: musix_address,//0xc1FEE0BDE801655892c06bC5CA57d4329205406D
    functionName: "propose",
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
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "propose",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      }
    ],
    params: {
      cid: ipfs_hash,
      _amount: proposal_cost

    },

    // msgValue: Moralis.Units.ETH("0.1")
    
  }

  await contractProcessor.fetch({
    params: options,
    
    onSuccess: () => {
      <Alert severity="success" color="info">
            Awesome, https://gateway.pinata.cloud/ipfs/{myipfsHash}
      </Alert>
      console.log("Awesome, https://gateway.pinata.cloud/ipfs/" + ipfs_hash)
      setSub(false);
    },
    onError: (status) => {
      console.log(status.error.message);
      alert(status.error.message);
      setSub(false);
    },
  });

  } else {
    alert("Not Authenticated")
  }

    } 

  async function canProposeCID(account) {
    
      let options = {
        contractAddress: token_address,
        functionName: "balanceOf",
        abi: [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address"
              }
            ],
            "name": "balanceOf",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        params: {
          account: account,
          
        }
      }

      const ba = await contractProcessor.fetch({
        params: options,  
      });

      let balance =  (parseInt(ba._hex))/ DECIMALS
      
      if ( balance && balance >= (20)) {
        return true
      } else {
        return false
      }

       

  }



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

  useEffect(() => {

    if (isInitialized) {

      async function getCIDS() {

        const Songs = Moralis.Object.extend("NewSongs");
        const query = new Moralis.Query(Songs);
        query.descending("createdAt");
        const results = await query.find();
        const table = await Promise.all(
          results.map(async (song) => [
            song.attributes.uid,
            song.attributes.cid,
            <Link to="/proposal" state={{
              description: song.attributes.cid,
              color: "white",
              yt_link: (await getSongs(song.attributes.cid)).yt_link,
              text: (await getSongs(song.attributes.cid)).title,
              // id: "hee",
              video_id: (await getSongs(song.attributes.cid)).id,
              proposer: song.attributes.proposer,
              
              
              }}>
                <Tag
                  color="white"
                  text={(await getSongs(song.attributes.cid)).title}
              />
              

              </Link>
          ]
        )
        );

        // console.log("TABLE MANNERS", results)

        setSongHashes(table)
        setTotalSongs(results.length)   
  }

 

  getCIDS()
  
}
  }, [isInitialized]);

  


 
  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
           
          <Tab tabKey={1} tabName="MUSIC">
          <div className="tabContent" >

          <Form
             buttonConfig={{
              isLoading: sub,
              loadingText: "Submitting proposal",
              text: "Submit",
              disabled: "true"
              
            }}
            data={[
              
              {
                inputWidth: '100%',
                name: 'youtube link',
                type: 'text',
                validation: {
                  regExp: '^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$',
                  required: true,
                  regExpInvalidMessage: 'please put a valid YOUTUBE link ffs!'
                },
                value: ''
              }
            ]}

            onSubmit={ async (e) => {
              setSub(true);
              await(allInOne(e.data[0].inputResult))
              // console.log("musicxxx", musix_address)
              
              // await canProposeCID(account) ? 
                  
              //     await(allInOne(e.data[0].inputResult)) : alert("Not Enough Rank Tokens")
             
            }}
            title="Drop a hit anon!"
          
          /> 
            <div className="giphy">
            <img width="250px"  src="https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif" alt="Ninja donut gif" /> 
            
            </div>

            Recent Songs
              <div style={{ marginTop: "30px" }}>
                <Table
                  columnsConfig=" 20% 80%"
                  data={hashes}
                  header={[
                    // <span>ID</span>,
                    <span>Title</span>,
                    <span>CID</span>,
                  ]}
                  pageSize={5}
                />
                {/* {hashes.map((hash, index) => (console.log(hash))} */}
                {
                 
                }
              </div>
 
          </div>
          {
           
          }
          
          
 
          </Tab>

          <Tab tabKey={2} tabName="rUSDC">

              <div className="tabContent">
                <h3>get 100 rUSDC for free, wohoo!</h3>

                <Button text="mint" onClick={mintUSDC}/>
              </div>
              

              
          </Tab>

          <Tab tabKey={3} tabName="ABOUT">

            <div className="tabContent">
              <h3>WTF is Musix?</h3>

              <h6>
              With Musix, you can be the one to spot high quality songs earlier than anyone else! With our special incentive system, you can earn rewards for being the first to listen to and identify great new music.

              So put your musical taste to the test, and become a legend in the music world with Musix!
              </h6>

              <h5> checkout the demo links </h5>
              <li>
                <a href="https://twitter.com/elisha_bulalu/status/1543967465583042560?s=20&t=Yzy51pHr0bLkJebKlRV3ig"  >demo 1</a>
              </li>
              <li>
                <a href="https://twitter.com/elisha_bulalu/status/1546836989445537793?s=20&t=Yzy51pHr0bLkJebKlRV3ig">demo 2</a>
              </li>
              <li>
                <a href="https://twitter.com/elisha_bulalu/status/1549148871288393733?s=20&t=Yzy51pHr0bLkJebKlRV3ig">demo 3</a>
              </li>
              <li>
                <a href="https://twitter.com/elisha_bulalu/status/1553388282385424385?s=20&t=Yzy51pHr0bLkJebKlRV3ig">demo 4</a>
              </li>
            </div>



            </Tab>
          
        </TabList>
      </div>
      {/* <div className="voting"></div> */}
    </>
  );
};

export default Home;
