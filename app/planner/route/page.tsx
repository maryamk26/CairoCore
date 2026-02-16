"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RouteBuilder from "@/components/planner/RouteBuilder";
import { PlaceRecommendation } from "@/utils/planner/recommendation";
import { SurveyAnswers } from "@/types/planner";
import {
  loadSelectedPlaces,
  loadPreferences,
  saveSession,
  loadRemovedPlaceIds,
  clearPlannerSession,
} from "@/utils/planner/session";

export default function RoutePage() {
  const router = useRouter();
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceRecommendation[]>([]);
  const [preferences, setPreferences] = useState<SurveyAnswers | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPlaces = loadSelectedPlaces();
    const storedPrefs = loadPreferences<SurveyAnswers>();

    if (!storedPlaces.length) {
      router.push("/planner/recommendations");
      return;
    }

    setSelectedPlaces(storedPlaces);
    setPreferences(storedPrefs);
    setIsLoading(false);
  }, [router]);

  const handleBack = () => router.push("/planner/recommendations");

  const handlePlaceRemoved = (placeId: string) => {
    const updated = selectedPlaces.filter((p) => p.id !== placeId);
    setSelectedPlaces(updated);
    saveSession("plannerSelectedPlaces", updated);

    const removedIds = loadRemovedPlaceIds();
    saveSession("plannerRemovedPlaceIds", [...removedIds, placeId]);
  };

  const handleSave = () => {
    clearPlannerSession();
    router.push("/planner");
  };

  if (isLoading) return <Loading message="Loading route..." />;

  return (
    <RouteBuilder
      places={selectedPlaces}
      userPreferences={preferences}
      onBack={handleBack}
      onPlaceRemoved={handlePlaceRemoved}
      onSave={handleSave}
    />
  );
}

// ----------------------- Loading Component -----------------------
function Loading({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#3a3428] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#d4af37] mb-4"></div>
        <p className="font-cinzel text-white text-xl">{message}</p>
      </div>
    </div>
  );
}
