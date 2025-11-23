# Ticketing System - Complete Setup Guide

## Prerequisites Check ✅

- XAMPP is installed at: `C:\xampp\`
- Frontend application is ready
- Backend PHP API is created

## Step-by-Step Setup Instructions

### 1. Start XAMPP Services

1. **XAMPP Control Panel should be open** (we started it for you)
2. In the Control Panel:
   - Click **"Start"** next to **Apache**
   - Click **"Start"** next to **MySQL**
   - Wait for both to show **green "Running"** status

### 2. Create Database

Once MySQL is running, you have two options:

#### Option A: Using phpMyAdmin (Recommended)

1. Open your browser and go to: http://localhost/phpmyadmin
2. Click **"New"** on the left sidebar
3. Create database name: `ticketing_system`
4. Click **"Create"**
5. Select the new database and click **"Import"**
6. Choose file: `backend/database/schema.sql`
7. Click **"Go"**

#### Option B: Using Command Line

1. Open Command Prompt as Administrator
2. Run these commands:

```bash
cd C:\xampp\mysql\bin
mysql -u root -e "CREATE DATABASE ticketing_system;"
mysql -u root ticketing_system < "C:\Users\Ezy\Downloads\ticketing-website\backend\database\schema.sql"
```

### 3. Verify Database Setup

1. Go to http://localhost/phpmyadmin
2. Click on `ticketing_system` database
3. You should see 6 tables:
   - users
   - categories
   - tickets
   - comments
   - attachments
   - audit_logs

### 4. Test Backend API

1. Open browser and test: http://localhost/ticketing-website/backend/api/tickets.php
2. You should see JSON response with sample tickets

### 5. Update Frontend Configuration

The frontend needs to be updated to use the PHP backend instead of localStorage.

## Next Steps

1. ✅ Start XAMPP services (Apache + MySQL)
2. ⏳ Create database using phpMyAdmin
3. ⏳ Import database schema
4. ⏳ Test API endpoints
5. ⏳ Update frontend to use PHP API

## Troubleshooting

- **Port 80 busy**: Change Apache port in XAMPP config
- **MySQL won't start**: Check if another MySQL service is running
- **API not working**: Verify Apache document root includes your project

## Current Status

- ✅ XAMPP Control Panel opened
- ⏳ Waiting for services to start
- ⏳ Database creation pending

**Please start Apache and MySQL services in XAMPP Control Panel, then let me know when they're running!**
