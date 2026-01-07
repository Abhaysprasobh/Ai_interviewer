import json
import re
from google import genai
from google.genai import types # Import types for config
from config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_question(skills):
    """
    Generate an interview question based on candidate skills
    """
    context = ", ".join(skills)
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=f"""
            You are a technical interviewer.
            Candidate skills: {context}.
            Ask exactly ONE technical interview question.
            Do not provide an answer. Do not add introductory text like "Here is a question".
            """
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error generating question: {e}")
        return "Describe your experience with these skills."

def evaluate_answer(question, answer):
    """
    Evaluate an interview answer and return feedback
    """
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=f"""
            Question: {question}
            Answer: {answer}
            
            Evaluate the answer concisely.
            Provide a score out of 10 and specific feedback on what was missing.
            Keep it under 3 sentences.
            """
        )
        return response.text.strip()
    except Exception as e:
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
    1. "education": A concise summary string.
    2. "experience": A concise summary string.
    3. "skills": A list of strings.

    Resume Text:
    {text[:4000]} 

    RETURN ONLY RAW JSON.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        raw_output = response.text
        print(f"DEBUG: AI Raw Output:\n{raw_output}") # CHECK THIS IN TERMINAL

        # 2. Safety Cleaning: Remove markdown code blocks if present
        # Sometimes AI adds ```json ... ``` despite instructions
        cleaned_json = raw_output.replace("```json", "").replace("```", "").strip()
        
        # 3. Parse
        data = json.loads(cleaned_json)
        return data

    except Exception as e:
        print(f"ERROR Parsing Resume: {e}")
        # 4. Fallback: Return a valid object so Frontend doesn't crash
        return {
            "education": "Could not parse data",
            "experience": "Please try uploading a clearer PDF",
            "skills": ["Error"]
        }