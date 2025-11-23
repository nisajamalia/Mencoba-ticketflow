@echo off
echo Setting up Ticketing System Database...
echo.
echo Make sure XAMPP Apache and MySQL are running!
echo.
pause

cd /d "C:\xampp\mysql\bin"
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ticketing_system;"
echo Database created successfully!

echo.
echo Importing database schema...
mysql -u root -p ticketing_system < "%~dp0backend\database\schema.sql"
echo Schema imported successfully!

echo.
echo Database setup complete!
echo You can now access phpMyAdmin at: http://localhost/phpmyadmin
pause