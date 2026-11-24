@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Learning - build APK
echo ============================================
echo   Learning   build Android APK (cloud)
echo ============================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)
set EAS_NO_VCS=1

if not exist "node_modules" (
  echo [1/4] Installing dependencies...
  call npm install
  if errorlevel 1 goto NPMFAIL
) else (
  echo [1/4] Dependencies already installed.
)

echo [2/4] Checking EAS CLI...
call eas --version >nul 2>nul
if errorlevel 1 (
  echo       Installing EAS CLI (first time only)...
  call npm install -g eas-cli
)
call eas --version >nul 2>nul
if errorlevel 1 goto EASFAIL

echo [3/4] Checking login...
call eas whoami >nul 2>nul
if errorlevel 1 (
  echo       Not logged in. Sign in in the browser that opens.
  call eas login
  if errorlevel 1 goto EASFAIL
) else (
  echo       Already logged in.
)

echo [4/4] Starting cloud build (10-20 min). Do NOT close.
echo.
call eas build -p android --profile preview
echo.
echo ============================================================
echo   BUILD STEP FINISHED
echo ============================================================
echo   SUCCESS is shown by:  Build finished
echo   An 'adb executable' error at the end is harmless - ignore it.
echo   Your APK is already built.
echo.
pause
exit /b 0

:NPMFAIL
echo [ERROR] npm install failed.
echo   Try: npm config set registry https://registry.npmmirror.com
pause
exit /b 1

:EASFAIL
echo [ERROR] EAS CLI not available. Try: npm install -g eas-cli
pause
exit /b 1
