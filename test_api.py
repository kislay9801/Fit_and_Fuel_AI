import urllib.request
import json

url = "http://localhost:8000/"
try:
    with urllib.request.urlopen(url) as response:
        print("Success:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code, e.read().decode('utf-8'))
except urllib.error.URLError as e:
    print("URLError:", e.reason)
