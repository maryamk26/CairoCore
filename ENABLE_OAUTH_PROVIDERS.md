# Enable OAuth Providers in Supabase

## The Error You're Seeing

```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

This means you're trying to use Google OAuth, but it's not enabled in your Supabase project yet.

## Solution: Two Options

### Option 1: Use Email/Password (Recommended for Now)

**This is the simplest option** - just use the email and password fields on the sign-up/sign-in forms. No additional setup required!

1. Make sure **Email** provider is enabled in Supabase:
   - Go to **Authentication** → **Providers**
   - Enable **Email** (should be enabled by default)

2. Use the email/password form fields - they work immediately!

### Option 2: Enable Google OAuth (More Setup Required)

If you want to use Google sign-in, you need to:

#### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add **Authorized redirect URIs**:
   ```
   https://jkoutkpklpezlijaspne.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**

#### Step 2: Enable Google in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Click on **Google**
5. Enable it
6. Paste your **Client ID** and **Client Secret** from Google Cloud Console
7. Click **Save**

#### Step 3: Configure Redirect URLs

1. Still in Supabase, go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/callback*`

#### Step 4: Test

1. Restart your dev server
2. Try clicking "Continue with Google" again

## Quick Fix: Disable OAuth Buttons (Optional)

If you don't want to set up OAuth right now, you can temporarily hide the social login buttons by commenting them out in:
- `components/auth/SignUpForm.tsx`
- `components/auth/SignInForm.tsx`

But it's better to just use email/password for now!

## Current Status

✅ **Email/Password**: Should work (just enable Email provider if not already)
❌ **Google OAuth**: Needs setup (follow Option 2 above)
❌ **Apple OAuth**: Needs setup (similar to Google)
❌ **GitHub OAuth**: Needs setup (similar to Google)

## Recommendation

**Start with Email/Password authentication** - it's the simplest and works immediately. You can always add OAuth providers later when you need them.


