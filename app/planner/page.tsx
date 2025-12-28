"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import RouteMap to avoid SSR issues with Leaflet
const RouteMap = dynamic(() => import("@/components/places/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-200 flex items-center justify-center rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

// Mock places data - in production this would come from an API
const mockPlaces = [
  {
    id: "1",
    title: "Pyramids and Sphinx",
    address: "Al Haram, Giza Governorate, Egypt",
    lat: 29.9792,
    lng: 31.1342,
  },
  {
    id: "2",
    title: "Grand Museum",
    address: "Cairo-Alexandria Desert Rd, Kafr Nassar, Al Giza Desert, Giza Governorate, Egypt",
    lat: 30.0081,
    lng: 31.1322,
  },
  {
    id: "3",
    title: "Khan el-Khalili",
    address: "El-Gamaleya, El Gamaliya, Cairo Governorate, Egypt",
    lat: 30.0479,
    lng: 31.2626,
  },
  {
    id: "4",
    title: "Cairo Tower",
    address: "Zamalek, Cairo Governorate, Egypt",
    lat: 30.0456,
    lng: 31.2242,
  },
];

interface SelectedPlace {
  id: string;
  title: string;
  lat: number;
  lng: number;
  address?: string;
}

export default function PlannerPage() {
  const [selectedPlaces, setSelectedPlaces] = useState<SelectedPlace[]>([]);

  const addPlace = (place: typeof mockPlaces[0]) => {
    if (!selectedPlaces.find((p) => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const removePlace = (placeId: string) => {
    setSelectedPlaces(selectedPlaces.filter((p) => p.id !== placeId));
  };

  const movePlace = (index: number, direction: "up" | "down") => {
    const newPlaces = [...selectedPlaces];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newPlaces.length) {
      [newPlaces[index], newPlaces[newIndex]] = [newPlaces[newIndex], newPlaces[index]];
      setSelectedPlaces(newPlaces);
    }
  };

  const clearRoute = () => {
    setSelectedPlaces([]);
  };

  return (
    <div className="min-h-screen bg-[#3a3428]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Plan Your Trip
          </h1>
          <p className="font-cinzel text-white/80 text-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Select places to visit and see the optimal route between them
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Map */}
          <div className="lg:col-span-2">
            <div className="bg-[#5d4e37] rounded-lg p-6">
              {selectedPlaces.length >= 2 ? (
                <RouteMap places={selectedPlaces} height="600px" />
              ) : (
                <div className="w-full h-[600px] bg-gray-800/50 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-600">
                  <div className="text-center">
                    <p className="font-cinzel text-white/70 text-lg mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {selectedPlaces.length === 0
                        ? "Select at least 2 places to see the route"
                        : "Select one more place to see the route"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Place Selection */}
          <div className="space-y-6">
            {/* Selected Places */}
            {selectedPlaces.length > 0 && (
              <div className="bg-[#5d4e37] rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-cinzel text-xl font-bold text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    Your Route
                  </h3>
                  <button
                    onClick={clearRoute}
                    className="font-cinzel text-sm text-red-400 hover:text-red-300 transition-colors"
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedPlaces.map((place, index) => (
                    <div
                      key={place.id}
                      className="bg-[#8b6f47] rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-cinzel text-white font-semibold text-sm truncate" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                            {place.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
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
                          disabled={index === selectedPlaces.length - 1}
                          className="p-1 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Move down"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removePlace(place.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                          aria-label="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Places */}
            <div className="bg-[#5d4e37] rounded-lg p-6">
              <h3 className="font-cinzel text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Available Places
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {mockPlaces.map((place) => {
                  const isSelected = selectedPlaces.some((p) => p.id === place.id);
                  return (
                    <button
                      key={place.id}
                      onClick={() => addPlace(place)}
                      disabled={isSelected}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-[#8b6f47] opacity-50 cursor-not-allowed"
                          : "bg-[#8b6f47] hover:bg-[#9d7f57] cursor-pointer"
                      }`}
                    >
                      <p className="font-cinzel text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        {place.title}
                      </p>
                      <p className="font-cinzel text-white/70 text-xs mt-1 truncate" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        {place.address}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
