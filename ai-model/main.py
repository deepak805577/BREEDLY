from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import requests
import os

app = Flask(__name__)
CORS(app)

# ── Bark Analyzer ─────────────────────────────────────────────────────────────
BARK_LABELS = ["Alert", "Happy", "Fear", "Aggressive", "Attention"]

@app.route("/predict-bark", methods=["POST"])
def predict_bark():
    # file = request.files["audio"]
    # TODO: replace random with real model prediction:
    # features = extract_features(file)
    # result = model.predict(features)
    result = random.choice(BARK_LABELS)
    return jsonify({"meaning": result})

# ── Dog Breed Detection ───────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict_breed():
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

# ── Health check ──────────────────────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({
        "status": "running",
        "endpoints": ["/predict-bark", "/predict"]
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
