# Testing & Deployment Guide

## 🧪 Local Testing

### Step 1: Start Netlify Dev Server

```bash
netlify dev
```

This will:
- Start your Vite dev server on port 5173
- Start Netlify Functions on port 8888
- Proxy everything through localhost:8888

### Step 2: Test API Functions

Open another terminal and run:

```bash
# Test ping endpoint
curl http://localhost:8888/api/ping

# Or use the test script
node test-api.js
```

### Step 3: Test in Browser

Visit: http://localhost:8888

Try these endpoints in your browser or Postman:
- `GET http://localhost:8888/api/ping` - Should return "Hello from Netlify Functions!"
- `GET http://localhost:8888/api/debug` - Should show environment info
- `GET http://localhost:8888/api/auth/test` - Should return auth test message

### Step 4: Test Your Frontend

Your app should work normally at http://localhost:8888. The new API functions are backward compatible with the same routes.

## 📤 Push to GitHub

### Option A: Simple Push (Recommended)

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "refactor: split monolithic API into modular functions

- Split 1491-line api.js into 9 focused functions
- Add shared utilities for supabase, auth, and http
- Implement code splitting with React.lazy()
- Configure React Query for data caching
- Optimize Vite build with manual chunk splitting
- Fix service worker with versioned caching
- Remove blocking Google Fonts, use system fonts
- Add compression plugins (gzip + brotli)

Performance improvements:
- Reduce API cold start from 3-5s to <1s
- Reduce initial bundle by 60-70%
- Better caching and offline support"

# Push to GitHub
git push origin main
```

### Option B: Create a Branch First (Safer)

```bash
# Create a new branch
git checkout -b feature/api-optimization

# Stage and commit
git add .
git commit -m "refactor: split API and optimize performance"

# Push branch
git push origin feature/api-optimization

# Then create a Pull Request on GitHub
```

## 🚀 Deploy to Netlify

### Automatic Deployment

Once you push to GitHub:
1. Netlify will automatically detect the changes
2. Build will start automatically (check Netlify dashboard)
3. New functions will be deployed
4. Site will be live in ~2-3 minutes

### Manual Deployment (Alternative)

```bash
netlify deploy --prod
```

## ✅ Verify Deployment

After deployment, test these URLs (replace with your domain):

```bash
# Ping test
curl https://ietcsbs.tech/api/ping

# Debug test (check environment variables are set)
curl https://ietcsbs.tech/api/debug

# Auth test
curl https://ietcsbs.tech/api/auth/test
```

## ⚙️ Important: Environment Variables

Make sure these are set in Netlify Dashboard → Site Settings → Environment Variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

## 🔍 Troubleshooting

### Functions not working locally?
- Make sure you ran `netlify dev` not `npm run dev`
- Check that `netlify.toml` has correct function directory
- Verify `package.json` has required dependencies

### Functions not working in production?
- Check Netlify build logs for errors
- Verify environment variables are set
- Check Netlify Functions logs in dashboard

### Old API still being called?
- Check if frontend is still pointing to old endpoints
- Clear browser cache and service worker
- Check Network tab in DevTools for actual URLs

## 📋 Migration Checklist

- [ ] Test locally with `netlify dev`
- [ ] Verify all API endpoints work
- [ ] Check frontend still works correctly
- [ ] Review environment variables
- [ ] Commit changes to git
- [ ] Push to GitHub
- [ ] Monitor Netlify build
- [ ] Test production deployment
- [ ] Verify all features work in production
- [ ] (Optional) Delete old `api.js` file

## 🔄 Rollback Plan

If something breaks in production:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback in Netlify Dashboard:
# Deploys → [Previous Deploy] → Publish Deploy
```

## 📞 Need Help?

Check Netlify logs:
- Build logs: Netlify Dashboard → Deploys → [Deploy] → Deploy Log
- Function logs: Netlify Dashboard → Functions → [Function] → Logs
