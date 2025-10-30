@echo off
setlocal enabledelayedexpansion

:: ======================================
:: CONFIGURATION
:: ======================================
set SOLUTION_NAME=BackendProjectName
set MODULES=Module1 Module2
set FRONTEND_NAME=FrontEndName
set BASE_DIR=%~dp0
set ROOT_DIR=%BASE_DIR%%SOLUTION_NAME%
set BACKEND_DIR=%ROOT_DIR%\BackEnd
set FRONTEND_DIR=%ROOT_DIR%\FrontEnd

:: ======================================
:: CREATE GLOBAL STRUCTURE
:: ======================================
echo ======================================
echo Creating global project structure
echo ======================================

if not exist "%ROOT_DIR%" (
    mkdir "%ROOT_DIR%"
)
if not exist "%BACKEND_DIR%" (
    mkdir "%BACKEND_DIR%"
)
if not exist "%FRONTEND_DIR%" (
    mkdir "%FRONTEND_DIR%"
)

cd "%BACKEND_DIR%"

:: ======================================
:: CREATE SOLUTION
:: ======================================
echo Creating backend solution: %SOLUTION_NAME%
if not exist "%SOLUTION_NAME%.sln" (
    dotnet new sln -n %SOLUTION_NAME%
    if %ERRORLEVEL% neq 0 (
        echo Error creating solution .sln. Check your .NET SDK installation.
        exit /b 1
    )
)

:: ======================================
:: CREATE BACKEND MODULES
:: ======================================
for %%M in (%MODULES%) do (
    echo --------------------------------------
    echo Creating backend module %%M
    echo --------------------------------------

    mkdir %%M
    cd %%M

    dotnet new webapi -n %%M.Api
    dotnet new classlib -n %%M.Application
    dotnet new classlib -n %%M.Domain
    dotnet new classlib -n %%M.Infrastructure

    dotnet sln ..\%SOLUTION_NAME%.sln add %%M.Api\%%M.Api.csproj
    dotnet sln ..\%SOLUTION_NAME%.sln add %%M.Application\%%M.Application.csproj
    dotnet sln ..\%SOLUTION_NAME%.sln add %%M.Domain\%%M.Domain.csproj
    dotnet sln ..\%SOLUTION_NAME%.sln add %%M.Infrastructure\%%M.Infrastructure.csproj

    cd ..
)

:: ======================================
:: CREATE FRONTEND
:: ======================================
echo ======================================
echo Creating frontend with React (Vite)
echo ======================================

cd "%FRONTEND_DIR%"

if exist "%FRONTEND_NAME%" (
    echo Frontend folder already exists, skipping creation.
) else (
    call npx create-react-app %FRONTEND_NAME% --template typescript
)

:: ======================================
:: ADD BASIC FILES
:: ======================================
cd "%ROOT_DIR%"
echo Creating .gitignore and README.md

if not exist ".gitignore" (
    dotnet new gitignore
)

if not exist "README.md" (
    (
        echo # %SOLUTION_NAME%
        echo.
        echo ## Structure
        echo - Backend: .NET 9 modular REST API
        echo - Frontend: React + TypeScript
        echo.
        echo ## Modules
        for %%M in (%MODULES%) do echo - %%M
    ) > README.md
)

echo ======================================
echo Setup completed successfully!
echo Project created in: %ROOT_DIR%
echo ======================================
pause
