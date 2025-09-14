@echo off
echo Starting Smart QR Attendance Frontend...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    echo VITE_API_URL=http://localhost:8008/api > .env
    echo.
)

echo Starting development server...
echo Frontend will be available at: http://localhost:5173
echo.
npm run dev

pause
