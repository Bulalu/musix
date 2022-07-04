import axios from "axios";
import React, { useEffect, useState } from "react";

import {} from 'dotenv/config'


export default function App() {
  const [post, setPost] = useState(null);
    

    async function fetchYoutubeData(yt_link) {
        let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
        
        let url = "https://www.googleapis.com/youtube/v3/videos?key=" + process.env.REACT_APP_YOUTUBE_API_KEY +"&part=snippet&id=" + yt_link.match(re)[7]
        // console.log(url)
        await axios.get(url).then((response) => {
            let data_  = {
                "id": response.data.items[0]?.id,
                "title": response.data.items[0]?.snippet?.title,
                "published":response.data.items[0]?.snippet?.publishedAt,
                "image":response.data.items[0]?.snippet?.thumbnails?.high?.url
            }
            // console.log("gegeg", data_)
            return data_;
    
          
          
        });
    }

    fetchYoutubeData("https://www.youtube.com/watch?v=j5-yKhDd64s")
    

  

  return (
    <div>
        
      <h1>hello world</h1>
      <p>grerger</p>
      <h2>{}</h2>
    </div>
  );
}