# Ticketing System - Complete Setup Guide

A modern, full-featured ticketing system built with Laravel 11 backend API and Vue.js 3 frontend.

## 🚀 Features

### Authentication & Authorization

- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ Password reset functionality
- ✅ Profile management

### Ticketing System

- ✅ Create, read, update, delete tickets
- ✅ Ticket categories and priorities
- ✅ Status tracking (Open, In Progress, Resolved, Closed)
- ✅ File attachments support
- ✅ Comments system
- ✅ Activity logging
- ✅ Ticket assignment (Admin only)
- ✅ Advanced filtering and search

### Admin Features

- ✅ Admin dashboard with statistics
- ✅ User management
- ✅ Category management
- ✅ System-wide ticket overview

### Frontend UI/UX

- ✅ Modern, responsive design with TailwindCSS
- ✅ Vue.js 3 with Composition API
- ✅ Pinia state management
- ✅ Toast notifications
- ✅ Loading states and error handling
- ✅ Mobile-friendly interface

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Backend Requirements

- **PHP 8.2 or higher**
- **Composer** (PHP package manager)
- **MySQL 8.0** or **PostgreSQL 13+**
- **Node.js 18+** and **npm** (for asset compilation)

### Frontend Requirements

- **Node.js 18+**
- **npm** or **yarn**

## 🛠️ Installation Instructions

### Step 1: Clone and Setup Backend (Laravel)

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install PHP dependencies:**

   ```bash
   composer install
   ```

3. **Create environment file:**

   ```bash
   copy .env.example .env
   ```

4. **Configure your database in `.env`:**

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ticketing_system
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Generate application key:**

   ```bash
   php artisan key:generate
   ```

6. **Create database:**
   Create a new MySQL database named `ticketing_system`

7. **Run migrations and seeders:**

   ```bash
   php artisan migrate --seed
   ```

8. **Create storage symlink:**

   ```bash
   php artisan storage:link
   ```

9. **Install and compile assets (optional):**

   ```bash
   npm install
   npm run build
   ```

10. **Start the development server:**

    ```bash
    php artisan serve
    ```

    The API will be available at `http://localhost:8000`

### Step 2: Setup Frontend (Vue.js)

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file (optional):**

   ```bash
   copy .env.example .env
   ```

   Add the following to `.env`:

   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 🔑 Default Login Credentials

After running the seeders, you can use these default accounts:

### Admin Account

- **Email:** admin@ticketing.com
- **Password:** password

### Regular User Account

- **Email:** john@example.com
- **Password:** password

### Support Staff Account

- **Email:** support@ticketing.com
- **Password:** password

## 🗄️ Database Schema

The system includes the following main tables:

- **users** - User accounts with roles
- **categories** - Ticket categories
- **tickets** - Support tickets
- **comments** - Ticket comments
- **activity_logs** - Ticket activity tracking
- **personal_access_tokens** - Sanctum authentication tokens

## 🔧 Configuration

### Backend Configuration

#### CORS Settings

The backend is configured to accept requests from `http://localhost:3000` by default. Update `config/cors.php` if needed.

#### File Upload Settings

- Maximum file size: 10MB per file
- Allowed file types: All (configurable in form requests)
- Storage: `storage/app/public/attachments`

#### API Rate Limiting

Default rate limiting is applied to API routes. Modify in `bootstrap/app.php` if needed.

### Frontend Configuration

#### API Integration

The frontend is configured to connect to the Laravel API at `http://localhost:8000/api`. This can be changed in:

- `src/services/api.js`
- `.env` file (`VITE_API_URL`)

#### Authentication

- JWT tokens are stored in localStorage
- Automatic token refresh on API calls
- Route guards for protected pages

## 📁 Project Structure

### Backend Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/     # API Controllers
│   │   ├── Requests/           # Form Validation
│   │   └── Resources/          # API Resources
│   ├── Models/                 # Eloquent Models
│   └── Services/              # Business Logic
├── database/
│   ├── migrations/            # Database Migrations
│   └── seeders/              # Data Seeders
├── routes/
│   ├── api.php               # API Routes
│   └── web.php               # Web Routes
└── storage/                  # File Storage
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/           # Reusable Components
│   ├── layouts/             # Layout Components
│   ├── pages/               # Page Components
│   ├── router/              # Vue Router Configuration
│   ├── services/            # API Services
│   ├── stores/              # Pinia Stores
│   └── styles/              # CSS Styles
├── public/                  # Static Assets
└── index.html              # Entry HTML
```

## 🚀 Deployment

### Production Backend Deployment

1. **Server Requirements:**

   - PHP 8.2+
   - MySQL/PostgreSQL
   - Web server (Apache/Nginx)
   - SSL certificate

2. **Environment Setup:**

   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Database:**
   ```bash
   php artisan migrate --force
   ```

### Production Frontend Deployment

1. **Build for production:**

   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to your web server**

3. **Configure web server to serve SPA routes**

## 🔍 API Documentation

### Authentication Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get authenticated user
- `PUT /api/profile` - Update user profile

### Ticket Endpoints

- `GET /api/tickets` - List tickets (with filters)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/{id}` - Get ticket details
- `PUT /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket
- `PUT /api/tickets/{id}/assign` - Assign ticket (Admin)

### Category Endpoints

- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/{id}` - Update category (Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin)

### Comment Endpoints

- `GET /api/tickets/{id}/comments` - List ticket comments
- `POST /api/tickets/{id}/comments` - Add comment
- `PUT /api/comments/{id}` - Update comment
- `DELETE /api/comments/{id}` - Delete comment

### Admin Endpoints

- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}/role` - Update user role
- `GET /api/admin/system-stats` - System statistics

## 🐛 Troubleshooting

### Common Backend Issues

1. **500 Error - Storage Permission:**

   ```bash
   chmod -R 775 storage bootstrap/cache
   ```

2. **Database Connection Error:**

   - Check database credentials in `.env`
   - Ensure database exists
   - Test connection manually

3. **CORS Issues:**
   - Update `config/cors.php`
   - Check frontend URL configuration

### Common Frontend Issues

1. **API Connection Failed:**

   - Verify backend is running on port 8000
   - Check `VITE_API_URL` in `.env`
   - Verify CORS configuration

2. **Build Errors:**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 🎯 Next Steps

### Additional Features to Implement

1. **Email Notifications:**

   - Setup mail configuration
   - Add notification templates
   - Implement email queues

2. **Real-time Updates:**

   - Add WebSocket support
   - Implement Laravel Echo
   - Real-time ticket updates

3. **Advanced Features:**

   - Ticket templates
   - SLA tracking
   - Custom fields
   - Reports and analytics
   - Multi-language support

4. **Performance Optimization:**
   - API caching
   - Database indexing
   - CDN integration
   - Image optimization

## 📞 Support

For support with this ticketing system:

1. Check the documentation above
2. Review the code comments
3. Test with the provided sample data
4. Check Laravel and Vue.js official documentation

## 📄 License

This project is open-source and available under the MIT License.

---

**🎉 Congratulations! Your ticketing system is now ready to use!**

Visit `http://localhost:3000` to access the frontend application and start creating tickets.
