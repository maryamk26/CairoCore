"use client";

import { useState } from "react";
import AccordionSurvey, { SurveyAnswers } from "@/components/planner/AccordionSurvey";
import PlaceSelection from "@/components/planner/PlaceSelection";
import RouteBuilder from "@/components/planner/RouteBuilder";
import { PlaceRecommendation } from "@/utils/planner/recommendation";

type Stage = "survey" | "selection" | "route";

export default function PlannerPage() {
  const [stage, setStage] = useState<Stage>("survey");
  const [preferences, setPreferences] = useState<SurveyAnswers | null>(null);
  const [recommendations, setRecommendations] = useState<PlaceRecommendation[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSurveyComplete = async (answers: SurveyAnswers) => {
    setPreferences(answers);
    setIsLoading(true);
    setError(null);

    try {
      // Call API to get recommendations
      const response = await fetch("/api/planner/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences: answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      setStage("selection");
    } catch (err) {
      console.error("Error getting recommendations:", err);
      setError("Failed to get recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlace = (place: PlaceRecommendation) => {
    if (selectedPlaces.some((p) => p.id === place.id)) {
      setSelectedPlaces(selectedPlaces.filter((p) => p.id !== place.id));
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const handleContinueToRoute = () => {
    if (selectedPlaces.length >= 1) {
      setStage("route");
    }
  };

  const handleBackToSelection = () => {
    setStage("selection");
  };

  const handleStartOver = () => {
    setStage("survey");
    setPreferences(null);
    setRecommendations([]);
    setSelectedPlaces([]);
    setError(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#3a3428] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#d4af37] mb-4"></div>
          <p className="font-cinzel text-white text-xl" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Finding the perfect places for you...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#3a3428] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#5d4e37] rounded-lg p-8 text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Oops! Something went wrong
          </h2>
          <p className="font-cinzel text-white/70 mb-6" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            {error}
          </p>
          <button
            onClick={handleStartOver}
            className="px-6 py-3 bg-[#d4af37] text-[#3a3428] rounded-lg font-cinzel font-bold hover:bg-[#e5bf47] transition-colors"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render based on stage
  switch (stage) {
    case "survey":
      return <AccordionSurvey onComplete={handleSurveyComplete} />;

    case "selection":
      return (
        <PlaceSelection
          recommendations={recommendations}
          selectedPlaces={selectedPlaces}
          onTogglePlace={handleTogglePlace}
          onContinue={handleContinueToRoute}
        />
      );

    case "route":
      return (
        <RouteBuilder
          places={selectedPlaces}
          onBack={handleBackToSelection}
          onSave={handleStartOver}
        />
      );

    default:
      return null;
  }
}
