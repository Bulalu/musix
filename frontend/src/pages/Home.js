import React, { useEffect, useState, styled } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, LinkTo, Input, Hero} from "web3uikit";
import { Link } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction} from "react-moralis";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
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
      console.log("Awesome, https://gateway.pinata.cloud/ipfs/" + ipfs_hash)
      setSub(false);
    },
    onError: (status) => {
      console.log(status.error.message);
      alert(status.error.message);
      setSub(false);
    },
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
  //  getSongs("QmUgzjSTqnQDEHh1Rn7oPrdEMphLz7s347oBbxZeYAQhnq")

  useEffect(() => {

    if (isInitialized) {

      async function getCIDS() {

        const Songs = Moralis.Object.extend("Songs");
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
              text: "hello",
              id: song.attributes.cid,
              proposer: song.attributes.proposer
              
              }}>
                <Tag
                  color="white"
                  text={(await getSongs(song.attributes.cid)).title}
              />

              </Link>
          ]
        )
        );

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
             
              await allInOne(e.data[0].inputResult)
             

              // console.log(`https://gateway.pinata.cloud/ipfs/${myipfsHash}`)
            }}
            title="Drop a hit anon!"
          
          /> 
            <div className="giphy">
            <img width="250px"  src="https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif" alt="Ninja donut gif" /> 
            
            </div>

            Recent Proposals
              <div style={{ marginTop: "30px" }}>
                <Table
                  columnsConfig="10% 70% 20%"
                  data={hashes}
                  header={[
                    <span>ID</span>,
                    <span>Description</span>,
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
