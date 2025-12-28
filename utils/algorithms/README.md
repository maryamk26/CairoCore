# Algorithms Module

This module contains core algorithms for the CairoCore platform, including route optimization, place recommendations, and distance calculations.

## 📁 Structure

```
algorithms/
├── distance.ts              # Distance calculation algorithms
├── routeOptimization.ts     # Route optimization algorithms (TSP variants)
├── placeRecommendation.ts   # Place filtering and recommendation algorithms
├── index.ts                 # Central export point
└── README.md               # This file
```

## 🎯 Algorithms Overview

### 1. Distance Algorithms (`distance.ts`)

Calculates distances between geographic coordinates using the Haversine formula.

**Functions:**
- `calculateDistance(point1, point2)` - Calculate distance between two coordinates (in km)
- `calculateTravelTime(distance, averageSpeed)` - Estimate travel time in minutes
- `calculateDistanceMatrix(points)` - Create a distance matrix for multiple points
- `findNearestPoint(origin, points)` - Find the nearest point to an origin

**Example:**
```typescript
import { calculateDistance, calculateTravelTime } from '@/utils/algorithms';

const distance = calculateDistance(
  { lat: 30.0444, lng: 31.2357 }, // Cairo
  { lat: 29.9792, lng: 31.1342 }  // Pyramids
);
// Returns: ~13.5 km

const time = calculateTravelTime(distance, 30); // 30 km/h
// Returns: ~27 minutes
```

### 2. Route Optimization (`routeOptimization.ts`)

Optimizes the order of places in a route to minimize travel distance/time.

**Algorithms:**
- **Nearest Neighbor** - Greedy algorithm for quick route optimization
- **2-Opt** - Local search improvement algorithm
- **Hybrid** - Combines Nearest Neighbor with 2-Opt for best results

**Functions:**
- `nearestNeighborRoute(places, startIndex?)` - Greedy route optimization
- `twoOptOptimization(places, initialOrder, maxIterations?)` - Improve existing route
- `hybridRouteOptimization(places, startIndex?)` - Best quality optimization
- `optimizeRouteFromLocation(places, startLocation)` - Optimize from custom start point

**Example:**
```typescript
import { hybridRouteOptimization } from '@/utils/algorithms';

const places = [
  { id: '1', lat: 30.0444, lng: 31.2357 },
  { id: '2', lat: 29.9792, lng: 31.1342 },
  { id: '3', lat: 30.0479, lng: 31.2626 },
];

const optimized = hybridRouteOptimization(places);
// Returns: { order: [0, 2, 1], totalDistance: 25.3, estimatedTime: 51 }
```

### 3. Place Recommendation (`placeRecommendation.ts`)

Filters and ranks places based on user preferences and constraints.

**Functions:**
- `recommendPlaces(places, preferences)` - Score and rank places by preferences
- `filterPlacesByConstraints(places, constraints)` - Filter by constraints
- `getRecommendedPlaces(places, surveyResponse)` - Combined filtering and scoring

**Scoring Factors:**
- Vibe matching (30 points)
- Budget matching (20 points)
- Pet-friendly matching (10 points)
- Kids-friendly matching (10 points)
- Best time to visit (15 points)
- Rating boost (5 points)

**Example:**
```typescript
import { getRecommendedPlaces } from '@/utils/algorithms';

const surveyResponse = {
  preferences: {
    vibe: ['historical', 'photography'],
    budget: 'medium',
    petsFriendly: false,
    kidsFriendly: true,
  },
  constraints: {
    numberOfPlaces: 5,
  },
};

const recommended = getRecommendedPlaces(allPlaces, surveyResponse);
// Returns: Array of PlaceScore objects sorted by score
```

## 🚀 Usage in the Application

### Route Planning
```typescript
// In planner page or API route
import { hybridRouteOptimization, calculateDistance } from '@/utils/algorithms';

// 1. Get user-selected places
const selectedPlaces = getUserSelectedPlaces();

// 2. Optimize route
const optimized = hybridRouteOptimization(selectedPlaces);

// 3. Reorder places based on optimized order
const orderedPlaces = optimized.order.map(i => selectedPlaces[i]);
```

### Place Recommendations
```typescript
// In planner or search API
import { getRecommendedPlaces } from '@/utils/algorithms';

// 1. Get user survey/preferences
const surveyResponse = getUserSurvey();

// 2. Get recommended places
const recommendations = getRecommendedPlaces(allPlaces, surveyResponse);

// 3. Display top recommendations
const topPlaces = recommendations.slice(0, 10);
```

## 🔧 Algorithm Details

### Nearest Neighbor Algorithm
- **Complexity:** O(n²)
- **Quality:** Good for small to medium routes (< 20 places)
- **Use case:** Quick route optimization when speed is important

### 2-Opt Algorithm
- **Complexity:** O(n²) per iteration
- **Quality:** Good improvement on existing routes
- **Use case:** Refining routes from other algorithms

### Hybrid Approach
- Combines Nearest Neighbor (fast initial solution) with 2-Opt (refinement)
- **Best for:** Production use, balances speed and quality

### Recommendation Scoring
- Scoring system ranges from 0-100
- Places scoring 0 are filtered out
- Factors are weighted based on importance
- Mismatches in critical preferences (pets, kids) result in penalties

## 📊 Performance Considerations

- **Distance calculations:** O(1) per pair, O(n²) for full matrix
- **Nearest Neighbor:** O(n²) - suitable for routes up to ~50 places
- **2-Opt:** O(n²) per iteration - typically converges in < 100 iterations
- **Recommendation:** O(n×m) where n = places, m = preference factors

For very large datasets (> 100 places), consider:
- Pre-filtering before optimization
- Using approximate algorithms
- Caching distance matrices

## 🧪 Testing

Algorithm functions are pure functions and easy to test. Consider adding:
- Unit tests for distance calculations
- Route optimization tests with known optimal solutions
- Recommendation scoring tests with various preference combinations

## 🔮 Future Enhancements

Potential improvements:
- [ ] Genetic algorithm for route optimization (better quality for large routes)
- [ ] Machine learning-based recommendations (personalized scoring)
- [ ] Real-time traffic data integration for travel time estimates
- [ ] Multi-modal transportation routing (walking, driving, public transport)
- [ ] Time-window constraints for route optimization (opening hours)




