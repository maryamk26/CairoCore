import React from "react";
import { PlaceRecommendation } from "@/utils/planner/recommendation";

interface TripStats {
  totalDistance: number;
  travelTime: number;
  totalTime: number;
}

interface Props {
  userLocation: { lat: number; lng: number; title?: string; address?: string } | null;
  isLoadingLocation: boolean;
  tripStats: TripStats;
  orderedPlaces: PlaceRecommendation[];
  requestLocation: () => void;
  handleSave: () => void;
  handleYallaClick: () => void;
}

export default function RouteSummaryCard({
  userLocation,
  isLoadingLocation,
  tripStats,
  orderedPlaces,
  requestLocation,
  handleSave,
  handleYallaClick,
}: Props) {
  return (
    <div className="bg-[#5d4e37] rounded-lg p-6 space-y-3">
      {/* Location Permission */}
      {!userLocation && !isLoadingLocation && (
        <div className="mb-4 p-3 bg-[#d4af37]/20 border border-[#d4af37] rounded-lg">
          <p className="text-white text-sm mb-2">📍 Enable location for accurate route planning</p>
          <button
            onClick={requestLocation}
            className="w-full px-4 py-2 bg-[#d4af37] text-[#3a3428] rounded hover:bg-[#e5bf47] font-semibold text-sm"
          >
            Share My Location
          </button>
        </div>
      )}
      {isLoadingLocation && (
        <div className="mb-4 p-3 bg-[#8b6f47] rounded-lg text-center text-white text-sm">
          Getting your location...
        </div>
      )}

      {/* Trip Stats */}
      {userLocation && tripStats.totalDistance > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-white/70 text-sm">
            <span>Total Distance</span>
            <span>{tripStats.totalDistance} km</span>
          </div>
          <div className="flex justify-between text-white/70 text-sm">
            <span>Travel Time</span>
            <span>
              ~{Math.floor(tripStats.travelTime / 60)}h {tripStats.travelTime % 60}m
            </span>
          </div>
          <div className="flex justify-between text-white/70 text-sm">
            <span>Total Stops</span>
            <span>{orderedPlaces.length}</span>
          </div>
          <div className="flex justify-between text-white/70 text-sm">
            <span>Visit Time</span>
            <span>
              ~{Math.floor((orderedPlaces.length * 90) / 60)}h {(orderedPlaces.length * 90) % 60}m
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t-2 border-[#d4af37] text-[#d4af37] font-bold">
            <span>Total Duration</span>
            <span>
              ~{Math.floor(tripStats.totalTime / 60)}h {tripStats.totalTime % 60}m
            </span>
          </div>
          <div className="flex justify-between text-white/70 text-sm">
            <span>Total Cost</span>
            <span>
              {orderedPlaces.reduce((sum, place) => sum + (place.entryFees || 0), 0)} EGP
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
