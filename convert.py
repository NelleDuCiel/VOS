import pandas as pd
import json
import requests

url = "https://goddenvos01.uantwerpen.be/"
item = "/api/item"
itemImage = "/api/add/image"
cookies = {"express:sess.sig": "bartc_test", "express:sess": "bartc_test"}
httpHeader = {"Content-Type": "application/json"}
items_file = "items.json"


df = pd.read_excel("VOS_productlist.xlsx")
print(df.columns)
with open("pepersalami.json", "r+") as f:
    data = json.load(f)

# upload each item
try:
    resp = requests.post(f"{url}{item}", headers=httpHeader, json=data)
except requests.exceptions.RequestException as e:
    print(e)

# if successfully created
