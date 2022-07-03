import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, LinkTo, Input} from "web3uikit";
import { Link } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis";
// import { getData } from "../utils/api.mjs";
// import fetch from "node-fetch";

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

  
  ///////////////////////FUKIN YOUTUBE API STUFF///////////////////////////////////
  // function slipt_string(input) {
  //   return input.split("T")[0]
  // }


  // async function getData(yt_link) {
  //   let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  //   const url =  URL("https://www.googleapis.com/youtube/v3/videos");
  //   url.search =  URLSearchParams({
  //     key: process.env.YOUTUBE_API_KEY,
  //     part: "snippet",
  //     id: yt_link.match(re)[7],
  //   }).toString();
  
  //   return fetch(url)
  //     .then(async (response) => {
  //       const data = await response.json();
        
  //       const videos = data?.items || [];
  //       return videos.map((video) => {
  //         return {
  //           id: video?.id,
  //           title: video?.snippet?.title,
  //           published: slipt_string(video?.snippet?.publishedAt),
  //           thumbnails: video?.snippet?.thumbnails?.high?.url,
           
  //         };
  //       });
  //     })
  //     .catch((error) => {
  //       console.warn(error);
  //     });
  
  // }

  // console.log("testinf my functino,",  getData("https://www.youtube.com/watch?v=fsukuAcjyqU&list=RDfsukuAcjyqU&start_radio=1"))

  


  /////////////////////I HATE JS SO MUCH //////////////////////////////////
  
 

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
  
  
  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          <Tab tabKey={1} tabName="DAO">
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

          
          <Tab tabKey={2} tabName="MUSIC">
          <div className="tabContent">
          {/* <div className="input_filled">
          <Input
                    
                    id=""
                    label="youtube link"
                    description="this song better be hot bro"
                    name="Test text Input"
                    onBlur={function noRefCheck(){}}
                    onChange={function noRefCheck(){}}
                    
                    onSubmit={(e) => {
                      console.log(e.data[0].inputResult)
                    }}
                    prefixIcon="youtube"
                    type="text"
                    validation={{
                      regExp: "^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$"
                      ,
                      regExpInvalidMessage: 'That is not a valid youtube link'
                    }}
                  />
          </div> */}
 
          </div>
          
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

            onSubmit={(e) => {
              // let me =   getData("https://www.youtube.com/watch?v=fsukuAcjyqU&list=RDfsukuAcjyqU&start_radio=1")
              // console.log("youtube data",me)
              
              console.log(e.data[0].inputResult)
            }}
            title="Drop a hit"
          
          
          /> 
            
            
          
             {/* <div className="tabContent">
              Propose Some music bro
              <div className="widgets">
                <Widget
                  info="yellow"
                  title="create something"
                  
                >

                  <Input
                    
                    id=""
                    label="youtube link"
                    description="this song better be hot bro"
                    name="Test text Input"
                    onBlur={function noRefCheck(){}}
                    onChange={function noRefCheck(){}}
                    prefixIcon="youtube"
                    type="text"
                    validation={{
                      regExp: '^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*(?:[&\/\#].*)?$',
                      regExpInvalidMessage: 'That is not a valid youtube link'
                    }}
                  />
                                    
                </Widget>
                
                
              </div>
              </div> */}


            
            
          </Tab>
          
        </TabList>
      </div>
      <div className="voting"></div>
    </>
  );
};

export default Home;
