import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, LinkTo, Input} from "web3uikit";
import { Link } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis";
import axios from "axios";
import {} from 'dotenv/config'



const Home = () => {
  const [passRate, setPassRate] = useState(0);
  const [totalP, setTotalP] = useState(0);
  const [counted, setCounted] = useState(0);
  const [voters, setVoters] = useState(0);
  const { Moralis, isInitialized } = useMoralis();
  const [proposals, setProposals] = useState();
  const Web3Api = useMoralisWeb3Api();
  const [sub, setSub] = useState();
  const contractProcessor = useWeb3ExecuteFunction();
  
  const [file, setFile] = useState()
  const [myipfsHash, setIPFSHASH] = useState()
 
  
  
  const HandleFile=async (inputData) =>{

    console.log('starting')
    const [myipfsHash, setIPFSHASH] = useState()

    // initialize the form data
    const json_data = JSON.stringify(inputData)

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

    console.log("logging resposne", response)
    console.log("I am the hash", response.data.IpfsHash)

    // get the hash
     setIPFSHASH(response?.data.IpfsHash)

    if (! myipfsHash) return (
      console.log("I did not find the hash")
    )

    return response.data.IpfsHash

    
  }


  async function createProposal(newProposal) {
    let options = {
      contractAddress: "0x8316B2Bd5876AC2816a1Aa851e18cF8D1de47C24",
      functionName: "createProposal",
      abi: [
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_description",
              "type": "string"
            },
            {
              "internalType": "address[]",
              "name": "_canVote",
              "type": "address[]"
            }
          ],
          "name": "createProposal",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
      ],
      params: {
        _description: newProposal,
        _canVote: voters,
      },
    };


    await contractProcessor.fetch({
      params: options,
      onSuccess: () => {
        console.log("Proposal Succesful");
        setSub(false);
      },
      onError: (status) => {
        console.log(status.error.message);
        alert(status.error.message);
        setSub(false);
      },
    });


  }

  

  async function getStatus(proposalId) {
    const ProposalCounts = Moralis.Object.extend("ProposalCounts");
    const query = new Moralis.Query(ProposalCounts);
    query.equalTo("uid", proposalId);
    const result = await query.first();
    if (result !== undefined) {
      if (result.attributes.passed) {
        return { color: "green", text: "Passed" };
      } else {
        return { color: "red", text: "Rejected" };
      }
    } else {
      return { color: "blue", text: "Ongoing" };
    }
  }

 
  useEffect(() => {
    if (isInitialized) {
        
      async function getProposals() {
        const Proposals = Moralis.Object.extend("Proposals");
        const query = new Moralis.Query(Proposals);
        query.descending("uid_decimal");
        const results = await query.find();
        const table = await Promise.all(
          results.map(async (e) => [
            e.attributes.uid,
            e.attributes.description,
            <Link to="/proposal" state={{
              description: e.attributes.description,
              color: (await getStatus(e.attributes.uid)).color,
              text: (await getStatus(e.attributes.uid)).text,
              id: e.attributes.uid,
              proposer: e.attributes.proposer
              
              }}>
              <Tag
                color={(await getStatus(e.attributes.uid)).color}
                text={(await getStatus(e.attributes.uid)).text}
              />
            </Link>,
          ])
        );
        setProposals(table);
        setTotalP(results.length);
        
      }


      async function getPassRate() {
        const ProposalCounts = Moralis.Object.extend("ProposalCounts");
        const query = new Moralis.Query(ProposalCounts);
        const results = await query.find();
        let votesUp = 0;

        results.forEach((e) => {
          if (e.attributes.passed) {
            votesUp++;
          }
        });

        setCounted(results.length);
        setPassRate((votesUp / results.length) * 100);
      }


      const fetchNFTOwners = async () => {
        const options = {
          address: "0x705f8B395361218056B20eE5C36853AB84b8bbFF",
          chain: "rinkeby",
        };
        const NFTOwners = await Web3Api.token.getNFTOwners(options);
        const addresses = NFTOwners.result.map((e) => e.owner_of);
        // removes duplicates from array list
        // create a PR on this
        const uniqueAddresses = [...new Set(addresses)]
        setVoters(uniqueAddresses);
      };


      fetchNFTOwners();
      getProposals();
      getPassRate();
      
    }
  }, [isInitialized]);
  
  async function fetchYoutubeData(yt_link) {
    let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
    
    let url = "https://www.googleapis.com/youtube/v3/videos?key=" + process.env.REACT_APP_YOUTUBE_API_KEY +"&part=snippet&id=" + yt_link.match(re)[7]
    const response = await axios.get(url)
    const data_ = await response.data
    return {
            "id": data_.items[0]?.id,
            "title": data_.items[0]?.snippet?.title,
            "published":data_.items[0]?.snippet?.publishedAt,
            "image":data_.items[0]?.snippet?.thumbnails?.high?.url,
            "yt_link": yt_link
    }
    
}
 
  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
           
          <Tab tabKey={1} tabName="MUSIC">
          <div className="tabContent" >

          <Form
             buttonConfig={{
              onClick: function noRefCheck(){},
              theme: 'primary'
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
              
              let res =  await  fetchYoutubeData(e.data[0].inputResult).then( data => {return data})
              HandleFile(res)
              console.log(myipfsHash)
              // console.log("id ",res.id)
              // console.log("title ",res.title)
              // console.log("image ",res.image)
              // console.log("published", res.published)
              console.log(res)
              console.log(myipfsHash)
             

              console.log(`https://gateway.pinata.cloud/ipfs/${myipfsHash}`)
            }}
            title="Drop a hit anon!"
          
          /> 
            <div className="giphy">
            <img width="250px"  src="https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif" alt="Ninja donut gif" /> 
            </div>
            
 
          </div>
          
          
            
 
          </Tab>

          <Tab tabKey={2} tabName="BOARD">
            {proposals && (
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
            )}
          </Tab>
          
        </TabList>
      </div>
      {/* <div className="voting"></div> */}
    </>
  );
};

export default Home;
