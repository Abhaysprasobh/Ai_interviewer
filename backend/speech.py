import json
import wave
import io
from flask import Blueprint, request, jsonify
from vosk import Model, KaldiRecognizer
from pydub import AudioSegment # Library for audio conversion

speech_bp = Blueprint("speech", __name__)

# Load Model once (Global variable)
# Ensure you downloaded "vosk-model-small-en-in-0.4" and unzipped it in "models/"
try:
    model = Model("models/vosk-model-small-en-in-0.4")
    print("✅ Vosk Model Loaded Successfully")
except Exception as e:
    print(f"❌ Error Loading Vosk Model: {e}")
    print("   -> Did you download the model from https://alphacephei.com/vosk/models ?")
    model = None

@speech_bp.route("/transcribe", methods=["POST"])
def transcribe():
    if not model:
        return jsonify({"error": "Server Error: Speech Model not loaded"}), 500

    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    file = request.files["audio"]

    try:
        # 1. CONVERT AUDIO: WebM/Ogg -> WAV (PCM, 16kHz, Mono)
        # AudioSegment.from_file handles almost any format (mp3, webm, wav, etc.)
        audio = AudioSegment.from_file(file)
        
        # Force 16000Hz (Vosk optimal) and Mono (1 channel)
        audio = audio.set_frame_rate(16000).set_channels(1)
        
        # Export to a bytes buffer (in-memory file) so we don't save to disk
        wav_buffer = io.BytesIO()
        audio.export(wav_buffer, format="wav")
        wav_buffer.seek(0) # Reset cursor to start

        # 2. OPEN WITH WAVE
        wf = wave.open(wav_buffer, "rb")

        # 3. PROCESS WITH VOSK
        rec = KaldiRecognizer(model, wf.getframerate())
        rec.SetWords(True) # Optional: helps with accuracy
        
        results = []
        while True:
            data = wf.readframes(4000)
            if len(data) == 0:
                break
            if rec.AcceptWaveform(data):
                part_result = json.loads(rec.Result())
                results.append(part_result.get("text", ""))

        # Get final bit of speech
        final_result = json.loads(rec.FinalResult())
        results.append(final_result.get("text", ""))

        # Combine all parts
        full_text = " ".join([r for r in results if r])

        return jsonify({"text": full_text})

    except Exception as e:
        print(f"Transcription Error: {e}")
        return jsonify({"error": "Failed to process audio"}), 500