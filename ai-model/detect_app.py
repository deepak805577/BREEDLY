from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Dog Breed Detection API is running"

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["image"]

    url = "https://api.thedogapi.com/v1/images/search"
    files = {
        "file": (file.filename, file.stream, file.mimetype)
    }

    response = requests.post(url, files=files)
    data = response.json()

    if len(data) > 0 and "breeds" in data[0]:
        breed = data[0]["breeds"][0]["name"]
    else:
        breed = "Breed not detected"

    return jsonify({"breed": breed})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
