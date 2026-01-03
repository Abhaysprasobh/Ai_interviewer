@echo off
cd backend || (echo Backend folder not found & pause & exit /b 1)

if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv || (echo Failed to create venv & pause & exit /b 1)
    call venv\Scripts\activate.bat
    if exist "req.txt" (
        pip install -r req.txt
    ) else if exist "requirements.txt" (
        pip install -r requirements.txt
    ) else (
        echo No requirements file found. Pls contact the developer
    )
) else (
    call venv\Scripts\activate.bat
)

python app.py
pause
