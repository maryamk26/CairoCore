# Database Architecture - CairoCore

## Overview

The database architecture for CairoCore is built using Prisma ORM with PostgreSQL. The schema is designed to support a social platform for discovering and sharing places in Cairo, with features for memories, reviews, route planning, and social interactions.

## Database Models

### 1. User Model
- **Purpose**: User accounts with Clerk authentication integration
- **Key Fields**:
  - `clerkId`: Unique identifier from Clerk authentication
  - `username`, `email`: User identification
  - `isPrivate`: Privacy setting for profiles
  - `bio`, `avatar`, `location`, `website`: Profile information
- **Relations**: Memories, Saved Places, Reviews, Route Plans, Follows, Likes, Comments

### 2. Place Model
- **Purpose**: Places in Cairo (historical sites, museums, cafes, etc.)
- **Key Fields**:
  - `title`, `description`: Place information
  - `latitude`, `longitude`: GPS coordinates for mapping
  - `category`: Enum (HISTORICAL, MUSEUM, MOSQUE, CHURCH, PARK, CAFE, RESTAURANT, MARKET, LIBRARY, THEATER, OTHER)
  - `vibe`: Array of tags (e.g., ["romantic", "photography", "historical"])
  - `workingHours`, `entryFees`, `cameraFees`: Practical information
  - `petsFriendly`, `kidsFriendly`, `wheelchairAccessible`, `parkingAvailable`, `wifiAvailable`: Amenities
  - `status`: Enum (PENDING, APPROVED, REJECTED) for moderation
  - `viewCount`: Track popularity
- **Relations**: Memories, Saved Places, Reviews, Route Plans

### 3. Memory Model
- **Purpose**: User posts/experiences about places (Instagram-style posts)
- **Key Fields**:
  - `images`: Array of image URLs
  - `rating`: 1-5 stars
  - `pros`, `cons`: Arrays of positive/negative points
  - `comment`: Text description
  - `visitDate`: When the user visited
  - `isPublic`: Privacy setting
  - `likeCount`: Cached count for performance
- **Relations**: User, Place, Likes, Comments

### 4. PlaceReview Model
- **Purpose**: Ratings and reviews for places
- **Key Fields**:
  - `rating`: 1-5 stars
  - `comment`: Optional text review
- **Constraints**: One review per user per place (unique constraint)

### 5. SavedPlace Model
- **Purpose**: User's saved/favorited places (Pinterest-style pins)
- **Constraints**: One save per user per place (unique constraint)

### 6. RoutePlan Model
- **Purpose**: User's planned trips/routes
- **Key Fields**:
  - `title`: Optional route name
  - `date`: Planned date
  - `notes`: User notes about the route
  - `isPublic`: Allow sharing routes
- **Relations**: Multiple places via RoutePlanPlace

### 7. RoutePlanPlace Model
- **Purpose**: Junction table linking routes to places with ordering
- **Key Fields**:
  - `order`: Visit order
  - `estimatedArrival`, `estimatedDeparture`: Time estimates
  - `notes`: Place-specific notes

### 8. Follow Model
- **Purpose**: Social following/followers relationship
- **Constraints**: One follow relationship per pair (unique constraint)

### 9. MemoryLike Model
- **Purpose**: Likes on memories
- **Constraints**: One like per user per memory (unique constraint)

### 10. MemoryComment Model
- **Purpose**: Comments on memories
- **Key Fields**:
  - `content`: Comment text

## Database Features

### Indexes
The schema includes optimized indexes for:
- **User lookups**: `clerkId`, `username`, `email`
- **Place searches**: `title`, `category`, `status`, `latitude/longitude` (geospatial)
- **Memory feeds**: `userId`, `placeId`, `createdAt` (for chronological ordering)
- **Social features**: `followerId`, `followingId`, `memoryId` (for likes/comments)
- **Reviews**: `placeId`, `rating` (for aggregations)

### Enums
- **PlaceStatus**: `PENDING`, `APPROVED`, `REJECTED`
- **PlaceCategory**: `HISTORICAL`, `MUSEUM`, `MOSQUE`, `CHURCH`, `PARK`, `CAFE`, `RESTAURANT`, `MARKET`, `LIBRARY`, `THEATER`, `OTHER`

### Data Integrity
- Foreign keys with cascade deletes where appropriate
- Unique constraints to prevent duplicates (saves, reviews, follows, likes)
- Proper indexing for query performance

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file with:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/cairocore?schema=public"
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

4. **Push schema to database**:
   ```bash
   npm run db:push
   ```
   Or create a migration:
   ```bash
   npm run db:migrate
   ```

5. **Open Prisma Studio** (optional):
   ```bash
   npm run db:studio
   ```

## Integration Points

### Clerk Authentication
- Users are created with a `clerkId` that links to Clerk
- When a user signs up via Clerk, create a corresponding User record
- Use `clerkId` for authentication lookups

### API Routes (To be implemented)
- `/api/users` - User management
- `/api/places` - Place CRUD operations
- `/api/memories` - Memory operations
- `/api/reviews` - Review operations
- `/api/routes` - Route planning
- `/api/search` - Search functionality

## Next Steps

1. Create API routes for syncing Clerk users
2. Implement place creation and management endpoints
3. Build memory sharing features
4. Add route planning logic
5. Implement search and filtering
6. Add image upload functionality
7. Set up caching for frequently accessed data

## Performance Considerations

- Indexes are optimized for common query patterns
- `likeCount` is cached on Memory model to avoid counting on every query
- Geospatial indexes on Place coordinates for location-based queries
- Consider adding full-text search indexes for title/description searches

