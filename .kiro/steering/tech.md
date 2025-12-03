# Technology Stack

## Frontend

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite 5
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios with interceptors
- **UI Framework**: TailwindCSS 3 with @tailwindcss/forms
- **Components**: Headless UI (@headlessui/vue)
- **Icons**: Heroicons (@heroicons/vue)
- **Notifications**: vue-toastification

## Backend

- **Framework**: Laravel 11 (PHP 8.2+)
- **Authentication**: Laravel Sanctum (token-based)
- **Database**: SQLite (development) / MySQL (production)
- **Permissions**: Spatie Laravel Permission package
- **API**: RESTful with Resource transformers

## Serverless Functions (Vercel)

- **Runtime**: Node.js 18.x
- **Database**: MySQL2 driver for serverless connections
- **API**: Express-style handlers in `/api` directory

## Database

- **Development**: SQLite (backend/database/database.sqlite)
- **Production**: MySQL 8.0+ or MariaDB 10.3+
- **ORM**: Eloquent (Laravel) / Raw SQL (Serverless)

## Common Commands

### Frontend Development
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development (Laravel)
```bash
cd backend
php composer.phar install    # Install dependencies
php artisan serve            # Start dev server (port 8000)
php artisan migrate          # Run migrations
php artisan migrate --seed   # Run migrations with seeders
php artisan key:generate     # Generate app key
```

### Full Stack Setup
```bash
npm run deploy              # Automated deployment script
npm run setup-db            # Setup database
npm run seed-db             # Seed sample data
npm run install-frontend    # Install frontend deps only
```

### Database Management
```bash
# Export database
./export_database.sh        # Unix/Mac
export_database.bat         # Windows
```

## Environment Configuration

### Frontend (.env or vite config)
- `VITE_API_URL`: Backend API URL (default: /api or http://localhost:8000)

### Backend (.env)
- `DB_CONNECTION`: Database driver (sqlite/mysql)
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `APP_KEY`: Laravel application key
- `APP_URL`: Application URL

### Vercel (Environment Variables)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`: MySQL credentials from Railway or other provider
