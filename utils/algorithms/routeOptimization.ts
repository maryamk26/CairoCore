/**
 * Route optimization algorithms
 * Implements algorithms for optimizing the order of places in a route
 */

import { Coordinates, calculateDistance, findNearestPoint } from "./distance";

export interface PlaceWithLocation {
  id: string;
  lat: number;
  lng: number;
}

export interface OptimizedRoute {
  order: number[];
  totalDistance: number;
  estimatedTime: number; // in minutes
}

/**
 * Nearest Neighbor Algorithm for route optimization
 * A greedy heuristic for approximating the Traveling Salesman Problem
 * @param places Array of places with locations
 * @param startIndex Optional starting point index (default: 0)
 * @returns Optimized route with order and total distance
 */
export function nearestNeighborRoute(
  places: PlaceWithLocation[],
  startIndex: number = 0
): OptimizedRoute {
  if (places.length <= 1) {
    return {
      order: [0],
      totalDistance: 0,
      estimatedTime: 0,
    };
  }

  const visited = new Set<number>();
  const order: number[] = [startIndex];
  visited.add(startIndex);

  let currentIndex = startIndex;
  let totalDistance = 0;

  // Build route by always going to the nearest unvisited place
  while (visited.size < places.length) {
    let nearestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < places.length; i++) {
      if (!visited.has(i)) {
        const distance = calculateDistance(
          { lat: places[currentIndex].lat, lng: places[currentIndex].lng },
          { lat: places[i].lat, lng: places[i].lng }
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = i;
        }
      }
    }

    if (nearestIndex !== -1) {
      order.push(nearestIndex);
      visited.add(nearestIndex);
      totalDistance += minDistance;
      currentIndex = nearestIndex;
    }
  }

  // Calculate estimated travel time (assuming 30 km/h average speed)
  const estimatedTime = Math.round((totalDistance / 30) * 60);

  return {
    order,
    totalDistance: Math.round(totalDistance * 100) / 100, // Round to 2 decimal places
    estimatedTime,
  };
}

/**
 * Optimize route starting from a specific location (not necessarily a place in the list)
 * @param places Array of places with locations
 * @param startLocation Starting location
 * @returns Optimized route
 */
export function optimizeRouteFromLocation(
  places: PlaceWithLocation[],
  startLocation: Coordinates
): OptimizedRoute {
  // Find the nearest place to start from
  const placesCoordinates: Coordinates[] = places.map((p) => ({
    lat: p.lat,
    lng: p.lng,
  }));
  
  const startPlaceIndex = findNearestPoint(startLocation, placesCoordinates);
  return nearestNeighborRoute(places, startPlaceIndex);
}


