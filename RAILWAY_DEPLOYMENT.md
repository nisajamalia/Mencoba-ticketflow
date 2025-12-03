# Railway Deployment Guide for TicketFlow

This guide will help you deploy TicketFlow to Railway with a MySQL database.

## Prerequisites

- GitHub account
- Railway account (sign up at https://railway.app)
- Your code pushed to a GitHub repository

## Deployment Steps

### Step 1: Create a New Railway Project

1. Go to https://railway.app and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your TicketFlow repository
5. Railway will automatically detect it as a PHP project

### Step 2: Add MySQL Database

1. In your Railway project, click "New"
2. Select "Database" → "Add MySQL"
3. Railway will provision a MySQL database
4. Note: Database credentials are automatically available as environment variables

### Step 3: Configure Environment Variables

In your Railway project settings, add these environment variables:

**Required Variables:**
```
APP_NAME=TicketFlow
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_URL=https://your-app.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
DB_USERNAME=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

SESSION_DRIVER=database
CACHE_DRIVER=database
QUEUE_CONNECTION=database

LOG_CHANNEL=stack
LOG_LEVEL=error
```

**Generate APP_KEY:**
Run locally: `php artisan key:generate --show`
Copy the output and paste it as APP_KEY value.

### Step 4: Deploy Backend

1. Railway will automatically deploy your backend
2. Wait for the build to complete
3. Check logs for any errors
4. Your backend API will be available at: `https://your-backend.railway.app`

### Step 5: Deploy Frontend (Separate Service)

**Option A: Deploy Frontend on Vercel (Recommended)**

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure build settings:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. Deploy

**Option B: Deploy Frontend on Railway**

1. In Railway, click "New" → "GitHub Repo"
2. Select the same repository
3. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

### Step 6: Run Database Migrations

After first deployment:

1. Go to your Railway backend service
2. Click on "Settings" → "Deploy"
3. The migrations will run automatically on startup
4. Or manually run: `php artisan migrate --force`

### Step 7: Seed Database (Optional)

To add sample data:

1. In Railway backend service, open the terminal
2. Run: `php artisan db:seed --force`

## Post-Deployment

### Update CORS Settings

Update `backend/config/cors.php` to allow your frontend domain:

```php
'allowed_origins' => [
    'https://your-frontend.vercel.app',
    'https://your-frontend.railway.app',
],
```

### Update Frontend API URL

Make sure your frontend `.env.production` has:
```
VITE_API_URL=https://your-backend.railway.app/api
```

## Troubleshooting

### Database Connection Issues
- Verify all DB_* environment variables are set correctly
- Check that MySQL service is running
- Review Railway logs for connection errors

### 500 Errors
- Check `APP_KEY` is set
- Verify `APP_DEBUG=false` in production
- Review Laravel logs in Railway dashboard

### CORS Errors
- Update `backend/config/cors.php` with your frontend URL
- Ensure `allowed_origins` includes your frontend domain

### Migration Errors
- Manually run migrations from Railway terminal
- Check database credentials
- Verify MySQL service is accessible

## Monitoring

- View logs in Railway dashboard
- Monitor database usage
- Check application metrics

## Scaling

Railway automatically scales based on usage. For custom scaling:
1. Go to Service Settings
2. Adjust resources as needed
3. Configure auto-scaling rules

## Cost Estimation

- Railway offers $5 free credit per month
- MySQL database: ~$5-10/month
- Backend service: ~$5-10/month (based on usage)
- Total: ~$10-20/month for small to medium traffic

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- TicketFlow Issues: Your GitHub repository issues page
