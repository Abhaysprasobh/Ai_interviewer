import pdfplumber
from PIL import Image
import pytesseract
import re



pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# ----------------------------
# Extract Resume Text
# ----------------------------

def extract_resume_text(filepath):

    text = ""

    try:
        if filepath.lower().endswith(".pdf"):

            with pdfplumber.open(filepath) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""

        else:

            image = Image.open(filepath)
            text = pytesseract.image_to_string(image)

    except Exception as e:
        print("Resume text extraction failed:", e)

    return text.lower()


# ----------------------------
# Skill Match
# ----------------------------
def skill_match_score(resume_text, required_skills):

    if not required_skills:
        return 50  # No skills required means everyone gets 50%

    matched = 0

    for skill in required_skills:
        if skill.lower() in resume_text:
            matched += 1

    return (matched / len(required_skills)) * 100


# ----------------------------
# Experience Score
# ----------------------------
def experience_score(resume_text):

    years = 0

    exp_match = re.findall(r'(\d+)\+?\s*(year|yr)', resume_text)

    if exp_match:
        years = max([int(x[0]) for x in exp_match])

    if years >= 5:
        return 100
    elif years >= 3:
        return 80
    elif years >= 1:
        return 60
    else:
        return 40


# ----------------------------
# Education Score
# ----------------------------
def education_score(resume_text):

    keywords = ["btech","b.e","bachelor","mtech","master","phd","engineering", "bachelor", "master", "doctorate", "university", "college", "degree", "graduation", "postgraduate", "undergraduate", "diploma", "associate", "mba", "ms", "ma", "bsc", "msc", "ba", "ma", "ph.d", "bachelor's", "master's", "doctorate", "b.tech", "m.tech", "b.e", "m.e"]

    for word in keywords:
        if word in resume_text:
            return 100

    return 60


# ----------------------------
# Final Resume Score
# ----------------------------
def calculate_resume_score(filepath, required_skills, job_description=""):

    resume_text = extract_resume_text(filepath) # pdfplunber or pytesseract

    skill_score = skill_match_score(resume_text, required_skills) # skill scoring

    exp_score = experience_score(resume_text) # experience scoring based on keyword list

    edu_score = education_score(resume_text) #

    final_score = (
        skill_score * 0.5 +
        exp_score * 0.3 +
        edu_score * 0.2
    )

    return {
        "resume_score": round(final_score,2),
        "skill_match": round(skill_score,2),
        "experience_match": exp_score,
        "education_match": edu_score
    }