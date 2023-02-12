import pandas as pd
import json
import requests

url = "https://goddenvos01.uantwerpen.be"
item = "/api/item"
itemImage = "/api/add/image"
cookies = {  # Get session via browser debugger > Network > Cookies
    "express:sess.sig": "PLtD2v7JvVECg4rgScYuPI_gfuY",
    "express:sess": "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjM3OGFjNDIxYzAwZGYwYmUxNmIwMjM1In19",
}
httpHeader = {"Content-Type": "application/json"}
items_file = "items.json"


df = pd.read_excel("AllProducts_AF.xlsx")
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
    dic["nutritionalTable"]["salt"] = 0
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
    dic["content"]["amountInKG"] = 0.1
    dic["content"]["displayAmount"] = "g"
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
    dic["niceness"] = 1
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

for row in data:
    # upload each item
    try:
        resp = requests.post(
            f"{url}{item}", headers=httpHeader, cookies=cookies, json=row
        )
    except requests.exceptions.RequestException as e:
        print(e)
    files = {"image": open(f'revositems/{row["externalID"]}.jpg', "rb")}
    try:
        respImage = requests.post(
            f"{url}{itemImage}",
            files=files,
            cookies=cookies,
            data={"itemID": f'{resp.json()["_id"]}'},
        )
    except requests.exceptions.RequestException as e:
        print(e)
        break
# if successfully created
