import pytesseract
from flask import Blueprint, request, jsonify
from PIL import Image

from llm import parse_resume_with_llm

# Windows-only: set Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

resume_bp = Blueprint("resume", __name__)

@resume_bp.route("/parse", methods=["POST"])
def parse_resume():
    """
    Accepts resume image/PDF, extracts text using OCR,
    and structures it using Gemini LLM.
    """
    if "resume" not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files["resume"]
    image = Image.open(file)

    # OCR
    extracted_text = pytesseract.image_to_string(image)

    # LLM processing
    structured_data = parse_resume_with_llm(extracted_text)

    return jsonify({
        "parsed_resume": structured_data
    })
