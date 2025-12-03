# Project Structure

## Dual Backend Architecture

This project has **two backend implementations**:

1. **Laravel Backend** (`/backend`): Full-featured PHP backend for local development
2. **Serverless API** (`/api`): Node.js serverless functions for Vercel deployment

Both backends serve the same Vue.js frontend but use different approaches.

## Directory Layout

```
/
├── api/                          # Serverless functions (Vercel)
│   ├── tickets.js                # Ticket CRUD operations
│   ├── stats.js                  # Dashboard statistics
│   ├── categories.js             # Category management
│   └── lib/db.js                 # Database connection helper
│
├── backend/                      # Laravel application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # API controllers
│   │   │   ├── Requests/         # Form request validation
│   │   │   └── Resources/        # API resource transformers
│   │   ├── Models/               # Eloquent models
│   │   └── Services/             # Business logic layer
│   ├── config/                   # Laravel configuration
│   ├── database/
│   │   ├── migrations/           # Database schema migrations
│   │   ├── seeders/              # Data seeders
│   │   └── database.sqlite       # SQLite database file
│   ├── routes/
│   │   └── api.php               # API route definitions
│   └── .env                      # Environment configuration
│
├── frontend/                     # Vue.js application
│   ├── src/
│   │   ├── components/           # Reusable Vue components
│   │   ├── layouts/              # Layout wrappers
│   │   ├── pages/                # Page components
│   │   │   ├── admin/            # Admin-only pages
│   │   │   ├── auth/             # Authentication pages
│   │   │   └── tickets/          # Ticket management pages
│   │   ├── router/               # Vue Router configuration
│   │   ├── services/             # API service layer
│   │   │   ├── api.js            # Axios instance with interceptors
│   │   │   └── index.js          # Service exports
│   │   ├── stores/               # Pinia state stores
│   │   ├── App.vue               # Root component
│   │   └── main.js               # Application entry point
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   └── tailwind.config.js        # TailwindCSS configuration
│
├── scripts/                      # Deployment and setup scripts
│   ├── deploy.js                 # Automated deployment
│   ├── setup-database.js         # Database initialization
│   └── seed-database.js          # Sample data seeding
│
├── vercel.json                   # Vercel deployment config
└── package.json                  # Root package.json with scripts
```

## Key Architectural Patterns

### Frontend Architecture

- **Component-based**: Reusable Vue components in `/components`
- **Page-based routing**: Each route maps to a page component in `/pages`
- **Centralized state**: Pinia stores for auth, tickets, categories, comments
- **Service layer**: API calls abstracted in `/services` directory
- **Axios interceptors**: Automatic token injection and error handling

### Backend Architecture (Laravel)

- **MVC Pattern**: Models, Controllers, Views (API Resources)
- **Service Layer**: Business logic separated from controllers
- **Request Validation**: Form Request classes for input validation
- **Resource Transformers**: Consistent API response formatting
- **Repository Pattern**: Data access through Eloquent ORM
- **Middleware**: Authentication via Sanctum, CORS handling

### Serverless Architecture

- **Function-per-endpoint**: Each API route is a separate file
- **Shared utilities**: Database connection pooling in `/api/lib`
- **Stateless**: No session storage, token-based auth
- **CORS handling**: Built into each function handler

## Naming Conventions

### Files
- Vue components: PascalCase (e.g., `TicketDetailPage.vue`)
- JavaScript/Node: camelCase (e.g., `tickets.js`)
- PHP classes: PascalCase (e.g., `TicketController.php`)
- Config files: kebab-case (e.g., `vite.config.js`)

### Code
- Vue composables: `use` prefix (e.g., `useAuthStore()`)
- API endpoints: RESTful conventions (`/api/tickets`, `/api/tickets/{id}`)
- Database tables: snake_case plural (e.g., `tickets`, `activity_logs`)
- Model properties: snake_case (e.g., `created_at`, `assigned_to`)

## Important Files

- `frontend/src/services/api.js`: Axios configuration and interceptors
- `backend/routes/api.php`: Laravel API route definitions
- `backend/bootstrap/app.php`: Laravel application bootstrap
- `vercel.json`: Serverless function configuration
- `.env` files: Environment-specific configuration (never commit!)
