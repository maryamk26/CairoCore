# Quick Start: Supabase Setup for CairoCore

This is a quick reference guide for setting up Supabase authentication.

## Your Supabase Project Details

Based on your setup:
- **Project Reference**: `jkoutkpkplpezlijaspne`
- **Project URL**: `https://jkoutkpkplpezlijaspne.supabase.co`
- **Anon Key**: (Already provided - add to .env.local)

## Step 1: Create `.env.local` File

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jkoutkpkplpezlijaspne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb3V0a3BrbHBlemxpamFzcG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDgxNjIsImV4cCI6MjA4MjUyNDE2Mn0.B-3FTseFHDQI5L3UHzFgBsLDKCrTG9msQ0WT-feURbg

# Database (if using Prisma)
DATABASE_URL=your-database-url-here
```

**⚠️ Important**: Restart your dev server after adding these variables:
```bash
npm run dev
```

## Step 2: Enable Email Authentication

In your Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Configure email templates if needed

## Step 3: Configure Redirect URLs

In Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/callback*`

## Step 4: Test Authentication

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`
3. Click "Join Us" to test sign-up
4. Click "Sign In" to test sign-in

## Code Examples

### Sign Up (Already implemented in SignUpForm)

```typescript
import { supabase } from '@/lib/supabaseClient'

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

### Sign In (Already implemented in SignInForm)

```typescript
import { supabase } from '@/lib/supabaseClient'

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

### Get Current User

```typescript
import { supabase } from '@/lib/supabaseClient'

const { data: { user } } = await supabase.auth.getUser()
console.log(user?.id) // This is the Supabase user ID
```

### Protecting Routes (Already implemented in middleware.ts)

The middleware automatically protects routes. For manual protection:

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect('/sign-in')
}
```

## Connecting Supabase Auth with Prisma

Since Supabase manages authentication and Prisma manages your app data, you need to link them:

### Option 1: Update Prisma Schema

Add a `supabaseId` field to your User model:

```prisma
model User {
  id        String   @id @default(cuid())
  supabaseId String  @unique  // Add this field
  username  String   @unique
  email     String   @unique
  // ... rest of your fields
}
```

Then run:
```bash
npx prisma migrate dev --name add_supabase_id
```

### Option 2: Create User After Sign Up

In your sign-up flow, after Supabase creates the user:

```typescript
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabaseClient'

// After Supabase sign-up
const { data } = await supabase.auth.signUp({ email, password })

if (data.user) {
  // Create user in Prisma database
  await prisma.user.create({
    data: {
      supabaseId: data.user.id,
      email: data.user.email!,
      username: data.user.email!.split('@')[0],
    },
  })
}
```

Or use a database trigger in Supabase (see SUPABASE_SETUP.md for SQL example).

## Package Installation

The project already has Supabase installed:
- ✅ `@supabase/supabase-js` - Core Supabase client
- ✅ `@supabase/ssr` - SSR support for Next.js App Router

**Note**: We're using `@supabase/ssr` instead of `@supabase/auth-helpers-nextjs` because it's the current recommended package for Next.js 13+ App Router.

## Implementation Status

✅ All authentication components are already implemented:
- Sign In Form (`components/auth/SignInForm.tsx`)
- Sign Up Form (`components/auth/SignUpForm.tsx`)
- User Button (`components/auth/UserButton.tsx`)
- Protected Routes (middleware)
- Server-side auth utilities (`lib/auth.ts`)
- Client-side auth hook (`lib/hooks/useAuth.ts`)

You just need to:
1. Add environment variables to `.env.local`
2. Enable Email auth in Supabase dashboard
3. Configure redirect URLs
4. Test!

## Need More Help?

See `SUPABASE_SETUP.md` for detailed documentation.


