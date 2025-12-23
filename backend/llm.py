from google import genai
from config import GEMINI_API_KEY

# Initialize Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)


def generate_question(skills):
    """
    Generate an interview question based on candidate skills
    """
    context = ", ".join(skills)

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""
            You are an AI technical interviewer.
            Candidate skills: {context}.
            Ask ONE clear technical interview question.
            """
        )
        return response.text

    except Exception as e:
        return "Explain your strongest technical skill."


def evaluate_answer(question, answer):
    """
    Evaluate an interview answer and return feedback
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""
            Question: {question}
            Answer: {answer}

            Evaluate the answer.
            Give:
            - Score out of 10
            - Short feedback
            """
        )
        return response.text

    except Exception as e:
        return "Evaluation failed. Please try again."


def parse_resume_with_llm(text):
    """
    Extract structured resume information
    """
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"""
            Extract the following from this resume text:
            - Skills
            - Education
            - Experience

            Resume:
            {text}

            Return in bullet points.
            """
        )
        return response.text

    except Exception as e:
        return "Could not parse resume."
