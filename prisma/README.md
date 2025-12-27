# Database Setup Guide

This guide will help you set up the Prisma database for CairoCore.

## Prerequisites

- Node.js 20.19.0 or higher
- PostgreSQL database (local or remote)
- A `.env` file with your `DATABASE_URL`

## Database Schema Overview

The database includes the following models:

### Core Models

1. **User** - User accounts with Clerk integration
   - Links to Clerk authentication via `clerkId`
   - Supports social features (following/followers)
   - Privacy settings

2. **Place** - Places in Cairo
   - Location data (latitude/longitude)
   - Categories (Historical, Museum, Mosque, etc.)
   - Working hours, fees, amenities
   - Status: PENDING, APPROVED, REJECTED

3. **Memory** - User posts/experiences about places
   - Images, ratings, pros/cons
   - Supports likes and comments
   - Can be public or private

4. **PlaceReview** - Ratings and reviews for places
   - 1-5 star ratings
   - Optional comments

5. **SavedPlace** - User's saved/favorited places

6. **RoutePlan** - User's planned trips/routes
   - Can include multiple places
   - Supports ordering and time estimates

### Social Features

- **Follow** - Following/followers relationship
- **MemoryLike** - Likes on memories
- **MemoryComment** - Comments on memories

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install `@prisma/client` and `prisma` (dev dependency).

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your database connection string:

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/cairocore?schema=public"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Push Schema to Database

For development (quick setup):

```bash
npm run db:push
```

Or create a migration (recommended for production):

```bash
npm run db:migrate
```

This will:
- Create the database tables
- Set up all relationships
- Create indexes for performance

### 5. (Optional) Open Prisma Studio

View and edit your database visually:

```bash
npm run db:studio
```

## Database Schema Features

### Indexes

The schema includes optimized indexes for:
- User lookups (clerkId, username, email)
- Place searches (title, category, status, location)
- Memory feeds (userId, placeId, createdAt)
- Social features (follows, likes, comments)

### Enums

- **PlaceStatus**: PENDING, APPROVED, REJECTED
- **PlaceCategory**: HISTORICAL, MUSEUM, MOSQUE, CHURCH, PARK, CAFE, RESTAURANT, MARKET, LIBRARY, THEATER, OTHER

### Relationships

All relationships use proper foreign keys with cascade deletes where appropriate:
- User deletion cascades to their memories, reviews, etc.
- Place deletion cascades to related memories and reviews

## Common Commands

```bash
# Generate Prisma Client after schema changes
npm run db:generate

# Push schema changes to database (development)
npm run db:push

# Create and apply migration (production)
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Integration with Clerk

The User model includes a `clerkId` field that should be synced with Clerk authentication:

1. When a user signs up via Clerk, create a User record with their `clerkId`
2. Use `clerkId` to look up users in your database
3. The `clerkId` field is unique and indexed for fast lookups

## Next Steps

After setting up the database:

1. Create API routes to sync Clerk users with your database
2. Implement place creation and management
3. Build memory/experience sharing features
4. Add route planning functionality
5. Implement search and filtering

## Troubleshooting

### Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall settings if using a remote database

### Migration Issues

- If migrations fail, you can reset: `npx prisma migrate reset`
- For development, use `db:push` instead of migrations

### Type Errors

- Run `npm run db:generate` after schema changes
- Restart your TypeScript server in your IDE


