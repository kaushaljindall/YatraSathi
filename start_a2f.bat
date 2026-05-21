@echo off
echo ========================================================
echo Starting NVIDIA Audio2Face in Headless Mode
echo ========================================================
echo.
echo Make sure your NVIDIA Omniverse Audio2Face is installed.
echo This script will boot the REST API on http://localhost:8011
echo.

:: Note: You may need to update this path based on your exact A2F version and username.
:: For example, audio2face-2023.2.0 or similar.
set A2F_PATH="%USERPROFILE%\AppData\Local\ov\pkg\audio2face-2023.2.0"

if not exist %A2F_PATH% (
    echo WARNING: Could not find Audio2Face at %A2F_PATH%.
    echo Please edit start_a2f.bat to point to your exact Audio2Face installation folder!
    pause
    exit /b 1
)

cd /d %A2F_PATH%

echo Launching headless server...
call audio2face_headless.bat

pause
