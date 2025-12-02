# 🎫 TicketFlow - Modern Ticket Management System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ezrelafidelynn/TicketFlow&env=DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT&envDescription=Get%20these%20from%20Railway%20MySQL%20service&demo-title=TicketFlow%20Demo&demo-description=Full-stack%20ticket%20management%20system)

A production-ready ticketing system with Vue.js frontend and Node.js serverless backend.

## 🚀 One-Click Deploy

1. **Click the deploy button above** ↗️
2. **Setup free database at [Railway](https://railway.app)** (add MySQL service)
3. **Copy database credentials** to Vercel environment variables
4. **Done!** Your system is live in 3 minutes

## ⚡ Super Quick Local Deploy

```bash
# Clone and auto-deploy
git clone https://github.com/ezrelafidelynn/TicketFlow.git
cd TicketFlow
npm run deploy
```

## 🎯 Features

- ✅ **Dashboard** with real-time statistics
- ✅ **Ticket Management** (Create, Edit, Delete, Assign)
- ✅ **Categories & Priorities** for organization
- ✅ **User Management** with role-based access
- ✅ **Responsive Design** works on all devices
- ✅ **Sample Data** included (144 tickets, 31 users)
- ✅ **Serverless Backend** auto-scales with demand

## 📊 What You Get

Your deployed system includes:

- **144 tickets** across 6 categories
- **31 users** (1 admin + 30 regular users)
- **Real dashboard statistics**
- **Mobile-responsive design**
- **Production-ready setup**

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Backend Requirements

- **PHP 8.0 or higher**
- **MySQL 8.0** or **MariaDB 10.3+**
- **Apache** or **Nginx** web server (XAMPP/WAMP recommended for Windows)

### Frontend Requirements

- **Node.js 18+**
- **npm** or **yarn**

## 🛠️ Installation Instructions

### Step 1: Clone the Repository

```bash
git clone https://github.com/ezrelafidelynn/TicketFlow.git
cd TicketFlow
```

### Step 2: Setup Database

1. **Start your MySQL server** (via XAMPP, WAMP, or standalone MySQL)

2. **Create the database:**

   ```sql
   CREATE DATABASE ticketing_system;
   ```

3. **Import the database schema:**

   Navigate to `backend/database/` and run:

   ```bash
   mysql -u root -p ticketing_system < schema.sql
   ```

### Step 3: Configure Laravel Backend

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install Composer dependencies:**

   ```bash
   php composer.phar install
   ```

   If you don't have Composer, download it from https://getcomposer.org/

3. **Configure environment:**

   The `.env` file should already be present. Update if needed:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ticketing_system
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Generate application key** (if not set):

   ```bash
   php artisan key:generate
   ```

5. **Start Laravel development server:**

   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

   The Laravel API will be available at: `http://localhost:8000`

### Step 4: Setup Vue.js Frontend

1. **Open a new terminal and navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **API Configuration:**

   The API endpoint is already configured to use Laravel at `http://localhost:8000/api`

   Located in `frontend/src/services/api.js`

4. **Start development server:**

   ```bash
   npm run dev
   ```

5. **Access the application:**

   Open your browser and visit:

   ```
   http://localhost:5173
   ```

## 👤 Default Users

After running the seeder, you can login with:

### Admin Account

- Email: `admin@ticket.com`
- Password: `admin123`

### Agent Account

- Email: `agent@ticket.com`
- Password: `agent123`

### Customer Account

- Email: `customer@ticket.com`
- Password: `customer123`

## 📁 Project Structure

```
TicketFlow/
├── backend/
│   ├── api/              # REST API endpoints
│   │   ├── tickets.php   # Tickets CRUD operations
│   │   └── stats.php     # Dashboard statistics
│   ├── config/           # Configuration files
│   │   └── database.php  # Database connection
│   └── database/         # Database files
│       ├── schema.sql    # Database structure
│       ├── seeder.php    # Sample data seeder
│       └── migrations/   # SQL migration files
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable Vue components
│   │   ├── layouts/      # Layout components
│   │   ├── pages/        # Page components
│   │   ├── router/       # Vue Router configuration
│   │   ├── stores/       # Pinia state management
│   │   └── services/     # API service layer
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
└── README.md             # This file
```

```bash
php artisan migrate --seed
```

8. **Create storage symlink:**

## 🔧 API Endpoints

### Tickets API

- `GET /api/tickets.php` - List tickets (supports pagination, filters, sorting, archive)
  - Query params: `page`, `limit`, `orderBy`, `search`, `status`, `priority`, `category`, `archived`
- `GET /api/tickets.php?id={id}` - Get ticket details
- `POST /api/tickets.php` - Create ticket
- `PUT /api/tickets.php?id={id}` - Update ticket
- `PUT /api/tickets.php?id={id}&action=archive` - Archive ticket
- `PUT /api/tickets.php?id={id}&action=unarchive` - Unarchive ticket
- `DELETE /api/tickets.php?id={id}` - Delete ticket

### Statistics API

- `GET /api/stats.php` - Get dashboard statistics (total, resolved, in-progress, high priority)

## 🛠️ Development

### Running in Development

**Backend (via XAMPP/WAMP):**

- Start Apache and MySQL
- Access via `http://localhost/TicketFlow/backend/api/`

**Frontend:**

```bash
cd frontend
npm run dev
```

Access at `http://localhost:5173`

### Building for Production

**Frontend:**

```bash
cd frontend
npm run build
```

The production files will be in `frontend/dist/`

## 🐛 Troubleshooting

### Common Issues

**1. CORS errors:**

- Check that `Access-Control-Allow-Origin` header is set in backend API files
- Ensure frontend is accessing the correct backend URL

**2. Database connection failed:**

- Verify MySQL is running
- Check database credentials in `backend/config/database.php`
- Ensure database `ticketing_system` exists

**3. Frontend can't connect to backend:**

- Check API URLs in frontend code match your backend location
- Verify Apache/web server is running
- Check browser console for specific errors

**4. "No data" or empty tables:**

- Run the database seeder: `http://localhost/TicketFlow/backend/database/seeder.php`
- Check that SQL files were imported correctly

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributors

- Ezrela Fidelynn - Initial work

## 🙏 Acknowledgments

- Vue.js for the frontend framework
- TailwindCSS for styling
- Heroicons for icon set
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
