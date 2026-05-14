import json
from google import genai
from google.genai import types 
from config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

def generate_question(context, history=None):
    """
    Generate an interview question, expected answer, and keywords.
    """
    skills_list = context.get("skills", [])
    skills_str = ", ".join(skills_list) if isinstance(skills_list, list) else str(skills_list)
    role = context.get("role", "Software Engineer")
    experience = context.get("experience", "Entry Level")
    
    history_text = ""
    if history and len(history) > 0:
        history_text = "Previously Asked Questions:\n" + "\n".join([f"- {q}" for q in history])

    prompt = f"""
    You are an expert technical interviewer for a **{role}** role.
    Candidate Context:
    - Skills: {skills_str}
    - Experience: {experience}

    {history_text}

    Task: Ask exactly ONE new technical interview question. Do NOT ask any of the previously asked questions.
    
    CRITICAL CONSTRAINTS:
    1. Keep the question short and conversational (Maximum 2 sentences).
    
    Return ONLY a JSON object with the following keys:
    - "question": (string) The short interview question.
    - "expected_answer": (string) A concise, ideal answer to the question.
    - "keywords": (list of strings) 3 to 5 essential technical terms that MUST be in a correct answer.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        print(response)

        # 2. Added the Markdown Safety Net here to prevent crashes
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        return json.loads(text)
        
    except Exception as e:
        print(f"Error generating question: {e}")
        # Fallback JSON structure
        return {
            "question": f"Could you elaborate more on your experience with {skills_list[0] if skills_list else 'software development'}?",
            "expected_answer": "Candidate should discuss their hands-on experience and projects.",
            "keywords": ["experience", "projects", "development"]
        }
    
def evaluate_answer(question, answer):
    """
    Evaluate an answer and return structured JSON scores.
    """
    prompt = f"""
    Question: {question}
    Candidate Answer: {answer}
    
    Act as a strict technical interviewer. Evaluate the candidate's answer and return ONLY a JSON object with the following keys:
    - "technical_score": (integer 0-10) How technically correct is the answer?
    - "communication_score": (integer 0-10) How clear and well-structured is the explanation?
    - "feedback": (string) 1-2 concise sentences on what was missing or how to improve.
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        # Clean up the response just in case Gemini adds markdown formatting
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3].strip()
        elif text.startswith("```"):
            text = text[3:-3].strip()
            
        return json.loads(text)
        
    except Exception as e:
        print(f"❌ Error evaluating answer: {e}")
        # MUST return a dictionary to prevent the .get() crash in interview.py!
        return {
            "technical_score": 5, 
            "communication_score": 5, 
            "feedback": "Answer recorded, but AI evaluation failed."
        }
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
    
def generate_dashboard_summary(questions_data):
    """
    Generate a final summary paragraph based on the entire interview performance.
    """
    # Safe fallback if empty
    if not questions_data:
        return "Interview complete. Thank you for your time."

    prompt = f"""
    Review the following Q&A performance from a candidate's technical interview:
    {json.dumps(questions_data)}
    
    Provide a brief, professional 3-sentence summary highlighting their strongest technical area and one specific area where they need to improve. Return plain text.
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error generating summary: {e}")
        return "Interview complete. Thank you for your time."