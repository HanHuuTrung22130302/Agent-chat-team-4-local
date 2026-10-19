@echo off
title AgentForge Worker Node
color 0A

echo ==========================================================
echo        AgentForge - Multi-Agent Distributed Worker Node
echo ==========================================================
echo.
echo Select the role for this computer:
echo [1] Lead / Architect     (OpenCode / Claude Opus / Free)
echo [2] BA / Spec Writer      (Antigravity Pro / Gemini Pro)
echo [3] Developer             (OpenCode / DeepSeek v4.1 Free)
echo [4] Tester / QA           (OpenCode / Mimo Free / Pytest)
echo.

set /p choice="Enter choice [1-4] (Default 3): "

if "%choice%"=="1" (
    set ROLE=lead
    set ENGINE=opencode
    set MODEL=opencode/deepseek-v4.1-flash-free
) else if "%choice%"=="2" (
    set ROLE=ba
    set ENGINE=antigravity
    set MODEL=gemini-3.8-flash-high
) else if "%choice%"=="4" (
    set ROLE=tester
    set ENGINE=opencode
    set MODEL=opencode/mimo-v2.6-flash-free
) else (
    set ROLE=developer
    set ENGINE=opencode
    set MODEL=opencode/deepseek-v4.1-flash-free
)

echo.
echo Starting AgentForge Daemon as [%ROLE%] using [%ENGINE%] (%MODEL%)...
echo Hub Server: ws://192.168.1.50:8000/ws
echo.

python agent_daemon.py --role %ROLE% --engine %ENGINE% --model %MODEL% --hub ws://192.168.1.50:8000/ws

pause
