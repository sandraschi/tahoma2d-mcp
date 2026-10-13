@echo off
REM Stop tahoma2d-mcp fleet ports
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop.ps1"
if errorlevel 1 pause

