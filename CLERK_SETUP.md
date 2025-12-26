# Clerk Authentication Setup Guide

This guide will help you set up Clerk authentication for CairoCore.

## Step 1: Create a Clerk Account

1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

## Step 2: Get Your API Keys

1. In your Clerk dashboard, go to **API Keys**
2. Copy the following:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
```

## Step 4: Configure Clerk Dashboard

1. Go to **Paths** in your Clerk dashboard
2. Set the following:
   - Sign-in path: `/sign-in`
   - Sign-up path: `/sign-up`
   - After sign-in redirect: `/`
   - After sign-up redirect: `/`

## Step 5: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click "Sign In" to test the authentication flow
4. Create a test account and verify sign-in/sign-up works

## Authentication Features Implemented

✅ **Sign In Page**: `/sign-in`  
✅ **Sign Up Page**: `/sign-up`  
✅ **User Button**: Shows user menu when authenticated  
✅ **Sign In Button**: Shows in header when not authenticated  
✅ **Protected Routes**: Middleware protects all routes except public ones  
✅ **Server Utilities**: Helper functions in `lib/clerk.ts` for server-side auth

## Using Authentication in Your Code

### Client Components

```tsx
"use client";
import { useUser, useAuth } from "@clerk/nextjs";

export default function MyComponent() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  return <div>Welcome, {user?.firstName}!</div>;
}
```

### Server Components

```tsx
import { getCurrentUser, getCurrentUserId } from "@/lib/clerk";

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
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Your protected API logic here
  return Response.json({ userId });
}
```

## Protected Routes

The middleware (`middleware.ts`) automatically protects all routes except:
- `/` (home page)
- `/sign-in/*`
- `/sign-up/*`
- `/api/webhooks/*`

To add more public routes, update the `isPublicRoute` matcher in `middleware.ts`.

## Next Steps

After setting up Clerk:
1. Sync Clerk user data with your database (Prisma)
2. Create user profiles in your database
3. Implement user-specific features

