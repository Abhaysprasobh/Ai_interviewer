import os
import wave
import json
from vosk import Model, KaldiRecognizer
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

# ✅ API prefix matches tests & docs
speech_bp = Blueprint("speech", __name__, url_prefix="/api/speech")

# ✅ Absolute path to model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "vosk-model-small-en-in-0.4")

model = Model(MODEL_PATH)


@speech_bp.route("/recognize", methods=["POST"])
@jwt_required()
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio = request.files["audio"]

    try:
        wf = wave.open(audio, "rb")
    except wave.Error:
        return jsonify({"error": "Invalid WAV file"}), 400

    # Ensure WAV format is supported
    if wf.getnchannels() != 1 or wf.getsampwidth() != 2:
        return jsonify({"error": "Audio must be mono PCM WAV"}), 400

    rec = KaldiRecognizer(model, wf.getframerate())
    text = ""

    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            text += json.loads(rec.Result()).get("text", "") + " "

    text += json.loads(rec.FinalResult()).get("text", "")

    return jsonify({"text": text.strip()}), 200
