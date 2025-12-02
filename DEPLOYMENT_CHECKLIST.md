# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Database Setup

- [ ] Export current database using `export_database.bat` (Windows) or `export_database.sh` (Linux/Mac)
- [ ] Choose cloud database provider:
  - [ ] **PlanetScale** (Recommended - MySQL compatible, free tier)
  - [ ] **Railway** (MySQL service, $5/month)
  - [ ] **Supabase** (PostgreSQL, may need schema conversion)
- [ ] Create cloud database account
- [ ] Import your database export
- [ ] Get connection credentials

### 2. Code Repository

- [ ] Push code to GitHub/GitLab repository
- [ ] Ensure all files are committed:
  - [ ] `api/` folder with serverless functions
  - [ ] `frontend/` folder with Vue.js app
  - [ ] `vercel.json` configuration
  - [ ] Root `package.json`

### 3. Environment Variables

Prepare these values for Vercel:

- [ ] `DB_HOST` - Your cloud database host
- [ ] `DB_USER` - Database username
- [ ] `DB_PASSWORD` - Database password
- [ ] `DB_NAME` - Database name (usually `ticketing_system`)
- [ ] `DB_PORT` - Database port (usually `3306`)

## 🌐 Deployment Steps

### Step 1: Connect to Vercel

1. [ ] Go to [vercel.com](https://vercel.com)
2. [ ] Sign in with GitHub/GitLab
3. [ ] Click "New Project"
4. [ ] Import your repository

### Step 2: Configure Project

1. [ ] Framework Preset: **Vite**
2. [ ] Root Directory: **Leave empty** (uses root)
3. [ ] Build Command: **Auto-detected** (uses vercel.json)
4. [ ] Output Directory: **Auto-detected** (uses vercel.json)

### Step 3: Environment Variables

In Vercel dashboard:

1. [ ] Go to Settings → Environment Variables
2. [ ] Add each variable:
   ```
   DB_HOST = your-database-host
   DB_USER = your-database-username
   DB_PASSWORD = your-database-password
   DB_NAME = ticketing_system
   DB_PORT = 3306
   ```
3. [ ] Set environment to: **Production, Preview, Development**

### Step 4: Deploy

1. [ ] Click "Deploy"
2. [ ] Wait for build to complete (usually 2-3 minutes)
3. [ ] Check deployment logs for any errors

## 🔍 Post-Deployment Testing

### Functionality Tests

- [ ] Visit your Vercel URL
- [ ] Test dashboard loads with correct statistics
- [ ] Create a new ticket
- [ ] Edit an existing ticket
- [ ] Test different categories and priorities
- [ ] Verify search functionality
- [ ] Test responsive design on mobile

### API Tests

Test these endpoints:

- [ ] `GET /api/stats` - Dashboard statistics
- [ ] `GET /api/tickets` - Ticket list
- [ ] `POST /api/tickets` - Create ticket
- [ ] `PUT /api/tickets` - Update ticket
- [ ] `GET /api/categories` - Categories list

## 🐛 Troubleshooting

### Build Errors

- [ ] Check Vercel build logs in dashboard
- [ ] Ensure Node.js version is 18+ in package.json
- [ ] Verify all dependencies are listed correctly

### Database Connection Issues

- [ ] Verify environment variables are set correctly
- [ ] Check database credentials
- [ ] Ensure database accepts connections from Vercel IPs
- [ ] Test connection string format

### Frontend Issues

- [ ] Check browser console for JavaScript errors
- [ ] Verify API endpoints are accessible
- [ ] Test with different browsers
- [ ] Check mobile responsiveness

### Performance Issues

- [ ] Monitor Vercel analytics
- [ ] Check database query performance
- [ ] Optimize images and assets
- [ ] Enable caching if needed

## 📊 Success Metrics

Your deployment is successful when:

- [ ] Dashboard shows correct ticket counts (144 total tickets)
- [ ] All 6 categories are populated with data
- [ ] Status distribution: Open, In Progress, Closed, Resolved
- [ ] Priority distribution: Low, Medium, High, Urgent
- [ ] Page load time < 3 seconds
- [ ] Mobile interface works properly

## 🔄 Continuous Deployment

Once deployed:

- [ ] Any push to main branch auto-deploys
- [ ] Set up branch protection rules
- [ ] Configure preview deployments for pull requests
- [ ] Monitor deployment notifications

## 📈 Next Steps

After successful deployment:

- [ ] Set up custom domain (optional)
- [ ] Configure analytics and monitoring
- [ ] Set up database backups
- [ ] Plan for scaling and optimization
- [ ] Document API for future development

## 🆘 Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vue.js Guide**: [vuejs.org/guide](https://vuejs.org/guide)
- **Database Providers**:
  - PlanetScale: [planetscale.com/docs](https://planetscale.com/docs)
  - Railway: [docs.railway.app](https://docs.railway.app)
  - Supabase: [supabase.com/docs](https://supabase.com/docs)

---

**🎯 Ready to deploy!** Follow this checklist step-by-step for a smooth deployment process.
