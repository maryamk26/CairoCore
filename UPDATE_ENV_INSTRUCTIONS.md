# Update Environment Variables

## ✅ What Was Fixed

I've updated your `.env.local` file with the correct Supabase URL:
- ✅ Updated: `NEXT_PUBLIC_SUPABASE_URL=https://jkoutkpklpezlijaspne.supabase.co`

## ⚠️ Next Steps Required

### 1. Verify Your Anon Key

The anon key in your `.env.local` file might need to match your new project. 

**To get the correct anon key:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Find **Project API keys**
5. Copy the **anon/public** key
6. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

### 2. Enable Email Authentication (Required)

Before you can sign up/sign in:

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable **Email** provider
3. (Optional) Configure email templates

### 3. Configure Redirect URLs (For OAuth)

If you want to use Google OAuth:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/callback*`

### 4. Enable Google OAuth Provider (Optional)

1. Go to **Authentication** → **Providers**
2. Click on **Google**
3. Enable it
4. You'll need to:
   - Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com/)
   - Add Client ID and Client Secret to Supabase
   - Configure authorized redirect URIs

**For now, start with Email/Password authentication** - it's simpler and doesn't require OAuth setup.

### 5. Restart Your Dev Server

**IMPORTANT**: After updating `.env.local`, you MUST restart your dev server:

```bash
# Stop your current server (Ctrl+C), then:
npm run dev
```

## Test Authentication

1. After restarting, go to `http://localhost:3000`
2. Click "Join Us" 
3. Try signing up with **Email/Password** first (simpler than OAuth)
4. Once that works, you can set up Google OAuth if needed


