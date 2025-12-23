import wave, json
from vosk import Model, KaldiRecognizer
from flask import Blueprint, request, jsonify

speech_bp = Blueprint("speech", __name__)
model = Model("models/vosk-model-small-en-in-0.4")

@speech_bp.route("/transcribe", methods=["POST"])
def transcribe():
    audio = request.files["audio"]
    wf = wave.open(audio, "rb")

    rec = KaldiRecognizer(model, wf.getframerate())
    text = ""

    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            text += json.loads(rec.Result()).get("text", "")

    text += json.loads(rec.FinalResult()).get("text", "")
    return jsonify({"text": text})
