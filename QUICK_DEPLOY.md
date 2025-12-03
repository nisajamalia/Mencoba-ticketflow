# 🚀 One-Click Vercel Deployment

Deploy your ticketing system to Vercel in just a few minutes!

## Quick Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ezrelafidelynn/TicketFlow&env=DB_HOST,DB_USER,DB_PASSWORD,DB_NAME,DB_PORT&envDescription=Database%20connection%20details%20-%20use%20Railway%20MySQL%20for%20free%20tier&demo-title=TicketFlow%20Demo&demo-description=Full-stack%20ticket%20management%20system%20with%20Vue.js%20and%20Node.js)

## 📋 Super Quick Setup (5 minutes)

### Option A: Use Railway MySQL (Free - Recommended)

1. **Click the Deploy button above** ⬆️
2. **Connect your GitHub account** to Vercel
3. **Create Railway database:**

   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Create new project
   - Add MySQL service
   - Copy connection details

4. **Add environment variables in Vercel:**

   ```
   DB_HOST=containers-us-west-xxx.railway.app
   DB_USER=root
   DB_PASSWORD=your-password
   DB_NAME=railway
   DB_PORT=3306
   ```

5. **Deploy!** - Your site will be live in ~3 minutes

### Option B: Automated Setup (Requires Node.js)

```bash
# Clone and setup
git clone https://github.com/ezrelafidelynn/TicketFlow.git
cd TicketFlow

# Auto-setup database
npm run setup-db

# Deploy to Vercel
npx vercel --prod
```

## 🎯 What You Get

- ✅ **Full ticketing system** with 144 sample tickets
- ✅ **6 categories** with balanced data
- ✅ **Dashboard with real statistics**
- ✅ **Responsive design** for all devices
- ✅ **Serverless backend** that auto-scales
- ✅ **Free hosting** on Vercel + Railway

## 📊 Sample Data Included

Your deployed system comes with:

- **31 users** (1 admin + 30 regular users)
- **144 tickets** across all categories
- **Status distribution:** Open (49), In Progress (45), Closed (30), Resolved (20)
- **Priority levels:** Low (36), Medium (48), High (48), Urgent (12)
- **6 categories:** Bug Report, Feature Request, Technical Support, Account Issue, General Inquiry, Billing

## 🔧 Environment Variables

Only these 5 variables needed:

| Variable      | Description       | Example                              |
| ------------- | ----------------- | ------------------------------------ |
| `DB_HOST`     | Database hostname | `containers-us-west-xxx.railway.app` |
| `DB_USER`     | Database username | `root`                               |
| `DB_PASSWORD` | Database password | `your-secure-password`               |
| `DB_NAME`     | Database name     | `railway`                            |
| `DB_PORT`     | Database port     | `3306`                               |

## 🆘 Need Help?

**Database Issues?**

- Ensure Railway MySQL service is running
- Check if connection details are correct
- Verify Vercel environment variables

**Deployment Issues?**

- Check Vercel build logs
- Ensure Node.js version is 18+
- Verify all environment variables are set

**Still stuck?** Open an issue on GitHub!

---

**🎊 That's it!** Your ticketing system is now live and ready to use!
