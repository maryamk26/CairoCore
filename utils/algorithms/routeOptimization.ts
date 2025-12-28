/**
 * Route optimization algorithms
 * Implements algorithms for optimizing the order of places in a route
 */

import { Coordinates, calculateDistance, calculateDistanceMatrix, findNearestPoint } from "./distance";

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

/**
 * 2-opt algorithm for improving an existing route
 * Local search heuristic that tries to improve a route by swapping edges
 * @param places Array of places with locations
 * @param initialOrder Initial route order (array of indices)
 * @param maxIterations Maximum number of iterations (default: 100)
 * @returns Improved route
 */
export function twoOptOptimization(
  places: PlaceWithLocation[],
  initialOrder: number[],
  maxIterations: number = 100
): OptimizedRoute {
  if (places.length <= 2) {
    const distance = places.length === 2
      ? calculateDistance(
          { lat: places[0].lat, lng: places[0].lng },
          { lat: places[1].lat, lng: places[1].lng }
        )
      : 0;
    return {
      order: initialOrder,
      totalDistance: distance,
      estimatedTime: Math.round((distance / 30) * 60),
    };
  }

  let bestOrder = [...initialOrder];
  let bestDistance = calculateRouteDistance(places, bestOrder);
  let improved = true;
  let iterations = 0;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = 1; i < bestOrder.length - 1; i++) {
      for (let j = i + 1; j < bestOrder.length; j++) {
        // Try swapping the segment between i and j
        const newOrder = twoOptSwap(bestOrder, i, j);
        const newDistance = calculateRouteDistance(places, newOrder);

        if (newDistance < bestDistance) {
          bestOrder = newOrder;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
  }

  const estimatedTime = Math.round((bestDistance / 30) * 60);

  return {
    order: bestOrder,
    totalDistance: Math.round(bestDistance * 100) / 100,
    estimatedTime,
  };
}

/**
 * Perform a 2-opt swap: reverse the segment between indices i and j
 */
function twoOptSwap(order: number[], i: number, j: number): number[] {
  const newOrder = [...order];
  const segment = newOrder.slice(i, j + 1).reverse();
  newOrder.splice(i, j - i + 1, ...segment);
  return newOrder;
}

/**
 * Calculate total distance of a route
 */
function calculateRouteDistance(
  places: PlaceWithLocation[],
  order: number[]
): number {
  let totalDistance = 0;

  for (let i = 0; i < order.length - 1; i++) {
    const currentIndex = order[i];
    const nextIndex = order[i + 1];
    totalDistance += calculateDistance(
      { lat: places[currentIndex].lat, lng: places[currentIndex].lng },
      { lat: places[nextIndex].lat, lng: places[nextIndex].lng }
    );
  }

  return totalDistance;
}

/**
 * Hybrid optimization: Nearest Neighbor + 2-opt improvement
 * @param places Array of places with locations
 * @param startIndex Optional starting point index
 * @returns Optimized route
 */
export function hybridRouteOptimization(
  places: PlaceWithLocation[],
  startIndex?: number
): OptimizedRoute {
  // Start with nearest neighbor
  const initialRoute = startIndex !== undefined
    ? nearestNeighborRoute(places, startIndex)
    : nearestNeighborRoute(places);

  // Improve with 2-opt
  return twoOptOptimization(places, initialRoute.order);
}




