import React, { useEffect, useState, styled } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, LinkTo, Input, Hero} from "web3uikit";
import { Link } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction} from "react-moralis";
import axios from "axios";
import {} from 'dotenv/config'
import { Alert } from '@mui/material';


const Home = () => {
  
  const { Moralis, isInitialized } = useMoralis();
 
  const Web3Api = useMoralisWeb3Api();
  const contractProcessor = useWeb3ExecuteFunction();
  const [sub, setSub] = useState();
  const [youtubeData, setYoutubeData] = useState()
  const [myipfsHash, setIPFSHASH] = useState()
  
  async function allInOne(yt_link) {

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

  // submitting hash to contract
  let options = {
    contractAddress: "0xf72802C65532818041ad8d904F73be68741b4B26",
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
            "internalType": "address",
            "name": "_proposer",
            "type": "address"
          }
        ],
        "name": "propose",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    params: {
      cid: ipfs_hash,
      _proposer: "0xa3dD11E7D3Aa89b9e0598ac0d678910417d63989"

    }
  }

  await contractProcessor.fetch({
    params: options,
    onSuccess: () => {
      <Alert severity="success" color="info">
            Awesome, https://gateway.pinata.cloud/ipfs/{myipfsHash}
      </Alert>
      console.log("Awesome, https://gateway.pinata.cloud/ipfs/" + myipfsHash)
      setSub(false);
    },
    onError: (status) => {
      console.log(status.error.message);
      alert(status.error.message);
      setSub(false);
    },
  });

  }

  async function proposeSong(CID) {
    let options = {
      contractAddress: "0xf72802C65532818041ad8d904F73be68741b4B26",
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
              "internalType": "address",
              "name": "_proposer",
              "type": "address"
            }
          ],
          "name": "propose",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
      params: {
        cid: CID,
        _proposer: "0xa3dD11E7D3Aa89b9e0598ac0d678910417d63989"

      }
    }

    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        <Alert severity="success" color="info">
              Awesome, https://gateway.pinata.cloud/ipfs/{myipfsHash}
        </Alert>
        setSub(false);
      },
      onError: (status) => {
        console.log(status.error.message);
        alert(status.error.message);
        setSub(false);
      },
    });
  }
 
  
  const handleFile=async (inputData) =>{

    console.log('starting')

    // initialize the form data
    const json_data = JSON.stringify(inputData)
    console.log("json stringfied", json_data)

    // call the keys from .env
    const API_KEY = process.env.REACT_APP_API_KEY
    const API_SECRET = process.env.REACT_APP_API_SECRET

    // the endpoint needed to upload the file
    const url =  `https://api.pinata.cloud/pinning/pinJSONToIPFS`

    const response = await axios.post(
      url,
      json_data,
      {
          headers: {
              "Content-Type": 'application/json', 
              'pinata_api_key': API_KEY,
              'pinata_secret_api_key': API_SECRET

          }
      }
  )

      // get the hash
     setIPFSHASH(response.data.IpfsHash)

    console.log("logging resposne", response)
    // console.log("I am the hash", response.data.IpfsHash)

    

    
    
    
  }


  async function fetchYoutubeData(yt_link) {
    let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
    
    let url = "https://www.googleapis.com/youtube/v3/videos?key=" + process.env.REACT_APP_YOUTUBE_API_KEY +"&part=snippet&id=" + yt_link.match(re)[7]
    const response = await axios.get(url)
    const data_ = await response.data
    const clean_data = await  {
      "id": data_.items[0]?.id,
      "title": data_.items[0]?.snippet?.title,
      "published":data_.items[0]?.snippet?.publishedAt,
      "image":data_.items[0]?.snippet?.thumbnails?.high?.url,
      "yt_link": yt_link
}
    setYoutubeData(clean_data)
    console.log(clean_data)
    return  clean_data
    
}
 
  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
           
          <Tab tabKey={1} tabName="MUSIC">
          <div className="tabContent" >

          <Form
             buttonConfig={{
              isLoading: sub,
              loadingText: "Submitting Proposal",
              text: "Submit",
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
              const yt_link = e.data[0].inputResult
              // console.log("yt_link", yt_link)
              await allInOne(e.data[0].inputResult)
              // let res =  await  fetchYoutubeData(e.data[0].inputResult).then( data => {return data})
              // await handleFile(res).then(proposeSong("Sdsdsd"))
             
              // // await proposeSong(myipfsHash)
              // // console.log(res)
              // // console.log("IPFS VAriable",myipfsHash)
             

              // console.log(`https://gateway.pinata.cloud/ipfs/${myipfsHash}`)
            }}
            title="Drop a hit anon!"
          
          /> 
            <div className="giphy">
            <img width="250px"  src="https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif" alt="Ninja donut gif" /> 
            {/* <h1> here is your cid {myipfsHash}</h1>


            <a href={`https://gateway.pinata.cloud/ipfs/${myipfsHash}`}> your cid</a> */}
            {/* {
              myipfsHash && (
              //   <Hero
              //   align="left"
              //   height="176px"
              //   linearGradient="linear-gradient(113.54deg, rgba(60, 87, 140, 0.5) 14.91%, rgba(70, 86, 169, 0.5) 43.21%, rgba(125, 150, 217, 0.345) 44.27%, rgba(129, 161, 225, 0.185) 55.76%), linear-gradient(151.07deg, #141659 33.25%, #4152A7 98.24%)"
              //   rounded="20px"
              //   textColor="#fff"
              //   title= "CID"
              // >
              //   {`https://gateway.pinata.cloud/ipfs/${myipfsHash}`}
              // </Hero>
              // <Alert severity="success" color="info">
              // Awesome, https://gateway.pinata.cloud/ipfs/{myipfsHash}
              // </Alert>
               


              // alert("awesome you can view the CID to your song here https://gateway.pinata.cloud/ipfs/" + myipfsHash + " and some little info here" + youtubeData.title) 
              
              )
              
            }
             */}
            </div>
            
 
          </div>
          {
           
          }
          
          
 
          </Tab>

          <Tab tabKey={2} tabName="BOARD">
            {/* {proposals && (
            <div className="tabContent">
              Governance Overview
              <div className="widgets">
                <Widget
                  info={totalP}
                  title="Proposals Created"
                  style={{ width: "200%" }}
                >
                  <div className="extraWidgetInfo">
                    <div className="extraTitle">Pass Rate</div>
                    <div className="progress">
                      <div
                        className="progressPercentage"
                        style={{ width: `${passRate}%` }}
                      ></div>
                    </div>
                  </div>
                </Widget>
                <Widget info={voters.length} title="Eligible Voters" />
                <Widget info={totalP-counted} title="Ongoing Proposals" />
              </div>
              Recent Proposals
              <div style={{ marginTop: "30px" }}>
                <Table
                  columnsConfig="10% 70% 20%"
                  data={proposals}
                  header={[
                    <span>ID</span>,
                    <span>Description</span>,
                    <span>Status</span>,
                  ]}
                  pageSize={5}
                />
              </div>

              <Form
                  buttonConfig={{
                    isLoading: sub,
                    loadingText: "Submitting Proposal",
                    text: "Submit",
                    theme: "secondary",
                  }}
                  data={[
                    {
                      inputWidth: "100%",
                      name: "New Proposal",
                      type: "textarea",
                      validation: {
                        required: true,
                      },
                      value: "",
                    },
                  ]}
                  onSubmit={(e) => {
                    setSub(true);
                    createProposal(e.data[0].inputResult);
                  }}
                  title="Create a New Proposal"
                />


            </div>
            )} */}
          </Tab>
          
        </TabList>
      </div>
      {/* <div className="voting"></div> */}
    </>
  );
};

export default Home;
