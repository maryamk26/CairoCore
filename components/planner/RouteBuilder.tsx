"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PlaceRecommendation } from "@/utils/planner/recommendation";
import { calculateDistance } from "@/utils/algorithms/distance";
import LocationSelector from "./LocationSelector";

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

interface UserLocation {
  lat: number;
  lng: number;
  title?: string;
  address?: string;
}

export default function RouteBuilder({ places, onBack, onSave }: RouteBuilderProps) {
  const [orderedPlaces, setOrderedPlaces] = useState(places);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Request user's location on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationPermission('granted');
          setIsLoadingLocation(false);
        },
        (error) => {
          console.log('Location permission denied or error:', error);
          setLocationPermission('denied');
          setIsLoadingLocation(false);
        }
      );
    }
  }, []);

  // Calculate total distance and travel time
  const calculateTripStats = () => {
    if (!userLocation || orderedPlaces.length === 0) {
      return { totalDistance: 0, totalTime: 0, travelTime: 0 };
    }

    let totalDistance = 0;
    let previousLocation = userLocation;

    // Calculate distance from user location to first place, then between places
    orderedPlaces.forEach((place) => {
      const distance = calculateDistance(
        previousLocation.lat,
        previousLocation.lng,
        place.latitude,
        place.longitude
      );
      totalDistance += distance;
      previousLocation = { lat: place.latitude, lng: place.longitude };
    });

    // Average speed in Cairo: 25 km/h (accounting for traffic)
    const travelTimeHours = totalDistance / 25;
    const travelTimeMinutes = Math.round(travelTimeHours * 60);
    
    // Time spent at each location (1.5 hours average)
    const visitTimeMinutes = orderedPlaces.length * 90;
    
    // Total time in minutes
    const totalTimeMinutes = travelTimeMinutes + visitTimeMinutes;

    return {
      totalDistance: Math.round(totalDistance * 10) / 10, // Round to 1 decimal
      travelTime: travelTimeMinutes,
      totalTime: totalTimeMinutes,
    };
  };

  const tripStats = calculateTripStats();

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

  // Convert to format expected by RouteMap, including user's location as starting point
  const mapPlaces = userLocation
    ? [
        {
          id: 'user-location',
          title: userLocation.title || 'Your Location',
          lat: userLocation.lat,
          lng: userLocation.lng,
          address: 'Starting Point',
        },
        ...orderedPlaces.map((place) => ({
          id: place.id,
          title: place.title,
          lat: place.latitude,
          lng: place.longitude,
          address: place.address,
        })),
      ]
    : orderedPlaces.map((place) => ({
        id: place.id,
        title: place.title,
        lat: place.latitude,
        lng: place.longitude,
        address: place.address,
      }));

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationPermission('granted');
          setIsLoadingLocation(false);
        },
        (error) => {
          alert('Please enable location access in your browser settings to see the route from your current location.');
          setLocationPermission('denied');
          setIsLoadingLocation(false);
        }
      );
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/backgrounds/survey.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#5d4e37' // Fallback color
          }}
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/40 via-[#8b6f47]/30 to-[#5d4e37]/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-32 pb-8">
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
            {orderedPlaces.length === 1 ? "Your Selected Location" : "Your Optimized Route"}
          </h1>
          <p className="font-cinzel text-white/80 text-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            {orderedPlaces.length === 1 
              ? "View your selected location on the map and add more places if you'd like."
              : "Review and adjust your trip route. Drag to reorder stops."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Map */}
          <div className="lg:col-span-2">
            <div className="bg-[#5d4e37] rounded-lg p-6">
              {orderedPlaces.length >= 1 ? (
                <RouteMap places={mapPlaces} height="600px" />
              ) : null}
            </div>
          </div>

      {/* Sidebar - Route Details */}
      <div className="space-y-6">
        {/* Location Selector */}
        <div className="bg-[#5d4e37] rounded-lg p-6">
          <h3 className="font-cinzel text-xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-cinzel), serif" }}>
            Starting Point
          </h3>
          <LocationSelector
            onLocationSelect={setUserLocation}
            currentLocation={userLocation}
          />
          {userLocation && (
            <div className="mt-3 p-3 bg-[#8b6f47] rounded">
              <p className="font-cinzel text-white font-semibold text-sm" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                {userLocation.title || 'Your Location'}
              </p>
              {userLocation.address && (
                <p className="font-cinzel text-white/70 text-xs mt-1" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                  {userLocation.address}
                </p>
              )}
              <p className="font-cinzel text-white/50 text-xs mt-1" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            </div>
          )}
        </div>

        {/* Route Summary */}
        <div className="bg-[#5d4e37] rounded-lg p-6">
              <h3 className="font-cinzel text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Route Summary
              </h3>
              
              {/* Location Permission Status */}
              {!userLocation && !isLoadingLocation && (
                <div className="mb-4 p-3 bg-[#d4af37]/20 border border-[#d4af37] rounded-lg">
                  <p className="font-cinzel text-white text-sm mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    📍 Enable location for accurate route planning
                  </p>
                  <button
                    onClick={requestLocation}
                    className="w-full px-4 py-2 bg-[#d4af37] text-[#3a3428] rounded font-cinzel font-semibold hover:bg-[#e5bf47] transition-colors text-sm"
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    Share My Location
                  </button>
                </div>
              )}
              
              {isLoadingLocation && (
                <div className="mb-4 p-3 bg-[#8b6f47] rounded-lg text-center">
                  <p className="font-cinzel text-white text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    Getting your location...
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {userLocation && tripStats.totalDistance > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="font-cinzel text-white/70" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Total Distance</span>
                      <span className="font-cinzel text-white font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        {tripStats.totalDistance} km
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-cinzel text-white/70" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Travel Time</span>
                      <span className="font-cinzel text-white font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        ~{Math.round(tripStats.travelTime / 60)}h {tripStats.travelTime % 60}m
                      </span>
                    </div>
                    <div className="h-px bg-white/20 my-2"></div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="font-cinzel text-white/70" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Total Stops</span>
                  <span className="font-cinzel text-white font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {orderedPlaces.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-cinzel text-white/70" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Visit Time</span>
                  <span className="font-cinzel text-white font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    ~{Math.round((orderedPlaces.length * 90) / 60)}h {(orderedPlaces.length * 90) % 60}m
                  </span>
                </div>
                {userLocation && tripStats.totalTime > 0 && (
                  <div className="flex justify-between pt-2 border-t-2 border-[#d4af37]">
                    <span className="font-cinzel text-[#d4af37] font-bold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Total Duration</span>
                    <span className="font-cinzel text-[#d4af37] font-bold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      ~{Math.floor(tripStats.totalTime / 60)}h {tripStats.totalTime % 60}m
                    </span>
                  </div>
                )}
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
    </div>
  );
}

