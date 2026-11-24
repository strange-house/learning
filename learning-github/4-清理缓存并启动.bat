@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Learning - clean cache start
echo ============================================
echo   Start Expo with CLEAN cache
echo ============================================
echo Use this after upgrading the SDK, or when the phone
echo still shows old code / a white screen.
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found.
  pause
  exit /b 1
)
if not exist node_modules (
  echo [i] Installing dependencies first...
  call npm install
)
echo.
echo Starting with --clear ...
call npx expo start --clear
pause
