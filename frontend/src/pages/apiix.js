// import fetch from "node-fetch";
// import { URL, URLSearchParams } from "url";
// import {} from 'dotenv/config'
// import axios from "axios";




// function slipt_string(input) {
//   return input.split("T")[0]
// }
// export  async function getData(yt_link) {
//   let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  
//   let url = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyA5u-vl8QfEPHFlIsv-bpto2lZQooywNb4&part=snippet&id=" + yt_link.match(re)[7]
//   // console.log("URL", url)
//   return axios.get(url)
//     .then(async (response) => {
//       const data = await response.data;
//       // console.log("sdhasuid", data)
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


// // let  data = await getData("https://www.youtube.com/watch?v=fsukuAcjyqU&list=RDfsukuAcjyqU&start_radio=1")
// // console.log(data)

// React.useEffect(() => {
//   axios.get(`${baseURL}/1`).then((response) => {
//     setPost(response.data);
//   });
// }, []);

// async function createPost() {
//   axios
//     .post(baseURL, {
//       title: "Hello World!",
//       body: "This is a new post."
//     })
//     .then((response) => {
//       setPost(response.data);
//     });
// }

// if (!post) return "No post!"

// return (
//   <div>
//     <h1>{post.title}</h1>
//     <p>{post.body}</p>
//     <button onClick={ await createPost}>Create Post</button>
//   </div>
// );
// }


// async function fetchYoutubeData(yt_link) {
//   let re = /(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
  
//   let url = "https://www.googleapis.com/youtube/v3/videos?key=" + process.env.REACT_APP_YOUTUBE_API_KEY +"&part=snippet&id=" + yt_link.match(re)[7]
//   const response = await axios.get(url)
//   const data_ = await response.data
//   return {
//           "id": data_.items[0]?.id,
//           "title": data_.items[0]?.snippet?.title,
//           "published":data_.items[0]?.snippet?.publishedAt,
//           "image":data_.items[0]?.snippet?.thumbnails?.high?.url
//   }
//   //  await axios.get(url).then((response) => {
//   //     let data_  =  {
//   //         "id": response.data.items[0]?.id,
//   //         "title": response.data.items[0]?.snippet?.title,
//   //         "published":response.data.items[0]?.snippet?.publishedAt,
//   //         "image":response.data.items[0]?.snippet?.thumbnails?.high?.url
//   //     }
//   //     setPost(data_)
//   //     // console.log("gegeg", data_)
//   //     return  data_;
       
//   // });

//   // if (!post) return (
//   //   console.log("nothing set")
//   // )
