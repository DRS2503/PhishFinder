@echo off
echo Starting PhishFinder Backend...

cd Backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Please make sure Python is installed and in PATH
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies if requirements.txt exists
if exist "requirements.txt" (
    echo Installing Python dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        echo Trying to install Flask-CORS separately...
        pip install Flask-CORS
        if errorlevel 1 (
            echo ERROR: Failed to install Flask-CORS
            pause
            exit /b 1
        )
    )
    echo Dependencies installed successfully!
) else (
    echo WARNING: requirements.txt not found, installing basic Flask dependencies...
    pip install Flask Flask-CORS
)

echo Starting Flask server...
echo Backend will be available at: http://localhost:5000
echo.

REM Run the Flask app using Python module execution
set PYTHONPATH=%CD%
python -m app.main
pause 