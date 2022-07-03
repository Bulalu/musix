import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, LinkTo, Input} from "web3uikit";
import { Link } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis";
// import { getData } from "../utils/api.mjs";
// import fetch from "node-fetch";
import { URL, URLSearchParams } from "url";
// import url from 'node:url';
import {} from 'dotenv/config'
// import {getData} from './apii.js'
// // import getData from './apii.js'
import getData from "../utils/api.mjs";


const Fetchy = () => {

    // const the_url = URL();
    // const the_search = URLSearchParams()

    function sayHello() {
        console.log("hey there")
        
      }
    
      sayHello()
      getData("https://www.youtube.com/watch?v=fsukuAcjyqU&list=RDfsukuAcjyqU&start_radio=1")
async  function getData(yt_link) {
    let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
    console.log(re)
    // const url = the_url("https://www.googleapis.com/youtube/v3/videos");
    // url.search = new URLSearchParams({
    //   key: process.env.YOUTUBE_API_KEY,
    //   part: "snippet",
    //   id: yt_link.match(re)[7],
    // }).toString();
  
    // return fetch(url)
    //   .then(async (response) => {
    //     const data = await response.json();
        
    //     const videos = data?.items || [];
    //     return videos.map((video) => {
    //       return {
    //         id: video?.id,
    //         title: video?.snippet?.title,
    //         published: (video?.snippet?.publishedAt).split("T")[0],
    //         thumbnails: video?.snippet?.thumbnails?.high?.url,
           
    //       };
    //     });
    //   })
    //   .catch((error) => {
    //     console.warn(error);
    //   });
  
  }

//   let kk =  getData("https://www.youtube.com/watch?v=fsukuAcjyqU&list=RDfsukuAcjyqU&start_radio=1")
//     console.log(kk)

// just create a simple hello world app and build from there

  

  

  
  
  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          
          
          <Tab tabKey={1} tabName="MUSIC">
          <div className="tabContent">
         
 
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
            //   let me =   getData("https://www.youtube.com/watch?v=fsukuAcjyqU&list=RDfsukuAcjyqU&start_radio=1")
            //   console.log("youtube data",me)
                sayHello()
              
              console.log(e.data[0].inputResult)
            }}
            title="Drop a hit"
          /> 
            
          </Tab>
          
        </TabList>
      </div>
      <div className="voting"></div>
    </>
  );
};

export default Fetchy;
