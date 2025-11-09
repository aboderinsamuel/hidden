# 🚀 Deploying to Vercel

Auth works locally but not in production? Here's how to fix it.

---

## Quick Fix (3 steps)

### 1. Add Environment Variables to Vercel

Go to your Vercel project → **Settings** → **Environment Variables**

Add these (get values from your `.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
```

Select **All environments**, then save.

### 2. Configure Supabase

Go to [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **URL Configuration**

Add your Vercel URL to **Redirect URLs**:
```
http://localhost:3000/**
https://your-app.vercel.app/**
```

Set **Site URL** to:
```
https://your-app.vercel.app
```

Turn off **"Confirm email"** in **Authentication → Settings** (for easier testing).

### 3. Redeploy

Push a new commit or go to Vercel → Deployments → Redeploy.

---

## Still broken?

### Check these:
- Is your Supabase project paused? (free tier pauses after 7 days)
- Did you redeploy after adding environment variables?
- Open browser console (F12) and check for error messages
- Run this in console: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`

### Common errors:
- **"Failed to fetch"** → Supabase project is paused
- **"Invalid API key"** → Environment variables missing or wrong
- **Redirects to localhost** → Update Site URL in Supabase

---

## Testing

Visit your deployed app, open console (F12), and try signing up. You should see:
```
[auth] Attempting signup for: test@example.com
[auth] Signup successful
```

If you see errors instead, check the Supabase and Vercel settings above.

---

That's it! Auth should work now. If you're still stuck, check the error message in your browser console and search for it in [Supabase docs](https://supabase.com/docs/guides/auth).
