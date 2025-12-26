# CairoCore

A website for discovering and sharing historical places, museums, hidden gems, and famous spots in Cairo, Egypt.

## About

CairoCore is a platform for tourists, bloggers, photographers, and anyone who wants to explore and share their experiences visiting places in Cairo.

## Features

- Discover places in Cairo (historical sites, museums, hidden gems)
- Share memories and feedback about places
- Rate and review locations
- Plan routes and trips
- Save favorite places

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: (To be configured - Prisma recommended)

## Project Structure

```
CairoCore/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── places/            # Place pages
│   ├── profile/           # User profile pages
│   ├── search/            # Search page
│   ├── planner/           # Route planner page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── places/           # Place-related components
│   ├── memories/         # Memory/Post components
│   └── navigation/       # Navigation components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── utils/                # Helper functions
├── prisma/               # Database schema (when added)
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- **Node.js 20.19.0 or higher** (required for Prisma)
  - Currently detected: Node.js 18.19.1
  - **Action needed**: Upgrade Node.js before installing Prisma
  - You can use `nvm` (Node Version Manager) to install and switch versions
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com:maryamk26/CairoCore.git
cd CairoCore
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Database
DATABASE_URL="your-database-url"

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

**To get your Clerk keys:**
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your Publishable Key and Secret Key from the dashboard
4. Add them to your `.env.local` file

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Roadmap

- [x] Authentication system (Clerk)
- [ ] Database setup (Prisma)
- [ ] User profiles
- [ ] Place management
- [ ] Memory/Post system
- [ ] Route planning with maps
- [ ] Search functionality
- [ ] Image upload system

## License

ISC

---

*More details coming soon...*
