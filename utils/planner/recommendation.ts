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
  matchScore: number;
  matchReasons: string[];
  category?: string;
}

export function calculatePlaceMatch(
  place: any,
  preferences: SurveyAnswers
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const maxScore = 100;

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

  const budget = preferences.budget as string;
  const entryFee = place.entryFees || 0;

  if (budget === "low" && entryFee <= 50) {
    score += 20;
    if (entryFee === 0) {
      reasons.push("Free entry - fits your per-place budget");
    } else {
      reasons.push("Within your per-place budget");
    }
  } else if (budget === "medium" && entryFee > 50 && entryFee <= 200) {
    score += 20;
    reasons.push("Within your per-place budget");
  } else if (budget === "high" && entryFee > 200) {
    score += 20;
    reasons.push("Premium per-place range");
  } else if (budget === "high" && entryFee <= 200) {
    score += 15;
  } else if (budget === "low" && entryFee > 50) {
    score += 5;
  } else if (budget === "medium" && (entryFee <= 50 || entryFee > 200)) {
    score += 5;
  }

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
    companionScore += 5;
  }

  if (companions.includes("romantic") || companions.includes("partner")) {
    if (place.vibe.includes("romantic")) {
      companionScore += 10;
      reasons.push("Perfect for couples");
    }
  }

  score += Math.max(0, Math.min(20, companionScore));

  const timeOfDay = (preferences.timeOfDay as string[]) || [];
  if (timeOfDay.length > 0) {
    score += 5;
  }

  if (preferredVibes?.includes("photography") && place.vibe.includes("photography")) {
    score += 10;
    reasons.push("Great for photography!");
  }

  score = Math.min(maxScore, Math.max(0, score));

  return { score, reasons };
}

const MIN_RECOMMENDATIONS_TO_SHOW = 24;

export function getTopRecommendations(
  places: any[],
  preferences: SurveyAnswers,
  limit?: number
): PlaceRecommendation[] {
  const returnCount = limit ?? MIN_RECOMMENDATIONS_TO_SHOW;

  const scoredPlaces = places.map((place) => {
    const { score, reasons } = calculatePlaceMatch(place, preferences);
    return {
      ...place,
      matchScore: score,
      matchReasons: reasons,
    };
  });

  return scoredPlaces
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, returnCount)
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
      ...("category" in place && typeof place.category === "string" && { category: place.category }),
    }));
}
