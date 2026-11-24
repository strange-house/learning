@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Learning - connect address
echo ============================================
echo   Type this into Expo Go:
echo ============================================
echo.
set IP=
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -notlike '127.*' -and $_.PrefixOrigin -ne 'WellKnown' } ^| Sort-Object -Property SkipAsSource, InterfaceIndex ^| Select-Object -First 1).IPAddress"') do set IP=%%i
if "%IP%"=="" (
  echo   [WARN] Could not detect the LAN IP automatically.
  echo   Run  ipconfig  and look for IPv4 Address.
  echo   Then type:  exp://YOUR-IP:8081
) else (
  echo      exp://%IP%:8081
)
echo.
echo How to use:
echo   1. Open Expo Go on your phone
echo   2. Tap  Enter URL manually
echo   3. Type the line above, then tap Connect
echo.
echo Phone and PC must be on the SAME WiFi.
echo If it still fails, run:  npx expo start --tunnel
echo.
pause
