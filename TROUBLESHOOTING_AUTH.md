# Authentication Troubleshooting Guide

## Issue: Sign-in doesn't persist / User not showing as authenticated

### Symptoms
- User can sign in successfully
- After redirect, user appears as not authenticated
- `userId` is null in middleware and API routes
- Clerk cookies are present but not being read

### Root Causes & Solutions

## 1. Clerk Dashboard Configuration

### Check Session Settings
1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Select your application
3. Go to **Sessions** in the left sidebar
4. Verify these settings:

   **Session Token Template:**
   - Should be set to "Default" or properly configured
   
   **Session Lifetime:**
   - Recommended: 7 days (604800 seconds)
   
   **Inactivity Timeout:**
   - Recommended: 30 minutes (1800 seconds)

### Check Application URLs
1. Go to **Paths** in your Clerk Dashboard
2. Verify these URLs match your application:
   - **Home URL**: `http://localhost:3000` (for development)
   - **Sign-in URL**: `/sign-in`
   - **Sign-up URL**: `/sign-up`
   - **After sign-in URL**: `/`
   - **After sign-up URL**: `/`

### Check Domain Settings
1. Go to **Domains** in your Clerk Dashboard
2. For development, ensure `localhost` is properly configured
3. For production, add your production domain

## 2. Environment Variables

Check your `.env.local` file has these variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
```

**Important:** After changing environment variables, restart your dev server!

```bash
# Stop the server (Ctrl+C)
npm run dev
```

## 3. Browser Issues

### Clear Cookies and Cache
1. Open DevTools (F12)
2. Go to **Application** tab
3. Under **Storage**, click **Clear site data**
4. Refresh the page

### Check Cookies
1. Open DevTools (F12)
2. Go to **Application** > **Cookies** > `http://localhost:3000`
3. Look for cookies starting with `__session` or `__clerk`
4. If they're missing after sign-in, there's a session creation issue

### Try Incognito/Private Mode
Sometimes browser extensions or cached data can interfere. Try signing in using an incognito/private window.

## 4. Clerk Instance Settings

### Enable Development Mode
1. Go to your Clerk Dashboard
2. Go to **Settings** > **Advanced**
3. Ensure **Development mode** is enabled for your test instance

### Check Authentication Methods
1. Go to **User & Authentication** > **Email, Phone, Username**
2. Ensure **Email address** is enabled
3. Ensure **Password** is enabled
4. For social login (Google, Apple), ensure those are properly configured with OAuth credentials

## 5. Code Issues

### Verify ClerkProvider is Wrapping Your App
Check `app/layout.tsx`:

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      dynamic
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Verify Middleware is Configured
Check `middleware.ts` exists and has proper configuration.

## 6. Testing Steps

### Step 1: Visit Debug Page
1. Go to `http://localhost:3000/debug-auth`
2. Check all the auth states (should all show as not authenticated initially)

### Step 2: Sign Up/Sign In
1. Go to `http://localhost:3000/sign-in`
2. Sign in with your test account
3. Watch the browser console for logs
4. Watch the terminal for server logs

### Step 3: Check Debug Page After Sign In
1. After redirect, go back to `http://localhost:3000/debug-auth`
2. All auth states should now show as authenticated
3. User ID and Session ID should be present

### Step 4: Check Server Logs
Look for these in your terminal:
```
=== SIGN IN ATTEMPT ===
✅ Sign-in complete! Session ID: sess_xxx
✅ Session activated successfully!
```

Then after redirect:
```
=== MIDDLEWARE REQUEST ===
Auth state (for debugging): { userId: 'user_xxx', hasSession: true }
```

## 7. Common Issues

### Issue: "Session ID is null after sign-in"
**Solution:** The session might not be created. Check:
- Clerk Dashboard > Sessions > Ensure sessions are enabled
- Check if email verification is required but not completed

### Issue: "Cookies not being set"
**Solution:** 
- Check if you're using HTTPS in production (required for secure cookies)
- Check browser cookie settings (third-party cookies might be blocked)
- Ensure domain matches between Clerk Dashboard and your app

### Issue: "Auth works in one browser but not another"
**Solution:**
- Clear cookies and cache in the problematic browser
- Check if browser extensions are blocking cookies
- Try incognito/private mode

### Issue: "Auth works locally but not in production"
**Solution:**
- Update Clerk Dashboard domains to include production domain
- Update environment variables in production
- Ensure HTTPS is enabled in production
- Check CORS settings

## 8. Getting More Help

### Enable Verbose Logging
The app already has extensive logging. Check:
- Browser console (F12 > Console)
- Terminal where `npm run dev` is running

### Contact Clerk Support
If issues persist:
1. Go to https://clerk.com/support
2. Include:
   - Your Clerk Application ID
   - Browser console logs
   - Server terminal logs
   - Steps to reproduce

## 9. Quick Fixes

### Nuclear Option: Reset Everything
```bash
# 1. Stop the dev server
# 2. Clear all Clerk cookies in browser
# 3. Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 4. Restart dev server
npm run dev

# 5. Try signing in again
```

### Verify Clerk Package Version
```bash
npm list @clerk/nextjs
```

Should be version 5.x or higher for Next.js 14+.

If outdated:
```bash
npm install @clerk/nextjs@latest
```

## 10. Success Indicators

You'll know auth is working when:
- ✅ Sign-in redirects to home page
- ✅ Header shows user profile icon/button
- ✅ `/debug-auth` shows authenticated state
- ✅ Protected routes are accessible
- ✅ Middleware logs show `userId: 'user_xxx'`
- ✅ API routes can access user data




