@echo off

cd /d %~dp0


if /i not "%CD:~-9%"=="backend" (
    cd backend
)

REM create venv only once
if not exist venv\Scripts\activate.bat (
    echo Creating virtual environment...
    python -m venv venv || exit /b 1
)

call venv\Scripts\activate.bat

REM install only if NOT already done
if not exist venv\.installed (
    if exist req.txt (
        pip install -r req.txt
        echo done > venv\.installed
    )
)

python app.py
