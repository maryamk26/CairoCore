import { SurveyAnswers } from "@/components/planner/SurveyComponent";

export interface PlaceRecommendation {
  id: string;
  title: string;
  description: string;
  images: string[];
  latitude: number;
  longitude: number;
  address: string;
  vibe: string[];
  entryFees: number | null;
  cameraFees: number | null;
  petsFriendly: boolean;
  kidsFriendly: boolean;
  matchScore: number; // 0-100
  matchReasons: string[];
}

export function calculatePlaceMatch(
  place: any,
  preferences: SurveyAnswers
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

  // Vibe matching (40 points max)
  const preferredVibes = preferences.vibe as string[];
  if (preferredVibes && preferredVibes.length > 0) {
    const matchingVibes = place.vibe.filter((v: string) =>
      preferredVibes.includes(v)
    );
    const vibeScore = (matchingVibes.length / preferredVibes.length) * 40;
    score += vibeScore;
    
    if (matchingVibes.length > 0) {
      reasons.push(`Matches your ${matchingVibes.join(", ")} vibe`);
    }
  }

  // Budget matching (20 points max)
  const budget = preferences.budget as string;
  const entryFee = place.entryFees || 0;
  
  if (budget === "low" && entryFee <= 100) {
    score += 20;
    if (entryFee === 0) {
      reasons.push("Free entry - perfect for your budget!");
    } else {
      reasons.push("Budget-friendly pricing");
    }
  } else if (budget === "medium" && entryFee > 100 && entryFee <= 500) {
    score += 20;
    reasons.push("Moderately priced");
  } else if (budget === "high" && entryFee > 500) {
    score += 20;
    reasons.push("Premium experience");
  } else if (budget === "high" && entryFee < 500) {
    score += 15; // Still acceptable
  } else if (budget === "low" && entryFee > 100) {
    score += 5; // Not ideal
  }

  // Companion matching (20 points max)
  const companions = (preferences.companions as string[]) || [];
  let companionScore = 0;
  
  if (companions.includes("kids")) {
    if (place.kidsFriendly) {
      companionScore += 10;
      reasons.push("Kid-friendly");
    } else {
      companionScore -= 10;
    }
  }
  
  if (companions.includes("pets")) {
    if (place.petsFriendly) {
      companionScore += 10;
      reasons.push("Pet-friendly");
    } else {
      companionScore -= 10;
    }
  }

  if (companions.includes("elderly")) {
    // Check if place has easy access (this would need to be in the database)
    // For now, we'll give moderate score
    companionScore += 5;
  }

  if (companions.includes("romantic") || companions.includes("partner")) {
    if (place.vibe.includes("romantic")) {
      companionScore += 10;
      reasons.push("Perfect for couples");
    }
  }

  score += Math.max(0, Math.min(20, companionScore));

  // Time of day matching (10 points max)
  const timeOfDay = (preferences.timeOfDay as string[]) || [];
  if (timeOfDay.length > 0) {
    // This would need working hours check
    // For now, give partial points
    score += 5;
  }

  // Photography spots bonus (10 points)
  if (preferredVibes?.includes("photography") && place.vibe.includes("photography")) {
    score += 10;
    reasons.push("Great for photography!");
  }

  // Normalize score to 0-100
  score = Math.min(maxScore, Math.max(0, score));

  return { score, reasons };
}

export function getTopRecommendations(
  places: any[],
  preferences: SurveyAnswers,
  limit?: number
): PlaceRecommendation[] {
  const numberOfPlaces = (preferences.numberOfPlaces as number) || limit || 5;

  // Calculate match scores for all places
  const scoredPlaces = places.map((place) => {
    const { score, reasons } = calculatePlaceMatch(place, preferences);
    return {
      ...place,
      matchScore: score,
      matchReasons: reasons,
    };
  });

  // Sort by match score (descending) and return top N
  return scoredPlaces
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, numberOfPlaces)
    .map((place) => ({
      id: place.id,
      title: place.title,
      description: place.description,
      images: place.images,
      latitude: place.latitude,
      longitude: place.longitude,
      address: place.address,
      vibe: place.vibe,
      entryFees: place.entryFees,
      cameraFees: place.cameraFees,
      petsFriendly: place.petsFriendly,
      kidsFriendly: place.kidsFriendly,
      matchScore: place.matchScore,
      matchReasons: place.matchReasons,
    }));
}

export function estimateTripDuration(
  numberOfPlaces: number,
  timePerPlace: number = 1.5 // hours
): number {
  // Base time per place + travel time between places (estimate 30 min per transition)
  const baseTime = numberOfPlaces * timePerPlace;
  const travelTime = (numberOfPlaces - 1) * 0.5;
  return baseTime + travelTime;
}

