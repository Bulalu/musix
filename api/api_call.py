from pickletools import bytes1
from googleapiclient.discovery import build
import requests
import json
import os
from pinatapy import PinataPy
from urllib.parse import urlparse, parse_qs




yt_link = "https://www.youtube.com/watch?v=D9_fuL0rJKg&list=RDD9_fuL0rJKg&start_radio=1&rv=D9_fuL0rJKg&t=0"
url_data = urlparse(yt_link)
query = parse_qs(url_data.query)
video_id = query["v"][0]

print(f"video ID: {video_id}")

# API_KEY = os.getenv("YOUTUBE_API_KEY")
# youtube = build("youtube", "v3", developerKey=API_KEY)


# # # youtube query
# request = youtube.videos().list(
#         part="snippet",
#         id=video_id
#     )
# response = request.execute()

# content = response["items"][0]["snippet"]
# published = content["publishedAt"].split("T")[0]
# title = content["title"]
# description=content["description"]
# img_src = content["thumbnails"]["high"]["url"]
# print(f"published {published}")
# print(f"title {title}")
# print(f"Image source:{img_src}")

# # # upload to pinatta and get IPFS

# payload = {
#     "name": title,
#     "keyvalues": {
#       "published": published,
#       "title": title,
#       "image": img_src,
#       "id": video_id,
#       "link":yt_link
#     }
#   }


# pinata = PinataPy(os.getenv("PINATA_API_KEY"), os.getenv("PINATA_API_SECRET"))
# response = pinata.pin_json_to_ipfs(json_to_pin=payload)
# # cid = "QmZSvz8s9pMEAMhzy1tzunU2xBP2g25de48y6buM8ssYZW"
# print(response)


from web3 import Web3
cid = b"QmZSvz8s9pMEAMhzy1tzunU2xBP2g25de48y6buM8ssYZW"
cid = "elisha bulalu"
print("HEX BYTES", cid.encode('utf-8'))

print(Web3.toHex(b"elisha bulalu"))
print(type(cid.encode('utf-8')))
bytes1(cid)
