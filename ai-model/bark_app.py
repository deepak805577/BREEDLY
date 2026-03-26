from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

LABELS = ["Alert", "Happy", "Fear", "Aggressive", "Attention"]

CONFIDENCE_RANGES = {
    "Alert":      (72, 94),
    "Happy":      (80, 97),
    "Fear":       (65, 88),
    "Aggressive": (70, 92),
    "Attention":  (60, 85),
}

ALLOWED_MIMETYPES = [
    "audio/webm",
    "audio/wav",
    "audio/mpeg",
    "audio/mp4",
    "audio/ogg",
    "audio/x-m4a",
    "application/octet-stream"
]

MAX_FILE_SIZE_MB = 10


@app.route("/")
def home():
    return jsonify({
        "status": "ok",
        "service": "Bark Analyser API"
    })


@app.route("/predict-bark", methods=["POST"])
def predict():
    # ── Check file exists ──
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    file = request.files["audio"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # ── Debug logs (VERY IMPORTANT) ──
    print("Received file:", file.filename)
    print("MIME TYPE:", file.content_type)

    # ── MIME validation (FIXED) ──
    mime = file.content_type or ""
    if not any(mime.startswith(t) for t in ALLOWED_MIMETYPES):
        return jsonify({
            "error": f"Unsupported file type '{mime}'"
        }), 415

    # ── File size validation ──
    audio_bytes = file.read()
    file.seek(0)  # IMPORTANT FIX

    size_mb = len(audio_bytes) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        return jsonify({
            "error": f"File too large ({size_mb:.1f} MB)"
        }), 413

    # ── Fake AI prediction (replace later with real ML) ──
    meaning = random.choice(LABELS)
    lo, hi = CONFIDENCE_RANGES[meaning]
    confidence = round(random.uniform(lo, hi), 1)

    return jsonify({
        "meaning": meaning,
        "confidence": confidence,
        "labels": LABELS
    })


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)