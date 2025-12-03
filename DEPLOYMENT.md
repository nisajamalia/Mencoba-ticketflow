# 🎫 Ticketing System - Vercel Deployment Guide

## 📋 Overview

This is a full-stack ticketing system optimized for Vercel deployment with:

- **Frontend**: Vue.js 3 + Vite + TailwindCSS
- **Backend**: Node.js Serverless Functions
- **Database**: MySQL (requires external service)

## 🚀 Quick Deploy to Vercel

### 1. Database Setup (Choose One)

#### Option A: PlanetScale (Recommended)

1. Create account at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection string from dashboard
4. Import your existing MySQL data

#### Option B: Railway

1. Create account at [railway.app](https://railway.app)
2. Create MySQL service
3. Get connection details
4. Import your data

#### Option C: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Use SQL editor to create tables
4. Get connection string

### 2. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ticketing-system)

**Or manually:**

1. **Fork/Clone this repository**
2. **Connect to Vercel**:

   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Select "Framework Preset": Vite

3. **Configure Environment Variables** in Vercel dashboard:

   ```
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   DB_PORT=3306
   ```

4. **Deploy**: Vercel will automatically build and deploy

## 🏗️ Architecture

```
ticketing-system/
├── frontend/              # Vue.js frontend (deployed as static site)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── api/                   # Serverless functions
│   ├── lib/
│   │   └── db.js         # Database connection
│   ├── tickets.js        # Ticket CRUD operations
│   ├── stats.js          # Dashboard statistics
│   └── categories.js     # Category management
├── vercel.json           # Vercel configuration
└── package.json          # Root dependencies
```

## 🔧 Local Development

### Prerequisites

- Node.js 18+
- MySQL database

### Setup

1. **Clone repository**:

   ```bash
   git clone <your-repo>
   cd ticketing-system
   ```

2. **Install dependencies**:

   ```bash
   npm run install-frontend
   npm install
   ```

3. **Configure environment**:
   Create `.env.local`:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-password
   DB_NAME=ticketing_system
   DB_PORT=3306
   ```

4. **Setup database**:

   - Import `backend/database/schema.sql`
   - Run `backend/database/seeder.php` or import existing data

5. **Start development**:
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The system includes:

- **Users** (31 total): Admin and regular users
- **Categories** (6): Bug Report, Feature Request, Technical Support, Account Issue, General Inquiry, Billing
- **Tickets** (144 total): Distributed across all categories, statuses, and priorities
- **Comments**: User interactions on tickets
- **Activity Logs**: Audit trail for changes

### Status Distribution:

- Open: 49 tickets
- In Progress: 45 tickets
- Closed: 30 tickets
- Resolved: 20 tickets

### Priority Distribution:

- Low: 36 tickets
- Medium: 48 tickets
- High: 48 tickets
- Urgent: 12 tickets

## 🛠️ API Endpoints

### Tickets API (`/api/tickets`)

- `GET /api/tickets` - List all tickets
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets` - Update ticket
- `DELETE /api/tickets` - Delete ticket

### Stats API (`/api/stats`)

- `GET /api/stats` - Dashboard statistics

### Categories API (`/api/categories`)

- `GET /api/categories` - List categories
- `POST /api/categories` - Create category

## 🎨 Frontend Features

- **Dashboard**: Real-time statistics and metrics
- **Ticket Management**: Create, view, edit, delete tickets
- **Category System**: Organized ticket categorization
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Dynamic data loading

## 🔒 Security Features

- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## 📈 Performance Optimizations

- Serverless functions for automatic scaling
- Optimized database queries
- Frontend code splitting
- CDN distribution via Vercel

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Failed**:

   - Check environment variables
   - Verify database credentials
   - Ensure database is accessible from Vercel

2. **API Endpoints 404**:

   - Check `vercel.json` routing
   - Verify API file locations

3. **Frontend Build Errors**:
   - Check Node.js version (18+)
   - Clear node_modules and reinstall

### Debug Mode:

Add `DEBUG=true` environment variable for detailed logs.

## 📝 Environment Variables

Required for production:

```
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=3306
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

**🎯 Ready to deploy!** Follow the steps above and your ticketing system will be live on Vercel in minutes.
