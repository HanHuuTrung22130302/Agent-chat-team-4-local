@echo off
title AgentForge Worker Node
color 0A

echo ==========================================================
echo        AgentForge - Multi-Agent Distributed Worker Node
echo ==========================================================
echo.

:: Auto-check and install Python dependencies on first run
python -c "import websockets" 2>nul
if errorlevel 1 (
    echo [AgentForge] First time run detected: Installing required libraries...
    python -m pip install websockets
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies. Make sure Python is installed and on PATH.
        pause
        exit /b 1
    )
    echo [AgentForge] Dependencies installed successfully!
    echo.
)

if not "%1"=="" (
    set ROLE=%1
    set ENGINE=%2
    set MODEL=%3
    goto START
)

echo Select the role for this computer:
echo [1] Lead / Architect     (PC-3: Antigravity Pro Jio - Gemini 3.8 Flash / Claude Opus)
echo [2] BA / Spec Writer     (PC-4: Antigravity Pro Jio - Gemini 3.8 Flash / Claude Opus)
echo [3] Developer            (PC-1: Antigravity / OpenCode - Free)
echo [4] Tester / QA          (PC-2: Antigravity / OpenCode - Free)
echo.

set /p choice="Enter choice [1-4] (Default 3): "

if "%choice%"=="1" (
    set ROLE=lead
    set ENGINE=antigravity
    set MODEL=gemini-3.8-flash-high
) else if "%choice%"=="2" (
    set ROLE=ba
    set ENGINE=antigravity
    set MODEL=gemini-3.8-flash-high
) else if "%choice%"=="4" (
    set ROLE=tester
    set ENGINE=antigravity
    set MODEL=gemini-3.8-flash-high
) else (
    set ROLE=developer
    set ENGINE=antigravity
    set MODEL=gemini-3.8-flash-high
)

:START
echo.
echo ==========================================================
echo Role       : [%ROLE%]
echo Tool / IDE : [%ENGINE%]
echo AI Model   : [%MODEL%]
echo Hub Server : ws://192.168.1.50:8000/ws
echo ==========================================================
echo.
echo Connecting to AgentForge Hub...
echo (Keep this window open while the agent is participating)
echo.

python agent_daemon.py --role %ROLE% --engine %ENGINE% --model %MODEL% --hub ws://192.168.1.50:8000/ws

pause
