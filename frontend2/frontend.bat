@echo off
cd /d %~dp0

if /i not "%CD:~-9%"=="frontend2" (
    cd frontend2
)

if not exist node_modules (
    echo node_modules not found. Installing dependencies...
    npm install || exit /b 1
) else (
    echo Dependencies already installed.
)

echo Starting frontend...
npm run dev
