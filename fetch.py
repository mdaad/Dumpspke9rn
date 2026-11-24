import requests

url = "https://api.penpencil.cc.cd/video/conversation/lecture"

params = {
    "lecture_id": "69ff18a7ef0d5bb3113d55b1",
    "lastSeenId": "6afda718b6a2c8bd05191fdb",
}

headers = {
    "authority": "api.penpencil.cc.cd",
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6LTEsInBob25lX251bWJlciI6ImJ5cGFzc18tMSIsInJvbGUiOiJieXBhc3MiLCJqdGkiOiJiNjVhNGMwYi0xZGU5LTQxOGEtOTE4OS0zZDg5YTUyMjQzNWMiLCJpYXQiOjE3OTU0NDU1NzQsImV4cCI6MTc5NTUzMTk3NH0.S1_-sfq-LU_4XW3aHeR25unDdZFRTR-ijbViQ5fX0o4",
    "origin": "https://pwlive.pages.dev",
    "referer": "https://pwlive.pages.dev/",
    "sec-ch-ua": '"Chromium";v="139", "Not;A=Brand";v="99"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
    "x-puzzle-nonce": "6",
    "x-request-signature": "5f872f6dda302c49604248ebb788561ffbcafd7d36e18b3467072d2a70a1032f",
    "x-request-timestamp": "1795445815335",
    "x-xsrf-token": "4c01c9ae8e9044a0bf53210f0017a36261811fa07be9916d5a398a2472bb8130",
}

response = requests.get(url, params=params, headers=headers)
print("Status:", response.status_code)
print("XSRF Token:", response.headers.get("x-xsrf-token"))

if response.status_code == 200:
    data = response.json()
    for comment in data.get("data", []):
        print(comment["createdBy"]["name"], "->", comment["text"])
else:
    print("Error:", response.text)