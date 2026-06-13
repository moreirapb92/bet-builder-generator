@echo off
title Bet Builder Generator - Copa do Mundo 2026
color 0A

echo ╔══════════════════════════════════════════════════════════╗
echo ║      BET BUILDER GENERATOR - COPA DO MUNDO 2026        ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/3] Verificando Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado! Instale em https://nodejs.org
    pause
    exit /b 1
)
echo OK!

echo [2/3] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
)
echo OK!

echo [3/3] Iniciando servidor...
echo.
echo ══════════════════════════════════════════════════════════
echo  Acesse: http://localhost:3001
echo  Pressione CTRL+C para parar
echo ══════════════════════════════════════════════════════════
echo.

node server.js

pause
