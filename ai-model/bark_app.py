from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

labels = ["Alert", "Happy", "Fear", "Aggressive", "Attention"]

@app.route("/")
def home():
    return "Bark Analyzer API is running"

@app.route("/predict-bark", methods=["POST"])
def predict():
    file = request.files["audio"]
    result = random.choice(labels)
    return jsonify({"meaning": result})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
