@echo off
setlocal EnableExtensions
title TrueTrace Launcher

rem ============================================================
rem  TrueTrace one-click local launcher
rem  - AI engine (FastAPI + ONNX)  -> http://localhost:8000
rem  - Frontend  (React)           -> http://localhost:3000
rem  First run creates the Python venv and installs packages.
rem ============================================================

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"
set "BACKEND=%ROOT%\backend"
set "FRONTEND=%ROOT%\frontend"

echo.
echo  =========================================
echo    TrueTrace - starting local environment
echo  =========================================
echo.

if not exist "%BACKEND%\main.py" (
  echo [ERROR] Could not find backend\main.py next to this script.
  goto :fail
)
if not exist "%FRONTEND%\package.json" (
  echo [ERROR] Could not find frontend\package.json next to this script.
  goto :fail
)

rem ---------- find Python ----------
set "PYEXE="
if exist "%BACKEND%\venv\Scripts\python.exe" set "PYEXE=%BACKEND%\venv\Scripts\python.exe"
if not defined PYEXE if exist "%BACKEND%\.venv\Scripts\python.exe" set "PYEXE=%BACKEND%\.venv\Scripts\python.exe"
if not defined PYEXE if exist "%ROOT%\venv\Scripts\python.exe" set "PYEXE=%ROOT%\venv\Scripts\python.exe"

if not defined PYEXE (
  echo [setup] No virtual environment found - creating backend\venv ...
  set "BASEPY="
  where py >nul 2>&1 && set "BASEPY=py -3"
  if not defined BASEPY where python >nul 2>&1 && set "BASEPY=python"
  if not defined BASEPY (
    echo [ERROR] Python is not installed or not on PATH. Install Python 3.11 from python.org.
    goto :fail
  )
  call %%BASEPY%% -m venv "%BACKEND%\venv" || goto :fail
  set "PYEXE=%BACKEND%\venv\Scripts\python.exe"
)
echo [ok] Python: %PYEXE%

rem ---------- install Python packages if missing ----------
"%PYEXE%" -c "import fastapi, uvicorn, onnxruntime, cv2, numpy, multipart" >nul 2>&1
if errorlevel 1 (
  echo [setup] Installing backend packages from requirements.txt ...
  "%PYEXE%" -m pip install --upgrade pip >nul
  "%PYEXE%" -m pip install -r "%BACKEND%\requirements.txt" || goto :fail
)
echo [ok] Backend packages installed

rem ---------- find Node / npm ----------
where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js / npm is not installed or not on PATH. Install Node 18+ from nodejs.org.
  goto :fail
)
if not exist "%FRONTEND%\node_modules" (
  echo [setup] Installing frontend packages - this can take a few minutes ...
  pushd "%FRONTEND%"
  call npm install || (popd & goto :fail)
  popd
)
echo [ok] Frontend packages installed

rem ---------- warn if ports are busy ----------
netstat -ano | findstr /R /C:":8000 .*LISTENING" >nul && echo [warn] Port 8000 is already in use - the AI engine window may show an error.
netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul && echo [warn] Port 3000 is already in use - React will offer another port.

rem ---------- launch ----------
if defined TT_DRYRUN (
  echo [dry-run] Checks passed - not launching.
  exit /b 0
)
echo.
echo [start] AI engine  -^> http://localhost:8000  (docs: /docs)
start "TrueTrace AI Engine" /D "%BACKEND%" cmd /k ""%PYEXE%" -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo [start] Frontend   -^> http://localhost:3000
start "TrueTrace Frontend" /D "%FRONTEND%" cmd /k "npm start"

echo.
echo  Both services are starting in their own windows.
echo  The browser opens automatically when React is ready.
echo  To stop: close the two windows (or press Ctrl+C in each).
echo.
timeout /t 8 >nul
exit /b 0

:fail
echo.
echo  Setup failed - see the message above.
pause
exit /b 1
