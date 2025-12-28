# Fix Supabase URL Error

## The Problem
You're seeing a DNS error: `jkoutkpkplpezlijaspne.supabase.co` cannot be resolved.

This means the Supabase project URL in your `.env.local` file is incorrect.

## How to Fix It

### Step 1: Get Your Correct Supabase Project URL

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project (or create a new one if you don't have one)
4. Go to **Settings** → **API**
5. Look for **Project URL** - it should look like:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
6. Copy this URL exactly

### Step 2: Update Your .env.local File

Open `.env.local` and replace the `NEXT_PUBLIC_SUPABASE_URL` with your correct URL:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-settings-api
```

### Step 3: Get Your Anon Key

While you're in **Settings** → **API**:
1. Find **Project API keys**
2. Copy the **anon/public** key
3. Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

### Step 4: Enable Google OAuth Provider

Before using Google sign-in, you need to enable it:

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Find **Google** in the list
3. Click **Enable**
4. You'll need to:
   - Create OAuth credentials in Google Cloud Console
   - Add the Client ID and Client Secret to Supabase
   - Add authorized redirect URLs

**For now, you can skip OAuth and use Email/Password authentication** which is simpler to set up.

### Step 5: Restart Your Dev Server

After updating `.env.local`:

```bash
# Stop your server (Ctrl+C)
npm run dev
```

## Quick Check

After updating, verify your `.env.local` has:
- ✅ Correct Supabase project URL (from Settings → API)
- ✅ Correct anon key (from Settings → API)
- ✅ Server restarted

Then try signing up with **email/password** first (simpler than OAuth).


