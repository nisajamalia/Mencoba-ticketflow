# GitHub Actions Workflows

This directory contains automated workflows for the TicketFlow project.

## Available Workflows

### 1. CI Pipeline (`ci.yml`)
**Triggers:** Push to main/development, Pull requests to main

Runs comprehensive checks on both backend and frontend:
- Backend: PHP setup, dependencies, migrations
- Frontend: Node setup, build, artifact upload

### 2. Backend Tests (`backend-tests.yml`)
**Triggers:** Push/PR affecting backend files

- PHP 8.2 setup
- Composer dependency installation
- Database migrations
- Code style checks with Laravel Pint
- PHPUnit tests

### 3. Frontend Tests (`frontend-tests.yml`)
**Triggers:** Push/PR affecting frontend files

- Node.js 18 setup
- NPM dependency installation
- Linting
- Production build
- Build size check

### 4. Code Quality (`code-quality.yml`)
**Triggers:** Push to main/development, Pull requests

- PHP code style (Laravel Pint)
- Security vulnerability checks
- Frontend linting

### 5. Deploy to Railway (`deploy-railway.yml`)
**Triggers:** Push to main, Manual dispatch

- Installs Railway CLI
- Deploys application
- Runs database migrations

**Setup Required:**
Add `RAILWAY_TOKEN` to your GitHub repository secrets:
1. Go to Railway dashboard
2. Generate a token
3. Add to GitHub: Settings → Secrets → Actions → New repository secret
4. Name: `RAILWAY_TOKEN`, Value: your token

## Setup Instructions

### For Railway Deployment

1. Get your Railway token:
   ```bash
   railway login
   railway whoami --token
   ```

2. Add to GitHub Secrets:
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `RAILWAY_TOKEN`
   - Value: paste your token

### Status Badges

Add these to your README.md:

```markdown
![CI Pipeline](https://github.com/yourusername/TicketFlow/workflows/CI%20Pipeline/badge.svg)
![Backend Tests](https://github.com/yourusername/TicketFlow/workflows/Backend%20Tests/badge.svg)
![Frontend Tests](https://github.com/yourusername/TicketFlow/workflows/Frontend%20Tests/badge.svg)
```

## Workflow Customization

### Modify Trigger Branches

Edit the `on` section in any workflow:

```yaml
on:
  push:
    branches: [ main, staging, development ]
  pull_request:
    branches: [ main ]
```

### Add Environment Variables

Add to the workflow file:

```yaml
env:
  NODE_VERSION: '18'
  PHP_VERSION: '8.2'
```

### Skip Workflows

Add to commit message:
```bash
git commit -m "Your message [skip ci]"
```

## Troubleshooting

### Backend Tests Failing
- Check PHP version compatibility
- Verify composer.json dependencies
- Ensure migrations are up to date

### Frontend Build Failing
- Check Node.js version
- Verify package.json scripts
- Check for missing dependencies

### Railway Deployment Failing
- Verify RAILWAY_TOKEN is set correctly
- Check Railway project configuration
- Review Railway logs for errors
