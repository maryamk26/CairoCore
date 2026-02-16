"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { PlaceRecommendation } from "@/utils/planner/recommendation";
import { showNavigationStarted, getNotificationPermission } from "@/utils/notifications";

const NavigationMap = dynamic(() => import("@/components/planner/NavigationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white">Loading navigation...</p>
    </div>
  ),
});

type TransportMode = "driving" | "walking" | "cycling";

export interface NavigationStep {
  distance: number;       // in meters
  duration: number;       // in seconds
  instruction: string;
  location: [number, number]; // [lng, lat]
  maneuver: {
    type: string;
    modifier?: string;
    instruction?: string;
    location: [number, number];
  };
}

interface NavigationModeProps {
  startLocation: { lat: number; lng: number; title?: string };
  places: PlaceRecommendation[];
  onExit: () => void;
}

export default function NavigationMode({
  startLocation,
  places,
  onExit,
}: NavigationModeProps) {
  const [transportMode, setTransportMode] = useState<TransportMode | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [steps, setSteps] = useState<NavigationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userLocation, setUserLocation] = useState<[number, number]>([startLocation.lat, startLocation.lng]);
  const [isNavigating, setIsNavigating] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // -------------------------------
  // Fetch Navigation Route from OSRM
  // -------------------------------
  const fetchNavigationRoute = async (mode: TransportMode) => {
    setIsLoadingRoute(true);
    try {
      const allPoints = [startLocation, ...places.map((p) => ({ lat: p.latitude, lng: p.longitude }))];
      const coordinates = allPoints.map((p) => `${p.lng},${p.lat}`).join(";");

      const profile = mode === "driving" ? "car" : mode === "cycling" ? "bike" : "foot";
      const url = `https://router.project-osrm.org/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson&steps=true`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes?.length) {
        const route = data.routes[0];

        const allSteps: NavigationStep[] = route.legs.flatMap((leg: any) =>
          leg.steps.map((step: any) => ({
            distance: step.distance,
            duration: step.duration,
            instruction: step.maneuver.instruction || getInstructionFromManeuver(step.maneuver),
            location: step.maneuver.location as [number, number],
            maneuver: step.maneuver,
          }))
        );

        setSteps(allSteps);
        setCurrentStep(0);
        setIsNavigating(true);
        startLocationTracking();

        if (getNotificationPermission() === "granted" && places.length > 0) {
          showNavigationStarted(places[0].title);
        }
      }
    } catch (error) {
      console.error("Error fetching navigation route:", error);
      alert("Failed to load navigation route. Please try again.");
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // -------------------------------
  // Maneuver instruction helper
  // -------------------------------
  const getInstructionFromManeuver = (maneuver: any): string => {
    const type = maneuver.type;
    const modifier = maneuver.modifier;
    const instructions: Record<string, string> = {
      depart: `Head ${modifier || "straight"}`,
      turn: `Turn ${modifier || ""}`,
      "new name": "Continue on new road",
      continue: "Continue straight",
      arrive: "Arrive at destination",
      merge: `Merge ${modifier || ""}`,
      fork: `Take the fork ${modifier || ""}`,
      roundabout: "Take the roundabout",
      "exit roundabout": "Exit the roundabout",
    };
    return instructions[type] || `${type} ${modifier || ""}`.trim();
  };

  // -------------------------------
  // Location Tracking
  // -------------------------------
  const startLocationTracking = () => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(newLocation);

        const step = steps[currentStep];
        if (!step) return;

        const [stepLng, stepLat] = step.location;
        const distance = calculateDistance(newLocation[0], newLocation[1], stepLat, stepLng);

        if (distance < 0.02 && currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        }
      },
      (error) => console.error("Location tracking error:", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // -------------------------------
  // Utility Functions
  // -------------------------------
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (meters: number) => (meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`);
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // -------------------------------
  // UI Rendering
  // -------------------------------

  // Mode selection
  if (!transportMode) {
    return (
      <ModeSelection
        onSelect={(mode) => {
          setTransportMode(mode);
          fetchNavigationRoute(mode);
        }}
        onExit={onExit}
      />
    );
  }

  // Loading
  if (isLoadingRoute) {
    return (
      <div className="fixed inset-0 bg-[#3a3428] z-50 flex items-center justify-center">
        <p className="font-cinzel text-white text-xl">Calculating route...</p>
      </div>
    );
  }

  // Navigation screen
  if (isNavigating && steps.length > 0) {
    const currentStepData = steps[currentStep];
    const remainingDistance = steps.slice(currentStep).reduce((sum, s) => sum + s.distance, 0);
    const remainingDuration = steps.slice(currentStep).reduce((sum, s) => sum + s.duration, 0);

    return (
      <NavigationScreen
        steps={steps}
        currentStep={currentStep}
        userLocation={userLocation}
        currentStepData={currentStepData}
        remainingDistance={remainingDistance}
        remainingDuration={remainingDuration}
        places={places}
        onExit={onExit}
        watchIdRef={watchIdRef}
      />
    );
  }

  return null;
}

// -------------------------------
// Mode Selection Component
// -------------------------------
interface ModeSelectionProps {
  onSelect: (mode: TransportMode) => void;
  onExit: () => void;
}

function ModeSelection({ onSelect, onExit }: ModeSelectionProps) {
  return (
    <div className="fixed inset-0 z-50">
      {/* Background + gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/backgrounds/survey.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/40 via-[#8b6f47]/30 to-[#5d4e37]/40"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <button onClick={onExit} className="mb-8 flex items-center gap-2 text-white/70 hover:text-white">
            ← Back
          </button>
          <h1 className="text-5xl text-white mb-4">Choose Your Transport</h1>
          <p className="text-xl text-white/90 mb-12">How would you like to explore Cairo?</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {["driving", "walking", "cycling"].map((mode) => (
              <button
                key={mode}
                onClick={() => onSelect(mode as TransportMode)}
                className="bg-[#5d4e37]/90 p-10 rounded-2xl hover:scale-105 transition-transform"
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------
// Navigation Screen Component
// -------------------------------
interface NavigationScreenProps {
  steps: NavigationStep[];
  currentStep: number;
  currentStepData: NavigationStep;
  userLocation: [number, number];
  remainingDistance: number;
  remainingDuration: number;
  places: PlaceRecommendation[];
  onExit: () => void;
  watchIdRef: React.MutableRefObject<number | null>;
}

function NavigationScreen({
  steps,
  currentStep,
  currentStepData,
  userLocation,
  remainingDistance,
  remainingDuration,
  places,
  onExit,
  watchIdRef,
}: NavigationScreenProps) {
  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      <NavigationMap userLocation={userLocation} steps={steps} currentStep={currentStep} places={places} />
      {/* Top panel and bottom steps UI here */}
      {/* ...keep your existing rendering logic for currentStep instructions */}
    </div>
  );
}
