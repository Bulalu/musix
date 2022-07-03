import fetch from "node-fetch";
import { URL, URLSearchParams } from "url";

import {} from 'dotenv/config'


console.log(process.env.YOUTUBE_API_KEY)
module.exports = {
    fetch_youtube_data: function(yt_link){
        let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
        const url = new URL("https://www.googleapis.com/youtube/v3/videos");
        url.search = new URLSearchParams({
            key: "YOUTUBE_API_KEY=AIzaSyA5u-vl8QfEPHFlIsv-bpto2lZQooywNb4",
            part: "snippet",
            id: yt_link.match(re)[7],
        }).toString();

        return fetch(url)
            .then(async (response) => {
            const data = await response.json();
            
            const videos = data?.items || [];
            return videos.map((video) => {
                return {
                id: video?.id,
                title: video?.snippet?.title,
                published: (video?.snippet?.publishedAt).split("T")[0],
                thumbnails: video?.snippet?.thumbnails?.high?.url,
                
                };
            });
            })
            .catch((error) => {
            console.warn(error);
    });
    }
}