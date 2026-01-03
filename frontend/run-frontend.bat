@echo off
cd /d %~dp0

if not exist node_modules (
    echo node_modules not found. Installing dependencies...
    npm install || pause & exit /b 1
) else (
    echo Modules already installed.
)

npm start
pause
