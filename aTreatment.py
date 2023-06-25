import pandas as pd
import json
import requests
import glob
import os
import numpy as np

url = "https://goddenvos01.uantwerpen.be"
item = "/api/treatment"
cookies = {  # Get session via browser debugger > Network > Cookies
    "express:sess.sig": "PLtD2v7JvVECg4rgScYuPI_gfuY",
    "express:sess": "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjM3OGFjNDIxYzAwZGYwYmUxNmIwMjM1In19",
}
httpHeader = {"Content-Type": "application/json"}

# all_items = json.load(open("allItems_renew.json", "rb"))
all_items = json.load(open("No-label-items.json", "rb"))
treatment = json.load(open("treatment_template.json", "rb"))

# images_list = sorted(glob.glob("../../siteScraping/products/*/images/*.avif"))
# images_dict = {os.path.splitext(os.path.split(f)[1])0: f for f in images_list}
dict_NS = {
    "6378de161c00df0be16b025d": ["Nutri-Score A", 0],
    "6378de221c00df0be16b0262": ["Nutri-Score B", 1],
    "6378de2f1c00df0be16b0267": ["Nutri-Score C", 2],
    "6378de3d1c00df0be16b0275": ["Nutri-Score D", 3],
    "6378de481c00df0be16b0280": ["Nutri-Score E", 4],
    "64610b1e24035cb258f7c65e": ["Nutri-Score F", 5],
}
nsdict_nolabel = {
    "648350affeb1ad3a19b1717a": ["Nutri-Score A", 0],
    "6483503bfeb1ad3a19b17177": ["Nutri-Score B", 1],
    "648350c5feb1ad3a19b1717b": ["Nutri-Score C", 2],
    "6483508ffeb1ad3a19b17179": ["Nutri-Score D", 3],
    "648350d2feb1ad3a19b1717c": ["Nutri-Score E", 4],
    "64610b1e24035cb258f7c65e": ["Nutri-Score F", 5],
}
# keylist = [i["name"] for i in treatment["filters"][1]["tree"]]
for row in all_items:
    treatment["filters"][0]["tree"][nsdict_nolabel[row["label"][0]][1]]["items"].append(
        row["_id"]
    )
# treatment["filters"][1]["tree"][keylist.index(row["tags"][0])]["items"].append(
#     row["_id"]
# )
treatment["items"] = all_items
# upload each item
try:
    resp = requests.post(
        f"{url}{item}", headers=httpHeader, cookies=cookies, json=treatment
    )
    print(resp)
except requests.exceptions.RequestException as e:
    print(e)
# files = {
#     "image": open(f'{images_dict[row["externalID"]]}.jpg', "rb")
# }  # revositems aanpassen naar map waar images staan
# try:
#     respImage = requests.post(
#         f"{url}{itemImage}",
#         files=files,
#         cookies=cookies,
#         data={"itemID": f'{resp.json()["_id"]}'},
#     )
#     print(respImage)
# except requests.exceptions.RequestException as e:
#     print(e)
#     break
# if successfully created
