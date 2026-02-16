import { PlaceRecommendation } from "./recommendation";
import { calculateDistance } from "../algorithms/distance";

interface WorkingHours {
  open: string;
  close: string;
}

interface TimeSlot {
  hours: number;
  minutes: number;
}

/**
 * Optimizes route using nearest-neighbor algorithm
 * Starts from starting point, then always goes to nearest unvisited place
 */
export function optimizeRouteByDistance(
  startLat: number,
  startLng: number,
  places: PlaceRecommendation[]
): PlaceRecommendation[] {
  if (places.length === 0) return [];
  if (places.length === 1) return places;

  const optimizedRoute: PlaceRecommendation[] = [];
  const remaining = [...places];
  let currentLat = startLat;
  let currentLng = startLng;

  // Nearest-neighbor algorithm: always go to the closest unvisited place
  while (remaining.length > 0) {
    let nearestIndex = 0;
    let shortestDistance = calculateDistance(
      currentLat,
      currentLng,
      remaining[0].latitude,
      remaining[0].longitude
    );

    // Find the nearest place from current location
    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(
        currentLat,
        currentLng,
        remaining[i].latitude,
        remaining[i].longitude
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestIndex = i;
      }
    }

    // Add nearest place to route
    const nearestPlace = remaining[nearestIndex];
    optimizedRoute.push(nearestPlace);
    
    // Update current position
    currentLat = nearestPlace.latitude;
    currentLng = nearestPlace.longitude;
    
    // Remove from remaining
    remaining.splice(nearestIndex, 1);
  }

  return optimizedRoute;
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Add minutes to a time
 */
function addMinutes(timeInMinutes: number, minutesToAdd: number): number {
  return timeInMinutes + minutesToAdd;
}

/**
 * Format minutes since midnight to HH:MM AM/PM
 */
function formatTime(minutes: number): string {
  const hours24 = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 < 12 ? 'AM' : 'PM';
  return `${hours12}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Get current day of week
 */
function getCurrentDay(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
}

/**
 * Check if a place will be open when user arrives
 */
export function checkWorkingHours(
  place: PlaceRecommendation,
  estimatedArrivalMinutes: number
): {
  isOpen: boolean;
  closingTime: string | null;
  warning: string | null;
} {
  if (!place.workingHours) {
    return {
      isOpen: true,
      closingTime: null,
      warning: null
    };
  }

  const today = getCurrentDay();
  const todayHours = place.workingHours[today as keyof typeof place.workingHours] as WorkingHours | undefined;

  if (!todayHours || !todayHours.open || !todayHours.close) {
    return {
      isOpen: false,
      closingTime: null,
      warning: `${place.title} appears to be closed today`
    };
  }

  const openingMinutes = parseTime(todayHours.open);
  const closingMinutes = parseTime(todayHours.close);
  const arrivalMinutes = estimatedArrivalMinutes % (24 * 60); // Handle day overflow

  // Check if arrival is before opening
  if (arrivalMinutes < openingMinutes) {
    return {
      isOpen: false,
      closingTime: formatTime(closingMinutes),
      warning: `You'll arrive at ${place.title} before it opens (${formatTime(openingMinutes)})`
    };
  }

  // Check if arrival is after closing
  if (arrivalMinutes >= closingMinutes) {
    return {
      isOpen: false,
      closingTime: formatTime(closingMinutes),
      warning: `You'll arrive at ${place.title} after it closes (${formatTime(closingMinutes)})`
    };
  }

  // Check if there's enough time before closing (at least 30 minutes)
  const timeUntilClosing = closingMinutes - arrivalMinutes;
  if (timeUntilClosing < 30) {
    return {
      isOpen: true,
      closingTime: formatTime(closingMinutes),
      warning: `${place.title} will close soon after you arrive (${formatTime(closingMinutes)})`
    };
  }

  return {
    isOpen: true,
    closingTime: formatTime(closingMinutes),
    warning: null
  };
}

/**
 * Calculate estimated arrival times for each place in the route
 * @param startTime - Starting time in minutes since midnight (e.g., 10:30 AM = 630)
 * @param places - Ordered list of places
 * @param travelTimes - Travel time to each place in minutes
 * @param avgVisitDuration - Average time spent at each place in minutes (default 90)
 */
export function calculateArrivalTimes(
  startTime: number,
  places: PlaceRecommendation[],
  travelTimes: number[],
  avgVisitDuration: number = 90
): {
  place: PlaceRecommendation;
  arrivalTime: number;
  arrivalTimeFormatted: string;
  workingHoursCheck: ReturnType<typeof checkWorkingHours>;
}[] {
  let currentTime = startTime;
  const results = [];

  for (let i = 0; i < places.length; i++) {
    // Add travel time to current place
    currentTime = addMinutes(currentTime, travelTimes[i]);
    
    const workingHoursCheck = checkWorkingHours(places[i], currentTime);
    
    results.push({
      place: places[i],
      arrivalTime: currentTime,
      arrivalTimeFormatted: formatTime(currentTime),
      workingHoursCheck
    });

    // Add visit duration for next calculation (except for last place)
    if (i < places.length - 1) {
      currentTime = addMinutes(currentTime, avgVisitDuration);
    }
  }

  return results;
}

/**
 * Get current time in minutes since midnight
 */
export function getCurrentTimeInMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Validate entire route and return warnings
 */
export function validateRoute(
  startLocation: { lat: number; lng: number },
  places: PlaceRecommendation[],
  transportMode: 'driving' | 'walking' | 'cycling'
): {
  optimizedPlaces: PlaceRecommendation[];
  warnings: string[];
  schedule: {
    place: PlaceRecommendation;
    arrivalTime: string;
    status: 'open' | 'closed' | 'closing-soon';
  }[];
} {
  // 1. Optimize route by distance
  const optimizedPlaces = optimizeRouteByDistance(
    startLocation.lat,
    startLocation.lng,
    places
  );

  // 2. Calculate approximate travel times
  const avgSpeed = transportMode === 'driving' ? 25 : transportMode === 'cycling' ? 15 : 5; // km/h
  const travelTimes: number[] = [];
  
  let previousLocation = startLocation;
  for (const place of optimizedPlaces) {
    const distance = calculateDistance(
      previousLocation.lat,
      previousLocation.lng,
      place.latitude,
      place.longitude
    );
    const travelTimeMinutes = (distance / avgSpeed) * 60;
    travelTimes.push(Math.round(travelTimeMinutes));
    previousLocation = { lat: place.latitude, lng: place.longitude };
  }

  // 3. Calculate arrival times and check working hours
  const currentTime = getCurrentTimeInMinutes();
  const arrivalInfo = calculateArrivalTimes(currentTime, optimizedPlaces, travelTimes);

  // 4. Collect warnings
  const warnings: string[] = [];
  const schedule = arrivalInfo.map(info => {
    if (info.workingHoursCheck.warning) {
      warnings.push(info.workingHoursCheck.warning);
    }

    let status: 'open' | 'closed' | 'closing-soon' = 'open';
    if (!info.workingHoursCheck.isOpen) {
      status = 'closed';
    } else if (info.workingHoursCheck.warning?.includes('close soon')) {
      status = 'closing-soon';
    }

    return {
      place: info.place,
      arrivalTime: info.arrivalTimeFormatted,
      status
    };
  });

  return {
    optimizedPlaces,
    warnings,
    schedule
  };
}

