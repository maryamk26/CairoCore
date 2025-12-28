/**
 * Place recommendation and filtering algorithms
 * Filters and ranks places based on user preferences and constraints
 */

import { Place } from "@/types";
import { SurveyResponse } from "@/types";

export interface PlaceScore {
  place: Place;
  score: number;
  reasons: string[]; // Reasons why this place was recommended
}

/**
 * Filter and score places based on user preferences
 * @param places Array of all available places
 * @param preferences User preferences from survey
 * @returns Array of scored and filtered places, sorted by score (highest first)
 */
export function recommendPlaces(
  places: Place[],
  preferences: SurveyResponse["preferences"]
): PlaceScore[] {
  const scoredPlaces: PlaceScore[] = places
    .map((place) => {
      const { score, reasons } = calculatePlaceScore(place, preferences);
      return {
        place,
        score,
        reasons,
      };
    })
    .filter((item) => item.score > 0) // Filter out places with score 0
    .sort((a, b) => b.score - a.score); // Sort by score descending

  return scoredPlaces;
}

/**
 * Calculate a score for a place based on how well it matches user preferences
 * Score ranges from 0 to 100
 */
function calculatePlaceScore(
  place: Place,
  preferences: SurveyResponse["preferences"]
): { score: number; reasons: string[] } {
  let score = 50; // Base score
  const reasons: string[] = [];

  // Vibe matching (weight: 30 points)
  if (preferences.vibe && preferences.vibe.length > 0) {
    const matchingVibes = place.vibe.filter((v) =>
      preferences.vibe!.includes(v)
    );
    if (matchingVibes.length > 0) {
      const vibeScore = (matchingVibes.length / preferences.vibe.length) * 30;
      score += vibeScore;
      reasons.push(`Matches ${matchingVibes.length} vibe preference(s)`);
    } else {
      score -= 10; // Penalty for no vibe match
    }
  }

  // Budget matching (weight: 20 points)
  if (preferences.budget) {
    const totalFees = (place.entryFees || 0) + (place.cameraFees || 0);
    const budgetMatch = matchBudget(totalFees, preferences.budget);
    score += budgetMatch.score;
    if (budgetMatch.reason) {
      reasons.push(budgetMatch.reason);
    }
  }

  // Pet-friendly matching (weight: 10 points)
  if (preferences.petsFriendly !== undefined) {
    if (place.petsFriendly === preferences.petsFriendly) {
      score += 10;
      reasons.push(
        preferences.petsFriendly ? "Pet-friendly" : "No pets allowed"
      );
    } else {
      score -= 15; // Strong penalty for mismatch
    }
  }

  // Kids-friendly matching (weight: 10 points)
  if (preferences.kidsFriendly !== undefined) {
    if (place.kidsFriendly === preferences.kidsFriendly) {
      score += 10;
      reasons.push(
        preferences.kidsFriendly ? "Kids-friendly" : "Not suitable for kids"
      );
    } else {
      score -= 15; // Strong penalty for mismatch
    }
  }

  // Best time to visit matching (weight: 15 points)
  if (preferences.timeOfDay && place.bestTimeToVisit?.timeOfDay) {
    const matchingTime = place.bestTimeToVisit.timeOfDay.some((time) =>
      preferences.timeOfDay!.includes(time)
    );
    if (matchingTime) {
      score += 15;
      reasons.push("Best time matches your preference");
    }
  }

  if (preferences.season && place.bestTimeToVisit?.season) {
    const seasonList = place.bestTimeToVisit.season;
    const matchingSeason = seasonList.some((season) =>
      preferences.season!.includes(season) ||
      seasonList.includes("All Year")
    );
    if (matchingSeason) {
      score += 10;
      reasons.push("Best season matches your visit time");
    }
  }

  // Rating boost (weight: 5 points)
  if (place.averageRating >= 4.5) {
    score += 5;
    reasons.push("Highly rated");
  }

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return { score: Math.round(score), reasons };
}

/**
 * Match place fees with budget preference
 */
function matchBudget(
  totalFees: number,
  budgetPreference: string
): { score: number; reason?: string } {
  const budgetRanges: Record<string, { max: number; label: string }> = {
    low: { max: 100, label: "Budget-friendly" },
    medium: { max: 300, label: "Moderate budget" },
    high: { max: Infinity, label: "Premium experience" },
  };

  const range = budgetRanges[budgetPreference.toLowerCase()];
  if (!range) {
    return { score: 0 };
  }

  if (totalFees <= range.max) {
    return {
      score: 20,
      reason: range.label,
    };
  } else {
    // Penalty for exceeding budget
    const penalty = totalFees > range.max * 1.5 ? 20 : 10;
    return {
      score: -penalty,
    };
  }
}

/**
 * Filter places based on constraints (location, number of places, etc.)
 * @param places Array of places
 * @param constraints User constraints
 * @returns Filtered places
 */
export function filterPlacesByConstraints(
  places: Place[],
  constraints: SurveyResponse["constraints"]
): Place[] {
  let filtered = [...places];

  // Filter by number of places if specified
  if (constraints.numberOfPlaces) {
    // This would typically be used after scoring/sorting
    // For now, just return the places (sorting/limiting should be done after scoring)
  }

  // Filter by distance from start location if specified
  if (constraints.startLocation) {
    // Can be used to prioritize places near start location
    // This is better handled during route optimization
  }

  return filtered;
}

/**
 * Combine recommendation and constraint filtering
 */
export function getRecommendedPlaces(
  places: Place[],
  surveyResponse: SurveyResponse
): PlaceScore[] {
  // First filter by constraints
  const filteredPlaces = filterPlacesByConstraints(
    places,
    surveyResponse.constraints
  );

  // Then score and rank by preferences
  const recommended = recommendPlaces(filteredPlaces, surveyResponse.preferences);

  // Limit to number of places if specified
  if (surveyResponse.constraints.numberOfPlaces) {
    return recommended.slice(0, surveyResponse.constraints.numberOfPlaces);
  }

  return recommended;
}

