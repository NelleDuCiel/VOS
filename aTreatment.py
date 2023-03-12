import pandas as pd
import json
import requests
import glob
import os
import numpy as np

url = "https://goddenvos01.uantwerpen.be"
item = "/api/item"
itemImage = "/api/add/image"
cookies = {  # Get session via browser debugger > Network > Cookies
    "express:sess.sig": "PLtD2v7JvVECg4rgScYuPI_gfuY",
    "express:sess": "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjM3OGFjNDIxYzAwZGYwYmUxNmIwMjM1In19",
}
httpHeader = {"Content-Type": "application/json"}
items_file = "items.json"


# df = pd.read_excel("../../siteScraping/products/FullProductDatabase_Food-R.xlsx")
df1 = pd.read_excel("../FullProductDatabase_Food-R.xlsx").iloc[np.arange(30) * 10]
df2 = pd.read_excel("../FullProductDatabase_nonFood-R.xlsx").iloc[np.arange(10) * 10]

# df = pd.concat([df.iloc[np.arange(10) * 10], df2.iloc[np.arange(10) * 10]])
# print(df.columns)
data = []
nsdict = {
    "A": "6378de161c00df0be16b025d",
    "B": "6378de221c00df0be16b0262",
    "C": "6378de2f1c00df0be16b0267",
    "D": "6378de3d1c00df0be16b0275",
    "E": "6378de481c00df0be16b0280",
    "F": "63ee092cb4b8ac09c7639115",
}

# CONSTRUCT JSON Template
"""
Hier vind je alle velden van je Excel en van de JSON. De velden van je Excel zijn row[<veldnaam>], die van de JSON zijn
dic[<veldnaam>]. 
"""
df = df1
for c, row in df.iterrows():
    dic = {}
    dic["externalID"] = row["id"]
    # Nutritional Table
    dic["nutritionalTable"] = {}
    if "kj" in df.columns:
        dic["nutritionalTable"]["kj"] = row["kj"]
    else:
        dic["nutritionalTable"]["kj"] = 0
    if "kcal" in df.columns:
        dic["nutritionalTable"]["kcal"] = row["kcal"]
    else:
        dic["nutritionalTable"]["kcal"] = 0
    if "vet" in df.columns:
        dic["nutritionalTable"]["totalFat"] = row["vet"]
    else:
        dic["nutritionalTable"]["totalFat"] = 0
    if "koolhydraten" in df.columns:
        dic["nutritionalTable"]["totalCarbohydrate"] = row["koolhydraten"]
    else:
        dic["nutritionalTable"]["totalCarbohydrate"] = 0
    if "verzadigdeVetten" in df.columns:
        dic["nutritionalTable"]["saturatedFat"] = row["verzadigdeVetten"]
    else:
        dic["nutritionalTable"]["saturatedFat"] = 0
    if "zout" in df.columns:
        dic["nutritionalTable"]["salt"] = row["zout"]
    else:
        dic["nutritionalTable"]["salt"] = 0
    if "suiker" in df.columns:
        dic["nutritionalTable"]["sugar"] = row["suiker"]
    else:
        dic["nutritionalTable"]["sugar"] = 0
    if "eiwitten" in df.columns:
        dic["nutritionalTable"]["protein"] = row["eiwitten"]
    else:
        dic["nutritionalTable"]["protein"] = 0
    # dic["nutritionalTable"]["fiber"] = "".join(
    #     filter(lambda i: i.isdigit(), row["vezels"])
    # )  # Geen fiber entry mogelijk in de JSON
    # CONTENT
    dic["content"] = {}
    dic["content"]["contentType"] = "solid"
    dic["content"]["amountInKG"] = 1  # check
    dic["content"]["displayAmount"] = 1
    # SCORE
    dic["score"] = {}
    dic["score"]["amount"] = (
        ord(row["NutriScore"].lower()) - 96
    )  # NutriScore getal = # alfabet
    dic["score"]["header"] = "NutriScore"
    dic["score"]["description"] = "NutriScore"
    dic["score"]["header"] = "Nutri-Score sorting"
    dic["score"]["maxValue"] = 6
    dic["score"]["minValue"] = 1
    # OTHER
    dic["label"] = nsdict[row["NutriScore"]]
    dic["niceness"] = row["NutriScore_value"]
    dic["name"] = row["description"]
    dic["brand"] = row["brand"]
    # dic["description"] = []
    dic["netPrice"] = row["price"]
    dic["currency"] = "EUR"
    dic["amount"] = 100  # Deze moet je nog zetten naar het overeenkomstig veld in Excel
    dic["vat"] = 0
    dic["baseAttributes"] = []
    if "ingredients" in df.columns:
        dic["nutritionalTable"]["ingredients"] = " ".join(row["ingredients"].split())
    else:
        dic["nutritionalTable"]["ingredients"] = "Not applicable"
    dic["allergens"] = ""
    dic["taxes"] = []
    dic["owner"] = "egodden"
    dic["__v"] = 1
    taglist = []
    if "subbrand" in df.columns:
        if len(row["subbrand"]) > 0:
            taglist.append(row["subbrand"].strip())
    if "name" in df.columns:
        if len(row["name"]) > 0:
            taglist.append(row["name"].strip())
    if "nameElke" in df.columns:
        if len(row["nameElke"]) > 0:
            taglist.append(row["nameElke"].strip())
    dic["tags"] = taglist

    data.append(dic)

# images_list = sorted(glob.glob("../../siteScraping/products/*/images/*.avif"))
# images_dict = {os.path.splitext(os.path.split(f)[1])0: f for f in images_list}

for row in data:
    # upload each item
    try:
        resp = requests.post(
            f"{url}{item}", headers=httpHeader, cookies=cookies, json=row
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
