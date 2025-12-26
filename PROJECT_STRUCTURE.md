# CairoCore Project Structure

This document outlines the complete architecture and folder structure of the CairoCore project.

## 📁 Directory Structure

```
CairoCore/
├── app/                          # Next.js App Router (main application)
│   ├── api/                      # API routes (REST endpoints)
│   │   └── (to be implemented)
│   ├── places/                   # Place-related pages
│   │   └── [id]/                 # Individual place pages
│   ├── profile/                  # User profile pages
│   │   └── [username]/           # Individual user profiles
│   ├── search/                   # Search page
│   │   └── page.tsx
│   ├── planner/                  # Route planner page
│   │   └── page.tsx
│   ├── layout.tsx                # Root layout (wraps all pages)
│   ├── page.tsx                  # Home page (feed)
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   └── (buttons, cards, modals, etc.)
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # Top navigation bar
│   │   └── Footer.tsx            # Bottom navigation (Instagram-style)
│   ├── places/                   # Place-specific components
│   │   ├── PlaceCard.tsx
│   │   ├── PlaceCarousel.tsx
│   │   └── PlaceInfoTable.tsx
│   ├── memories/                 # Memory/Post components
│   │   ├── MemoryCard.tsx
│   │   ├── MemoryFeed.tsx
│   │   └── MemoryForm.tsx
│   └── navigation/               # Navigation components
│       └── (to be implemented)
│
├── lib/                          # Library and utility functions
│   ├── prisma.ts                 # Prisma client instance
│   └── utils.ts                  # Utility functions (cn, etc.)
│
├── types/                        # TypeScript type definitions
│   └── index.ts                  # All type definitions
│       ├── User
│       ├── Place
│       ├── Memory
│       ├── RoutePlan
│       └── SurveyResponse
│
├── utils/                        # Helper functions
│   └── (date formatting, validation, etc.)
│
├── prisma/                       # Database schema
│   └── schema.prisma             # Prisma schema definition
│       ├── User model
│       ├── Place model
│       ├── Memory model
│       ├── SavedPlace model
│       ├── PlaceReview model
│       ├── RoutePlan model
│       └── RoutePlanPlace model
│
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   └── icons/                    # Icon assets
│
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── .eslintrc.json                # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Project documentation
```

## 🗄️ Database Schema Overview

### Models

1. **User**
   - User accounts with profiles
   - Privacy settings (public/private)
   - Relations: memories, saved places, reviews, route plans

2. **Place**
   - Places in Cairo (historical sites, museums, etc.)
   - Location data (lat/lng, address)
   - Working hours, fees, amenities
   - Status: approved/pending/rejected
   - Relations: memories, saved places, reviews, route plans

3. **Memory**
   - User posts/feedback about places
   - Images, rating, pros/cons, comments
   - Relations: user, place

4. **SavedPlace**
   - User's saved/favorited places (Pinterest-style pins)
   - Relations: user, place

5. **PlaceReview**
   - Ratings and reviews for places
   - Relations: user, place

6. **RoutePlan**
   - User's planned trips/routes
   - Relations: user, places (via RoutePlanPlace)

7. **RoutePlanPlace**
   - Junction table for route plans and places
   - Includes order and time estimates
   - Relations: route plan, place

## 🎨 Component Architecture

### Layout Components
- **Header**: Top navigation bar with logo and main nav
- **Footer**: Bottom navigation (Instagram-style) with 4 buttons:
  - Home
  - Search
  - Planner
  - Profile

### Page Components
- **Home Page**: Feed of memories from followed users
- **Search Page**: Search and filter places
- **Planner Page**: Survey-based route planning
- **Profile Page**: User profile (Pinterest-style grid)
- **Place Page**: Individual place details with carousel, info table, reviews

## 🔌 API Structure (To be implemented)

```
/api/
├── auth/              # Authentication endpoints
├── users/             # User management
├── places/            # Place CRUD operations
├── memories/          # Memory/Post operations
├── reviews/           # Review operations
├── routes/            # Route planning
└── search/            # Search functionality
```

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Prisma)
- **ORM**: Prisma
- **Maps**: Google Maps API (to be integrated)
- **Image Upload**: Cloudinary or AWS S3 (to be configured)
- **Authentication**: NextAuth.js (to be implemented)

## 📝 Next Steps

1. **Upgrade Node.js** to 20.19.0+ (required for Prisma)
2. **Set up database** (PostgreSQL)
3. **Install Prisma** and run migrations
4. **Set up authentication** (NextAuth.js)
5. **Configure image upload** service
6. **Integrate Google Maps API**
7. **Build UI components**
8. **Implement API routes**
9. **Add route planning logic**

## 🔐 Environment Variables Needed

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."
UPLOAD_PRESET="..."
CLOUDINARY_URL="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

