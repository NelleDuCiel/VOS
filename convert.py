import pandas as pd
import json
import requests
import glob
import os

url = "https://goddenvos01.uantwerpen.be"
item = "/api/item"
itemImage = "/api/add/image"
cookies = {  # Get session via browser debugger > Network > Cookies
    "express:sess.sig": "PLtD2v7JvVECg4rgScYuPI_gfuY",
    "express:sess": "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjM3OGFjNDIxYzAwZGYwYmUxNmIwMjM1In19",
}
httpHeader = {"Content-Type": "application/json"}
items_file = "items.json"


df = pd.read_excel("../../siteScraping/products/FullProductDatabase_Food-R.xlsx")  # adapt
# print(df.columns)
data = []

# CONSTRUCT JSON Template
for c, row in df.iterrows():
    dic = {}
    dic["externalID"] = row["id"]
    # Nutritional Table
    dic["nutritionalTable"] = {}
    dic["nutritionalTable"]["kj"] = float(
        "".join(filter(lambda i: i.isdigit(), row["kj"]))
    )
    dic["nutritionalTable"]["kcal"] = float(
        "".join(filter(lambda i: i.isdigit(), row["kcal"]))
    )
    dic["nutritionalTable"]["totalFat"] = float(
        "".join(filter(lambda i: i.isdigit(), row["vet (g)"]))
    )
    dic["nutritionalTable"]["totalCarbohydrate"] = float(
        "".join(filter(lambda i: i.isdigit(), row["koolhydraten (g)"]))
    )
    dic["nutritionalTable"]["saturatedFat"] = float(
        "".join(filter(lambda i: i.isdigit(), row["verzadigde vetten (g)"]))
    )
    dic["nutritionalTable"]["salt"] = float(
        "".join(filter(lambda i: i.isdigit(), row["salt (g)"]))
    )
    dic["nutritionalTable"]["sugar"] = float(
        "".join(filter(lambda i: i.isdigit(), row["suiker (g)"]))
    )
    dic["nutritionalTable"]["protein"] = float(
        "".join(filter(lambda i: i.isdigit(), row["eiwitten (g)"]))
    )
    # dic["nutritionalTable"]["fiber"] = "".join(
    #     filter(lambda i: i.isdigit(), row["vezels (g)"])
    # )
    # CONTENT
    dic["content"] = {}
    dic["content"]["contentType"] = "solid"
    dic["content"]["amountInKG"] = 1  # check
    dic["content"]["displayAmount"] = []
    # SCORE
    dic["score"] = {}
    dic["score"]["amount"] = ord(row["NutriScore"].lower()) - 96
    dic["score"]["header"] = "NutriScore"
    dic["score"]["description"] = "NutriScore"
    dic["score"]["header"] = "Nutri-Score sorting"
    dic["score"]["maxValue"] = 6
    dic["score"]["minValue"] = 1
    # OTHER
    dic["label"] = ["6378de481c00df0be16b0280"]
    dic["niceness"] = row["NutriScore_value"]
    dic["name"] = row["description"]
    dic["brand"] = row["brand"]
    dic["description"] = []
    dic["netPrice"] = row["price"]
    dic["currency"] = "EUR"
    dic["amount"] = 100
    dic["vat"] = 0
    dic["ingredients"] = " ".join(row["ingredients"].split())
    dic["allergens"] = ""
    dic["taxes"] = []
    dic["owner"] = "egodden"
    dic["__v"] = 1

    data.append(dic)

images_list =sorted(glob.glob("../../siteScraping/products/*/images/*.avif"))
images_dict = {os.path.splitext(os.path.split(f)[1])[0]: f for f in images_list}

for row in data:
    # upload each item
    try:
        resp = requests.post(
            f"{url}{item}", headers=httpHeader, cookies=cookies, json=row
        )
        print(resp)
    except requests.exceptions.RequestException as e:
        print(e)
    files = {"image": open(f'{images_dict[row["externalID"]]}.jpg', "rb")}  # revositems aanpassen naar map waar images staan
    try:
        respImage = requests.post(
            f"{url}{itemImage}",
            files=files,
            cookies=cookies,
            data={"itemID": f'{resp.json()["_id"]}'},
        )
        print(respImage)
    except requests.exceptions.RequestException as e:
        print(e)
        break
# if successfully created
