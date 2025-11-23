@echo off
echo Setting up Ticketing System Backend...
echo.

cd backend

echo Installing Composer dependencies...
composer install

echo Creating environment file...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please configure your database settings before continuing.
    pause
)

echo Generating application key...
php artisan key:generate

echo Running database migrations and seeders...
php artisan migrate --seed

echo Creating storage symlink...
php artisan storage:link

echo.
echo Backend setup complete!
echo You can start the server with: php artisan serve
echo.
echo Default admin credentials:
echo Email: admin@ticketing.com
echo Password: password
echo.
pause