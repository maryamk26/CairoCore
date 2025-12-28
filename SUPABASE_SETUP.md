# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for CairoCore.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (your Supabase project URL)
   - **anon/public key** (your public anonymous key)

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

## Step 4: Configure Supabase Auth Settings

1. Go to **Authentication** → **URL Configuration** in your Supabase dashboard
2. Add your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/auth/callback?redirect=*`
     - (Add your production URLs when deploying)

## Step 5: Enable Email Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Make sure **Email** is enabled
3. Configure email templates if needed (optional)

## Step 6: Enable OAuth Providers (Optional)

To enable social login (Google, Apple, GitHub):

1. Go to **Authentication** → **Providers**
2. Enable the provider you want (e.g., Google)
3. Follow the setup instructions for each provider:
   - **Google**: You'll need to create OAuth credentials in Google Cloud Console
   - **Apple**: You'll need to configure Apple Sign In
   - **GitHub**: You'll need to create a GitHub OAuth App

## Step 7: Database Setup (User Profiles)

The authentication uses Supabase Auth, which automatically creates users in the `auth.users` table. To sync with your Prisma schema, you may want to:

1. Set up database triggers to create user profiles in your `users` table when a user signs up
2. Or create a user profile manually in API routes when needed

Example SQL trigger (run in Supabase SQL Editor):

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'first_name' || ' ' || NEW.raw_user_meta_data->>'last_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Step 8: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click "Join Us" to test sign-up
4. Click "Sign In" to test sign-in
5. Verify that authentication works correctly

## Authentication Features Implemented

✅ **Sign In Page**: `/sign-in`  
✅ **Sign Up Page**: `/sign-up`  
✅ **User Button**: Shows user menu when authenticated  
✅ **Sign In Button**: Shows in header when not authenticated  
✅ **Protected Routes**: Middleware protects all routes except public ones  
✅ **Server Utilities**: Helper functions in `lib/auth.ts` for server-side auth
✅ **OAuth Callback**: `/auth/callback` handles OAuth redirects

## Using Authentication in Your Code

### Client Components

```tsx
"use client";
import { useAuth } from "@/lib/hooks/useAuth";

export default function MyComponent() {
  const { user, isLoading, isSignedIn, userId } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome, {user?.email}!</div>;
}
```

### Server Components

```tsx
import { getCurrentUser, getCurrentUserId } from "@/lib/auth";

export default async function MyServerComponent() {
  const userId = await getCurrentUserId();
  const user = await getCurrentUser();

  if (!userId) {
    return <div>Not authenticated</div>;
  }

  return <div>User ID: {userId}</div>;
}
```

### API Routes

```tsx
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Your protected API logic here
  return Response.json({ userId: user.id });
}
```

## Protected Routes

The middleware (`middleware.ts`) automatically protects all routes except:
- `/` (home page)
- `/sign-in/*`
- `/sign-up/*`
- `/about`
- `/search`
- `/places/*`
- `/api/webhooks/*`
- `/api/auth/*`
- `/auth/callback`

To add more public routes, update the `publicRoutes` array in `middleware.ts`.

## Migration from Clerk

This project has been migrated from Clerk to Supabase Auth. If you were using Clerk before:

1. Remove Clerk environment variables from `.env.local`
2. Remove `@clerk/nextjs` from `package.json` (if desired): `npm uninstall @clerk/nextjs`
3. The old `lib/clerk.ts` has been replaced with `lib/auth.ts`
4. All components now use Supabase instead of Clerk

## Next Steps

After setting up Supabase:
1. Sync Supabase user data with your database (Prisma) if needed
2. Configure email templates in Supabase dashboard
3. Set up OAuth providers if you want social login
4. Test all authentication flows
5. Deploy and update production environment variables


