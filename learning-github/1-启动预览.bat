@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Learning - preview
echo ============================================
echo   Learning   one-click start
echo ============================================
echo.
where node >nul 2>nul
if errorlevel 1 goto NONODE
for /f "delims=" %%v in ('node -v') do set NODEVER=%%v
echo [OK] Node.js %%NODEVER%%
echo.
if exist "node_modules" goto RUN
echo [1/2] First run: installing dependencies (3-10 min)...
call npm install
if errorlevel 1 goto NPMFAIL
echo.
echo [2/2] Dependencies installed.
pause

:RUN
echo Starting Expo dev server...
echo.
echo   Install 'Expo Go' on your phone, then scan the QR code.
echo   Keep the phone and this PC on the SAME WiFi.
echo.
call npx expo start
pause
exit /b 0

:NONODE
echo [ERROR] Node.js not found. Install from https://nodejs.org
pause
exit /b 1

:NPMFAIL
echo [ERROR] npm install failed.
echo   Try: npm config set registry https://registry.npmmirror.com
pause
exit /b 1
