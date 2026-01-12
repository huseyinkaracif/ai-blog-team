@echo off
echo ====================================
echo   AI Crew Studio - Frontend
echo ====================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

:: Start dev server
echo.
echo Starting frontend at http://localhost:3000
echo Press Ctrl+C to stop
echo.
npm run dev
