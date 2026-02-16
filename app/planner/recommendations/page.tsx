"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaceSelection from "@/components/planner/PlaceSelection";
import { PlaceRecommendation } from "@/utils/planner/recommendation";
import { loadSession, saveSession, loadSelectedPlaces, loadRemovedPlaceIds } from "@/utils/planner/session";

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<PlaceRecommendation[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceRecommendation[]>([]);
  const [removedPlaceIds, setRemovedPlaceIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRecommendations = loadSession<PlaceRecommendation[]>("plannerRecommendations");

    if (!storedRecommendations || storedRecommendations.length === 0) {
      router.push("/planner");
      return;
    }

    setRecommendations(storedRecommendations);
    setSelectedPlaces(loadSelectedPlaces());
    setRemovedPlaceIds(loadRemovedPlaceIds());
    setIsLoading(false);
  }, [router]);

  const handleTogglePlace = (place: PlaceRecommendation) => {
    let newSelected: PlaceRecommendation[];

    if (selectedPlaces.some((p) => p.id === place.id)) {
      newSelected = selectedPlaces.filter((p) => p.id !== place.id);
    } else {
      newSelected = [...selectedPlaces, place];
      setRemovedPlaceIds(removedPlaceIds.filter((id) => id !== place.id));
    }

    setSelectedPlaces(newSelected);
    saveSession("plannerSelectedPlaces", newSelected);
  };

  const handleContinue = () => {
    if (selectedPlaces.length > 0) {
      saveSession("plannerSelectedPlaces", selectedPlaces);
      router.push("/planner/route");
    }
  };

  if (isLoading) return <Loading message="Loading recommendations..." />;

  return (
    <PlaceSelection
      recommendations={recommendations}
      selectedPlaces={selectedPlaces}
      removedPlaceIds={removedPlaceIds}
      onTogglePlace={handleTogglePlace}
      onContinue={handleContinue}
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
