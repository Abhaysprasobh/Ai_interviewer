# import json
# import wave
# import io
# from flask import Blueprint, request, jsonify
# from vosk import Model, KaldiRecognizer
# from pydub import AudioSegment # Library for audio conversion

# speech_bp = Blueprint("speech", __name__)

# # Load Model once (Global variable)
# # Ensure you downloaded "vosk-model-small-en-in-0.4" and unzipped it in "models/"
# try:
#     model = Model("models/vosk-model-small-en-in-0.4")
#     print("✅ Vosk Model Loaded Successfully")
# except Exception as e:
#     print(f"❌ Error Loading Vosk Model: {e}")
#     print("   -> Did you download the model from https://alphacephei.com/vosk/models ?")
#     model = None

# @speech_bp.route("/transcribe", methods=["POST"])
# def transcribe():
#     if not model:
#         return jsonify({"error": "Server Error: Speech Model not loaded"}), 500

#     if "audio" not in request.files:
#         return jsonify({"error": "No audio file provided"}), 400

#     file = request.files["audio"]

#     try:
#         # 1. CONVERT AUDIO: WebM/Ogg -> WAV (PCM, 16kHz, Mono)
#         # AudioSegment.from_file handles almost any format (mp3, webm, wav, etc.)
#         audio = AudioSegment.from_file(file)
        
#         # Force 16000Hz (Vosk optimal) and Mono (1 channel)
#         audio = audio.set_frame_rate(16000).set_channels(1)
        
#         # Export to a bytes buffer (in-memory file) so we don't save to disk
#         wav_buffer = io.BytesIO()
#         audio.export(wav_buffer, format="wav")
#         wav_buffer.seek(0) # Reset cursor to start

#         # 2. OPEN WITH WAVE
#         wf = wave.open(wav_buffer, "rb")

#         # 3. PROCESS WITH VOSK
#         rec = KaldiRecognizer(model, wf.getframerate())
#         rec.SetWords(True) # Optional: helps with accuracy
        
#         results = []
#         while True:
#             data = wf.readframes(4000)
#             if len(data) == 0:
#                 break
#             if rec.AcceptWaveform(data):
#                 part_result = json.loads(rec.Result())
#                 results.append(part_result.get("text", ""))

#         # Get final bit of speech
#         final_result = json.loads(rec.FinalResult())
#         results.append(final_result.get("text", ""))

#         # Combine all parts
#         full_text = " ".join([r for r in results if r])

#         return jsonify({"text": full_text})

#     except Exception as e:
#         print(f"Transcription Error: {e}")
#         return jsonify({"error": "Failed to process audio"}), 500

# @speech_bp.route("/transcribe", methods=["POST"])
# def transcribe():
#     if not model:
#         return jsonify({"error": "Model not loaded"}), 500

#     if "audio" not in request.files:
#         print("❌ No audio file in request")
#         return jsonify({"error": "No audio file"}), 400

#     file = request.files["audio"]
    
#     # DEBUG 1: Check File Size
#     file.seek(0, os.SEEK_END)
#     size = file.tell()
#     file.seek(0) # Reset cursor
#     print(f"📥 Received Audio File: {file.filename} | Size: {size} bytes")

#     if size == 0:
#         return jsonify({"text": ""}), 200

#     try:
#         # DEBUG 2: Check Conversion
#         print("⚙️  Converting audio with pydub...")
#         audio = AudioSegment.from_file(file)
#         print(f"   -> Original: {audio.frame_rate}Hz, {audio.channels} channels")
        
#         audio = audio.set_frame_rate(16000).set_channels(1)
#         print(f"   -> Converted: 16000Hz, 1 channel")

#         wav_buffer = io.BytesIO()
#         audio.export(wav_buffer, format="wav")
#         wav_buffer.seek(0)

#         wf = wave.open(wav_buffer, "rb")
#         rec = KaldiRecognizer(model, wf.getframerate())
#         rec.SetWords(True)

#         print("🔍 Scanning frames with Vosk...")
#         results = []
#         frames_read = 0
        
#         while True:
#             data = wf.readframes(4000)
#             if len(data) == 0:
#                 break
#             frames_read += 1
#             if rec.AcceptWaveform(data):
#                 part = json.loads(rec.Result())
#                 print(f"   -> Partial: {part.get('text', '')}")
#                 results.append(part.get("text", ""))

