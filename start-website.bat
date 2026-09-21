@echo off
title ToolSphere Launcher
cd /d %~dp0
echo ===================================================
echo    Starting ToolSphere Web Platform
echo ===================================================
echo.
if not exist node_modules (
    echo [1/2] First-time setup: Installing dependencies...
    call npm.cmd install
)
echo [2/2] Launching server on http://localhost:5173/ ...
timeout /t 2 /nobreak >nul
start http://localhost:5173/
call npm.cmd run dev
pause
