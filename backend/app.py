from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import SECRET_KEY, JWT_SECRET_KEY

from auth import auth_bp
from interview import interview_bp
from speech import speech_bp
from resume import resume_bp
from jobs import jobs_bp
from applications import applications_bp


app = Flask(__name__)
app.config["SECRET_KEY"] = SECRET_KEY
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

CORS(app)
JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(interview_bp, url_prefix="/api/interview")
app.register_blueprint(speech_bp, url_prefix="/api/speech")
app.register_blueprint(resume_bp, url_prefix="/api/resume")

app.register_blueprint(jobs_bp)
app.register_blueprint(applications_bp)
@app.route("/")
def health():
    return {"status": "AI Interviewer Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)
