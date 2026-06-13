@echo off
title Atualizar Dados - Bet Builder Generator
color 0B

echo ╔══════════════════════════════════════════════════════════╗
echo ║           ATUALIZAR DADOS DO SISTEMA                   ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/2] Limpando cache de jogos...
if exist "data\fixtures_cache.json" (
    echo {} > "data\fixtures_cache.json"
    echo Cache de jogos limpo!
) else (
    echo Cache de jogos ja esta limpo.
)

echo.
echo [2/2] Limpando cache de jogadores...
if exist "data\api_cache.json" (
    echo {} > "data\api_cache.json"
    echo Cache de jogadores limpo!
) else (
    echo Cache de jogadores ja esta limpo.
)

echo.
echo ══════════════════════════════════════════════════════════
echo  Dados atualizados! Reinicie o servidor para aplicar.
echo ══════════════════════════════════════════════════════════
echo.
pause
