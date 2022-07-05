
import axios from "axios";
import {} from 'dotenv/config'


var data = JSON.stringify({
  "pinataOptions": {
    "cidVersion": 1
  },
  "pinataMetadata": {
    "name": "testing",
    "keyvalues": {
      "customKey": "customValue",
      "customKey2": "customValue2"
    }
  },
  "pinataContent": {
    "somekey": "somevalue"
  }
});

const API_KEY = process.env.REACT_APP_API_KEY
const API_SECRET = process.env.REACT_APP_API_SECRET

var config = {
  method: 'post',
  url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
  headers: { 
    'Content-Type': 'application/json', 
    'pinata_api_key': API_KEY,
    'pinata_secret_api_key': API_SECRET
  },
  data : data
};

const res = await axios(config);

console.log(res.data);