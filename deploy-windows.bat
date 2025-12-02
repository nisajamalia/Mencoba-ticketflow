@echo off
echo.
echo 🎫 TicketFlow - One-Click Vercel Deployment
echo ==========================================
echo.
echo This script will help you deploy TicketFlow to Vercel in minutes!
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Install global dependencies
echo 📦 Installing global dependencies...
npm install -g @railway/cli vercel

echo.
echo 🚀 Choose your deployment method:
echo.
echo 1. Full automatic deployment (Railway + Vercel)
echo 2. Manual setup (you handle database)
echo 3. Deploy to existing Vercel project
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo 🔄 Starting automatic deployment...
    npm run deploy
) else if "%choice%"=="2" (
    echo.
    echo 📋 Manual Setup Instructions:
    echo 1. Create database at railway.app, planetscale.com, or supabase.com
    echo 2. Add these environment variables to Vercel:
    echo    - DB_HOST
    echo    - DB_USER  
    echo    - DB_PASSWORD
    echo    - DB_NAME
    echo    - DB_PORT
    echo 3. Run: vercel --prod
    echo.
    pause
) else if "%choice%"=="3" (
    echo.
    echo ⚡ Deploying to Vercel...
    vercel --prod
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment process completed!
echo 🌐 Your TicketFlow system should now be live!
echo.
echo 📋 Next steps:
echo 1. Visit your Vercel URL
echo 2. Login with: admin@ticketflow.com / password  
echo 3. Start managing tickets!
echo.
pause