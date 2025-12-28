"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { PlaceRecommendation } from "@/utils/planner/recommendation";

const RouteMap = dynamic(() => import("@/components/places/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface RouteBuilderProps {
  places: PlaceRecommendation[];
  onBack: () => void;
  onSave?: () => void;
}

export default function RouteBuilder({ places, onBack, onSave }: RouteBuilderProps) {
  const [orderedPlaces, setOrderedPlaces] = useState(places);

  const movePlace = (index: number, direction: "up" | "down") => {
    const newPlaces = [...orderedPlaces];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < newPlaces.length) {
      [newPlaces[index], newPlaces[newIndex]] = [newPlaces[newIndex], newPlaces[index]];
      setOrderedPlaces(newPlaces);
    }
  };

  const removePlace = (index: number) => {
    const newPlaces = orderedPlaces.filter((_, i) => i !== index);
    setOrderedPlaces(newPlaces);
  };

  const handleSave = () => {
    // TODO: Implement save to database
    if (onSave) {
      onSave();
    }
    alert("Route saved! (This would save to database in production)");
  };

  // Convert to format expected by RouteMap
  const mapPlaces = orderedPlaces.map((place) => ({
    id: place.id,
    title: place.title,
    lat: place.latitude,
    lng: place.longitude,
    address: place.address,
  }));

  return (
    <div className="min-h-screen bg-[#3a3428]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-white/70 hover:text-white transition-colors font-cinzel"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Selection
          </button>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Your Optimized Route
          </h1>
          <p className="font-cinzel text-white/80 text-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Review and adjust your trip route. Drag to reorder stops.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Map */}
          <div className="lg:col-span-2">
            <div className="bg-[#5d4e37] rounded-lg p-6">
              {orderedPlaces.length >= 2 ? (
                <RouteMap places={mapPlaces} height="600px" />
              ) : orderedPlaces.length === 1 ? (
                <div className="w-full h-[600px] bg-gray-800/50 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600">
                  <div className="text-center max-w-md">
                    <div className="mb-6">
                      <svg className="w-24 h-24 mx-auto text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="font-cinzel text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {orderedPlaces[0].title}
                    </h3>
                    <p className="font-cinzel text-white/70 mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {orderedPlaces[0].address}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-white/80">
                      {orderedPlaces[0].entryFees !== null && orderedPlaces[0].entryFees > 0 ? (
                        <span className="font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                          {orderedPlaces[0].entryFees} EGP
                        </span>
                      ) : (
                        <span className="font-cinzel text-[#d4af37]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                          Free Entry
                        </span>
                      )}
                      {orderedPlaces[0].kidsFriendly && <span title="Kid-friendly">👶</span>}
                      {orderedPlaces[0].petsFriendly && <span title="Pet-friendly">🐕</span>}
                    </div>
                    <p className="font-cinzel text-white/60 text-sm mt-6" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      Add more places from the selection to see a route map
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Sidebar - Route Details */}
          <div className="space-y-6">
            {/* Route Summary */}
            <div className="bg-[#5d4e37] rounded-lg p-6">
              <h3 className="font-cinzel text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Route Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-cinzel text-white/70" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Total Stops</span>
                  <span className="font-cinzel text-white font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {orderedPlaces.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-cinzel text-white/70" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Est. Duration</span>
                  <span className="font-cinzel text-white font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {orderedPlaces.length * 1.5} - {orderedPlaces.length * 2} hours
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-cinzel text-white/70" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Total Cost</span>
                  <span className="font-cinzel text-white font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {orderedPlaces.reduce((sum, place) => sum + (place.entryFees || 0), 0)} EGP
                  </span>
                </div>
              </div>
            </div>

            {/* Your Route */}
            <div className="bg-[#5d4e37] rounded-lg p-6">
              <h3 className="font-cinzel text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Your Route
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {orderedPlaces.map((place, index) => (
                  <div
                    key={place.id}
                    className="bg-[#8b6f47] rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      {/* Number Badge */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-[#3a3428] font-bold">
                        {index + 1}
                      </div>

                      {/* Place Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-cinzel text-white font-semibold text-sm mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                          {place.title}
                        </h4>
                        <p className="font-cinzel text-white/60 text-xs mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                          {place.address}
                        </p>
                        <div className="flex items-center gap-2 text-white/70 text-xs">
                          {place.entryFees !== null && place.entryFees > 0 ? (
                            <span className="font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                              {place.entryFees} EGP
                            </span>
                          ) : (
                            <span className="font-cinzel text-[#d4af37]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                              Free
                            </span>
                          )}
                          {place.kidsFriendly && <span title="Kid-friendly">👶</span>}
                          {place.petsFriendly && <span title="Pet-friendly">🐕</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => movePlace(index, "up")}
                          disabled={index === 0}
                          className="p-1 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Move up"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => movePlace(index, "down")}
                          disabled={index === orderedPlaces.length - 1}
                          className="p-1 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Move down"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removePlace(index)}
                          className="p-1 text-red-400 hover:text-red-300"
                          aria-label="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={orderedPlaces.length < 1}
                className="w-full px-6 py-3 bg-[#d4af37] text-[#3a3428] rounded-lg font-cinzel font-bold hover:bg-[#e5bf47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                {orderedPlaces.length === 1 ? "Save Location" : "Save Route"}
              </button>
              <button
                onClick={onBack}
                className="w-full px-6 py-3 bg-[#8b6f47] text-white rounded-lg font-cinzel font-semibold hover:bg-[#9d7f57] transition-colors"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                Add More Places
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

