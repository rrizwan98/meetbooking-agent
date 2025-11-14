# Vercel Deployment Guide

## Quick Fix for 404 Error

If you're getting 404 errors in production, follow these steps:

### 1. File Structure
Make sure your files are in the correct location:
```
/
├── api/
│   └── submit-lead.js  ✅ (Serverless function)
├── public/
│   └── index.html      ✅ (Static file)
├── package.json        ✅
└── vercel.json         ✅ (Optional, for routing)
```

### 2. Environment Variables
In Vercel Dashboard:
1. Go to **Project Settings** → **Environment Variables**
2. Add: `DATABASE_URL` = `postgresql://neondb_owner:npg_yfVJT48LGBOM@ep-muddy-bird-a44rcp30-pooler.us-east-1.aws.neon.tech/voice_agents?sslmode=require&channel_binding=require`
3. Apply to: **Production, Preview, Development**

### 3. Deploy
```bash
git add .
git commit -m "Fix Vercel deployment"
git push
```

Vercel will auto-deploy.

### 4. Verify
- API endpoint: `https://your-domain.vercel.app/api/submit-lead`
- Form page: `https://your-domain.vercel.app/`

### Troubleshooting

**If still getting 404:**
1. Check Vercel build logs for errors
2. Verify `api/submit-lead.js` exists and exports handler correctly
3. Make sure `package.json` includes `pg` dependency
4. Check that environment variable `DATABASE_URL` is set

**Test locally with Vercel CLI:**
```bash
npm i -g vercel
vercel dev
```

