@echo off
cd /d %~dp0

if not exist venv\Scripts\activate.bat (
    echo Creating virtual environment...
    python -m venv venv || pause & exit /b 1
    call venv\Scripts\activate.bat
    if exist req.txt (
        pip install -r req.txt
    ) else if exist requirements.txt (
        pip install -r requirements.txt
    ) else (
        echo No requirements file found
    )
) else (
    call venv\Scripts\activate.bat
)

python app.py
pause
