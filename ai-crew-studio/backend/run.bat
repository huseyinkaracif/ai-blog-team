@echo off
echo ====================================
echo   AI Crew Studio - Backend Server
echo ====================================
echo.

:: Activate virtual environment
call venv\Scripts\activate

:: Install dependencies
echo Installing dependencies...
pip install -r requirements.txt -q

:: Start the server
echo.
echo Starting server at http://localhost:8000
echo Press Ctrl+C to stop
echo.
python main.py
