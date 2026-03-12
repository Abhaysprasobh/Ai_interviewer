from gtts import gTTS
import whisper
from pydub.effects import normalize
import os
import io
from flask import Blueprint, request, jsonify, send_file
import speech_recognition as sr

speech_bp = Blueprint("speech", __name__)

print("⚙️ Loading OpenAI Whisper model (this takes a few seconds)...")
try:
    model = whisper.load_model("medium.en")
    print("✅ Whisper Model Loaded Successfully")
except Exception as e:
    print(f"❌ Failed to load Whisper: {e}")
    model = None

@speech_bp.route("/transcribe", methods=["POST"])
def transcribe():
    print("\n--- 🎤 New Whisper Transcription Request ---")
    
    if not model:
         return jsonify({"error": "Model not loaded"}), 500

    if "audio" not in request.files:
        return jsonify({"error": "No file"}), 400

    file = request.files["audio"]
    
    temp_path = "temp_interview_audio.webm"
    file.save(temp_path)

    try:
        print("🔍 Transcribing full audio with Whisper...")
        
        result = model.transcribe(temp_path, language="en", fp16=False)
        transcript = result["text"].strip()
        
        print(f"✅ Result: '{transcript}'")
 
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return jsonify({"text": transcript})
        
    except Exception as e:
        print(f"❌ Whisper Error: {e}")
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500
@speech_bp.route("/tts", methods=["POST"])
def text_to_speech():
    """
    Converts text (like the AI's next question) into an audio file.
    """
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "No text provided for synthesis"}), 400

    try:
        print(f"🔊 Generating audio for: {text[:50]}...")
        
        tts = gTTS(text=text, lang='en', tld='co.in') 
        
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)

        return send_file(
            audio_buffer, 
            mimetype="audio/mpeg", 
            as_attachment=False, 
            download_name="question.mp3"
        )

    except Exception as e:
        print(f"❌ TTS Error: {e}")
        return jsonify({"error": "Failed to generate audio"}), 500