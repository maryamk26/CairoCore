import { PlaceRecommendation } from "@/utils/planner/recommendation";

// Generic session storage helpers
export const loadSession = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const item = sessionStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : null;
};

export const saveSession = <T>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const removeSession = (key: string) => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(key);
};

// Specific planner helpers
export const loadSelectedPlaces = (): PlaceRecommendation[] =>
  loadSession<PlaceRecommendation[]>("plannerSelectedPlaces") || [];

export const loadRemovedPlaceIds = (): string[] =>
  loadSession<string[]>("plannerRemovedPlaceIds") || [];

export const loadPreferences = <T>(): T | null =>
  loadSession<T>("plannerPreferences");

export const clearPlannerSession = () => {
  removeSession("plannerPreferences");
  removeSession("plannerRecommendations");
  removeSession("plannerSelectedPlaces");
  removeSession("plannerRemovedPlaceIds");
};
