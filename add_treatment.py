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

all_items = json.load("allItems.json")
treatment = json.load("treatment_template.json")

try:
    resp = requests.post(f"{url}{item}", headers=httpHeader, cookies=cookies, json=treatment)
    print(resp)
except requests.exceptions.RequestException as e:
    print(e)