#         final = json.loads(rec.FinalResult())
#         print(f"   -> Final: {final.get('text', '')}")
#         results.append(final.get("text", ""))

#         full_text = " ".join([r for r in results if r])
#         print(f"✅ Full Transcript: '{full_text}'")

#         return jsonify({"text": full_text})

#     except Exception as e:
#         print(f"❌ TRANSCRIPTION ERROR: {e}")
#         # Common error: pydub fails if ffmpeg is missing
#         if "FileNotFound" in str(e) or "ffmpeg" in str(e):
#              print("💡 HINT: FFmpeg might not be installed or in PATH.")
#         return jsonify({"error": "Processing failed"}), 500


import wave
import json
# from flask import Blueprint, request, jsonify, send_file
from gtts import gTTS
import whisper
from pydub.effects import normalize
import os
import io
from flask import Blueprint, request, jsonify
from pydub import AudioSegment
import speech_recognition as sr

speech_bp = Blueprint("speech", __name__)

# Initialize the Google Recognizer
# recognizer = sr.Recognizer()

# Load Model
# try:
#     # Double check this path matches your folder name exactly
#     model = Model("models/vosk-model-small-en-in-0.4")
#     print("✅ Model Loaded")
# except Exception as e:
#     print(f"❌ Model Failed: {e}")
#     model = None

# @speech_bp.route("/transcribe", methods=["POST"])
# def transcribe():
#     print("\n--- 🎤 New Google Transcription Request ---")
    
#     if "audio" not in request.files:
#         print("❌ No audio file in request")
#         return jsonify({"error": "No file"}), 400

#     file = request.files["audio"]
#     print(f"📥 Received File: {file.filename}")

#     try:
#         # 1. Convert WebM/Ogg to standard WAV using pydub
#         print("⚙️  Converting audio to WAV...")
#         audio = AudioSegment.from_file(file)
        
#         wav_buffer = io.BytesIO()
#         # Export as a standard wav file
#         audio.export(wav_buffer, format="wav")
#         wav_buffer.seek(0)
        
#         # 2. Process with Google Speech Recognition
#         print("🔍 Sending to Google Speech API...")
#         with sr.AudioFile(wav_buffer) as source:
#             # Read the entire audio file
#             audio_data = recognizer.record(source)
            
#             try:
#                 # recognize_google is free and doesn't require an API key
#                 # Setting language to 'en-IN' optimizes for Indian English accents
#                 transcript = recognizer.recognize_google(audio_data, language="en-IN")
#                 print(f"✅ Result: '{transcript}'")
#                 return jsonify({"text": transcript})
                
#             except sr.UnknownValueError:
#                 print("❌ Google Speech Recognition could not understand audio")
#                 return jsonify({"text": ""}) # Return empty string if it's just silence/mumbling
#             except sr.RequestError as e:
#                 print(f"❌ Could not request results from Google; {e}")
#                 return jsonify({"error": "API Unavailable"}), 500

#     except Exception as e:
#         print(f"❌ General Error: {e}")
#         return jsonify({"error": str(e)}), 500

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
    
    # Whisper requires an actual file path on the disk to process, 
    # so we save the WebM file temporarily.
    temp_path = "temp_interview_audio.webm"
    file.save(temp_path)

    try:
        print("🔍 Transcribing full audio with Whisper...")
        
        # Whisper automatically handles the WebM format and any length of audio!
        result = model.transcribe(temp_path, language="en", fp16=False)
        transcript = result["text"].strip()
        
        print(f"✅ Result: '{transcript}'")
        
        # Clean up the temporary file so we don't waste disk space
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return jsonify({"text": transcript})
        
    except Exception as e:
        print(f"❌ Whisper Error: {e}")
        # Ensure cleanup even if it fails
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
        
        # tld='co.in' gives the AI a slight Indian accent, which might 
        # feel more natural for users in your region. 
        # You can change it to 'com' for a standard US accent.
        tts = gTTS(text=text, lang='en', tld='co.in') 
        
        # Save to an in-memory buffer so we don't clutter your hard drive with mp3s
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