import fetch from "node-fetch";
import { URL, URLSearchParams } from "url";
import {} from 'dotenv/config'
import axios from "axios"



function slipt_string(input) {
  return input.split("T")[0]
}
export default async function getData(yt_link) {
  let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.search = new URLSearchParams({
    key: process.env.YOUTUBE_API_KEY,
    part: "snippet",
    id: yt_link.match(re)[7],
  }).toString();

  console.log(url.href)
  // let urlx = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyA5u-vl8QfEPHFlIsv-bpto2lZQooywNb4&part=snippet&id=fsukuAcjyqU"
  //   return axios.get(urlx).then((response) => {
  //     const data = await response.data.snippet
  //     console.log( await response.data.snippet);
  //   });
    
  // return axios.get(url.toString())
  //   .then(async (response) => {
  //     const data = await response.json();
      
  //     const videos = data?.items || [];
  //     return videos.map((video) => {
  //       return {
  //         id: video?.id,
  //         title: video?.snippet?.title,
  //         published: slipt_string(video?.snippet?.publishedAt),
  //         thumbnails: video?.snippet?.thumbnails?.high?.url,
         
  //       };
  //     });
  //   })
  //   .catch((error) => {
  //     console.warn(error);
  //   });

}



// let  data = await  getData("https://www.youtube.com/watch?v=fsukuAcjyqU&list=RDfsukuAcjyqU&start_radio=1")
// console.log(data)
// getData("https://www.youtube.com/watch?v=fsukuAcjyqU&list=RDfsukuAcjyqU&start_radio=1")

console.log(process.env.YOUTUBE_API_KEY)

