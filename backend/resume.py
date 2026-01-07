from flask import Blueprint, request, jsonify
from PIL import Image
import pytesseract
import pdfplumber  # You need: pip install pdfplumber
import io

from llm import parse_resume_with_llm

# Windows-only Tesseract Configuration
# Note: Ensure Tesseract is actually installed at this path on your machine
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/parse", methods=["POST"])
def parse_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files["resume"]
    filename = file.filename.lower()
    extracted_text = ""

    try:
        # --- STRATEGY 1: IF PDF ---
        if filename.endswith(".pdf"):
            try:
                with pdfplumber.open(file) as pdf:
                    for page in pdf.pages:
                        extracted_text += (page.extract_text() or "") + "\n"
            except Exception as e:
                print(f"PDF reading failed: {e}")
                return jsonify({"error": "Corrupted or unreadable PDF"}), 400

        # --- STRATEGY 2: IF IMAGE (JPG, PNG, JPEG) ---
        else:
            try:
                image = Image.open(file)
                extracted_text = pytesseract.image_to_string(image)
            except Exception as e:
                print(f"OCR failed: {e}")
                return jsonify({"error": "Invalid image format"}), 400

        # --- FINAL CHECK ---
        if not extracted_text.strip():
            return jsonify({"error": "No text could be extracted from this resume."}), 400

        # --- LLM PROCESSING ---
        structured_data = parse_resume_with_llm(extracted_text)

        return jsonify({
            "parsed_resume": structured_data
        })

    except Exception as e:
        return jsonify({"error": f"Server Error: {str(e)}"}), 500