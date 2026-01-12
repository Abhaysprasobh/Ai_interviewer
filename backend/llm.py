import json
import re
from google import genai
from google.genai import types 
from config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_question(context):
    """
    Generate an interview question based on candidate profile (Role + Skills + Exp).
    """
    # 1. Extract Data based on input type
    if isinstance(context, dict):
        # New Rich Context
        skills_list = context.get("skills", [])
        skills_str = ", ".join(skills_list) if isinstance(skills_list, list) else str(skills_list)
        
        role = context.get("role", "Software Engineer")
        experience = context.get("experience", "Not specified")
        # We can optionally use education if needed, but usually Role + Skills + Exp is enough for tech questions
    else:
        # Fallback (Legacy list support)
        skills_str = ", ".join(context)
        role = "Software Engineer"
        experience = "Entry Level"

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"""
            You are an expert technical interviewer conducting an interview for the role of **{role}**.
            
            Candidate Context:
            - Detected Skills: {skills_str}
            - Experience Level: {experience}

            Task:
            Ask exactly ONE technical interview question relevant to this role and experience level.
            - If the experience suggests a senior level, ask a system design or advanced concept question.
            - If entry level, focus on fundamentals.
            - Focus on the skills listed.
            
            Output Rules:
            - Do not provide an answer. 
            - Do not add introductory text like "Here is a question".
            - Just output the question string.
            """
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error generating question: {e}")
        return f"Tell me about your experience as a {role}."

def evaluate_answer(question, answer):
    """
    Evaluate an interview answer and return feedback
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"""
            Question: {question}
            Candidate Answer: {answer}
            
            Act as a strict technical interviewer.
            1. Evaluate if the answer is technically correct.
            2. Assign a score out of 10.
            3. Provide concise feedback on what was missing or how to improve.
            
            Keep the total response under 3 sentences.
            """
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error evaluating answer: {e}")
        return "Could not evaluate answer."

def parse_resume_with_llm(text):
    """
    Extract structured resume information as JSON
    """
    # 1. Debug: See if text is even coming in
    print(f"DEBUG: Input Text Length: {len(text)}")
    if not text.strip():
         return {"education": "Error: Empty File", "experience": "", "skills": []}

    prompt = f"""
    You are a resume parser. Extract the following from the text below:
    1. "education": A concise summary string (e.g., "B.Tech in CS, XYZ University").
    2. "experience": A concise summary string (e.g., "2 years as Frontend Dev at ABC Corp").
    3. "skills": A list of strings (technical skills only).

    Resume Text:
    {text[:4000]} 

    RETURN ONLY RAW JSON. Do not use Markdown formatting.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        # The new SDK with response_mime_type usually returns clean JSON, 
        # but we parse safely just in case.
        return json.loads(response.text)

    except Exception as e:
        print(f"ERROR Parsing Resume: {e}")
        # Fallback so Frontend doesn't crash
        return {
            "education": "Could not parse data",
            "experience": "Please try uploading a clearer PDF",
            "skills": ["General Engineering"]
        }