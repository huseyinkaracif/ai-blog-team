@echo off
echo ====================================
echo   AI Crew Studio - Backend Server
echo ====================================
echo.

:: Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

:: Activate virtual environment
call venv\Scripts\activate

:: Install dependencies
echo Installing dependencies...
pip install -r requirements.txt -q

:: Check for API key
if "%GOOGLE_API_KEY%"=="" (
    echo.
    echo WARNING: GOOGLE_API_KEY is not set!
    echo Please set your API key:
    echo   set GOOGLE_API_KEY=your_key_here
    echo.
)

:: Start the server
echo.
echo Starting server at http://localhost:8000
echo Press Ctrl+C to stop
echo.
python main.py
