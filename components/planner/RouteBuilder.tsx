"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import { PlaceRecommendation } from "@/utils/planner/recommendation";
import { calculateDistance } from "@/utils/algorithms/distance";
import { optimizeRouteByDistance, validateRoute } from "@/utils/planner/routeOptimization";
import { SurveyAnswers } from "@/types/planner";
import LocationSelector from "./LocationSelector";
import {
  ensureNotificationPermission,
  showTimeWarning,
  showWorkingHoursWarning,
  showRouteReady,
  getNotificationPermission
} from "@/utils/notifications";
import RouteSummaryCard from "./RouteSummaryCard";
import RoutePlaceCard from "./RoutePlaceCard";
import WarningsModal from "./WarningsModal";

const RouteMap = dynamic(() => import("@/components/places/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

const NavigationMode = dynamic(() => import("./NavigationMode"), { ssr: false });

interface RouteBuilderProps {
  places: PlaceRecommendation[];
  userPreferences: SurveyAnswers | null;
  onBack: () => void;
  onPlaceRemoved: (placeId: string) => void;
  onSave?: () => void;
}

interface UserLocation {
  lat: number;
  lng: number;
  title?: string;
  address?: string;
}

interface TripStats {
  totalDistance: number;
  totalTime: number;
  travelTime: number;
}

const AVG_SPEED_KMH = 25;
const MINUTES_PER_HOUR = 60;
const VISIT_TIME_MINUTES = 90;
const DISTANCE_ROUNDING = 10;

export default function RouteBuilder({
  places,
  userPreferences,
  onBack,
  onPlaceRemoved,
  onSave
}: RouteBuilderProps) {
  const [orderedPlaces, setOrderedPlaces] = useState(places);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isNavigationMode, setIsNavigationMode] = useState(false);
  const [routeWarnings, setRouteWarnings] = useState<string[]>([]);
  const [showWarningsModal, setShowWarningsModal] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setNotificationPermission(getNotificationPermission());
  }, []);

  useEffect(() => {
    if (userLocation && places.length > 0) {
      const optimized = optimizeRouteByDistance(userLocation.lat, userLocation.lng, places);
      setOrderedPlaces(optimized);
      
      if (getNotificationPermission() === 'granted') {
        showRouteReady(optimized.length);
      }
    }
  }, [userLocation, places]);

  const calculateTripStats = useCallback((): TripStats => {
    if (!userLocation || orderedPlaces.length === 0) {
      return { totalDistance: 0, totalTime: 0, travelTime: 0 };
    }

    let totalDistance = 0;
    let previousLocation = userLocation;

    orderedPlaces.forEach((place) => {
      totalDistance += calculateDistance(
        previousLocation,
        { lat: place.latitude, lng: place.longitude }
      );
      previousLocation = { lat: place.latitude, lng: place.longitude };
    });

    const travelTimeMinutes = Math.round((totalDistance / AVG_SPEED_KMH) * MINUTES_PER_HOUR);
    const visitTimeMinutes = orderedPlaces.length * VISIT_TIME_MINUTES;

    return {
      totalDistance: Math.round(totalDistance * DISTANCE_ROUNDING) / DISTANCE_ROUNDING,
      travelTime: travelTimeMinutes,
      totalTime: travelTimeMinutes + visitTimeMinutes,
    };
  }, [userLocation, orderedPlaces]);

  const tripStats = useMemo(() => calculateTripStats(), [calculateTripStats]);

  useEffect(() => {
    if (!userLocation || orderedPlaces.length === 0) {
      setRouteWarnings([]);
      return;
    }

    const validation = validateRoute(
      { lat: userLocation.lat, lng: userLocation.lng },
      orderedPlaces,
      'driving'
    );
    
    const allWarnings: string[] = [...validation.warnings];
    const stats = calculateTripStats();

    const timeAvailableValue = userPreferences?.timeAvailable;
    if (timeAvailableValue != null) {
      const timeAvailableHours = typeof timeAvailableValue === 'number' 
        ? timeAvailableValue 
        : typeof timeAvailableValue === 'string' 
        ? parseFloat(timeAvailableValue) 
        : 0;
      
      if (!isNaN(timeAvailableHours) && timeAvailableHours > 0) {
        const userTimeMinutes = timeAvailableHours * MINUTES_PER_HOUR;
        
        if (stats.totalTime > userTimeMinutes) {
          const excessHours = Math.round((stats.totalTime - userTimeMinutes) / MINUTES_PER_HOUR * DISTANCE_ROUNDING) / DISTANCE_ROUNDING;
          const actualHours = Math.round(stats.totalTime / MINUTES_PER_HOUR * DISTANCE_ROUNDING) / DISTANCE_ROUNDING;
          const hours = Math.floor(stats.totalTime / MINUTES_PER_HOUR);
          const minutes = stats.totalTime % MINUTES_PER_HOUR;
          
          const warningMessage = `This trip will take approximately ${hours}h ${minutes}m, which is ${excessHours}h more than your requested ${timeAvailableHours}h. Consider removing some places or adjusting your schedule.`;
          allWarnings.unshift(warningMessage);

          if (getNotificationPermission() === 'granted') {
            showTimeWarning(timeAvailableHours, actualHours, excessHours);
          }
        }
      }
    }

    if (getNotificationPermission() === 'granted' && validation.warnings.length > 0) {
      const firstWarning = validation.warnings[0];
      const match = firstWarning.match(/^(.*?):/);
      if (match) {
        showWorkingHoursWarning(match[1], firstWarning);
      }
    }

    setRouteWarnings(allWarnings);
  }, [userLocation, orderedPlaces, userPreferences, calculateTripStats]);

  const mapPlaces = useMemo(() => {
    const placeMarkers = orderedPlaces.map(p => ({
      id: p.id,
      title: p.title,
      lat: p.latitude,
      lng: p.longitude,
      address: p.address
    }));

    if (!userLocation) {
      return placeMarkers;
    }

    return [
      {
        id: 'user-location',
        title: userLocation.title || 'Your Location',
        lat: userLocation.lat,
        lng: userLocation.lng,
        address: 'Starting Point'
      },
      ...placeMarkers
    ];
  }, [userLocation, orderedPlaces]);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationPermission('granted');
        setIsLoadingLocation(false);
      },
      () => {
        alert('Enable location access to plan your route.');
        setLocationPermission('denied');
        setIsLoadingLocation(false);
      }
    );
  }, []);

  const movePlace = useCallback((index: number, direction: "up" | "down") => {
    const newPlaces = [...orderedPlaces];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newPlaces.length) {
      return;
    }
    
    [newPlaces[index], newPlaces[newIndex]] = [newPlaces[newIndex], newPlaces[index]];
    setOrderedPlaces(newPlaces);
  }, [orderedPlaces]);

  const removePlace = useCallback((index: number) => {
    const placeToRemove = orderedPlaces[index];
    setOrderedPlaces(orderedPlaces.filter((_, i) => i !== index));
    onPlaceRemoved(placeToRemove.id);
  }, [orderedPlaces, onPlaceRemoved]);

  const handleSave = useCallback(() => {
    onSave?.();
    alert("Route saved! (Production: save to database)");
  }, [onSave]);

  const handleYallaClick = useCallback(async () => {
    if (!userLocation) {
      alert('Set your starting location first!');
      return;
    }

    if (notificationPermission !== 'granted') {
      const granted = await ensureNotificationPermission();
      setNotificationPermission(granted ? 'granted' : 'denied');
    }

    if (routeWarnings.length > 0) {
      setShowWarningsModal(true);
    } else {
      setIsNavigationMode(true);
    }
  }, [userLocation, notificationPermission, routeWarnings]);

  const proceedWithNavigation = useCallback(() => {
    setShowWarningsModal(false);
    setIsNavigationMode(true);
  }, []);

  const handleExitNavigation = useCallback(() => {
    setIsNavigationMode(false);
  }, []);

  if (isNavigationMode && userLocation) {
    return (
      <NavigationMode
        startLocation={userLocation}
        places={orderedPlaces}
        onExit={handleExitNavigation}
      />
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/backgrounds/survey.jpg)',
            backgroundColor: '#5d4e37'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/40 via-[#8b6f47]/30 to-[#5d4e37]/40" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-32 pb-8">
          <div className="mb-8">
            <button
              onClick={onBack}
              className="mb-4 flex items-center gap-2 text-white/70 hover:text-white font-cinzel"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Selection
            </button>
            <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4">
              {orderedPlaces.length === 1 ? "Your Selected Location" : "Your Optimized Route"}
            </h1>
            <p className="font-cinzel text-white/80 text-lg">
              {orderedPlaces.length === 1
                ? "View your selected location on the map and add more places if you'd like."
                : "Review and adjust your trip route. Drag to reorder stops."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-[#5d4e37] rounded-lg p-6">
                {orderedPlaces.length >= 1 && (
                  <RouteMap places={mapPlaces} height="600px" />
                )}
              </div>
            </div>

            <div className="space-y-6">
              <LocationSelector
                currentLocation={userLocation}
                onLocationSelect={setUserLocation}
              />

              <RouteSummaryCard
                userLocation={userLocation}
                isLoadingLocation={isLoadingLocation}
                tripStats={tripStats}
                orderedPlaces={orderedPlaces}
                requestLocation={requestLocation}
                handleSave={handleSave}
                handleYallaClick={handleYallaClick}
              />

              <div className="bg-[#5d4e37] rounded-lg p-6">
                <h3 className="font-cinzel text-xl font-bold text-white mb-4">
                  Your Route
                </h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {orderedPlaces.map((place, index) => (
                    <RoutePlaceCard
                      key={place.id}
                      place={place}
                      index={index}
                      movePlace={movePlace}
                      removePlace={removePlace}
                      totalPlaces={orderedPlaces.length}
                    />
                  ))}
                </div>

                {userLocation && orderedPlaces.length >= 1 && (
                  <button
                    onClick={handleYallaClick}
                    className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-[#d4af37] to-[#e5bf47] text-[#3a3428] rounded-lg font-cinzel font-bold hover:from-[#e5bf47] hover:to-[#f5cf57] transition-all shadow-lg text-lg"
                  >
                    Yalla! Let's Go
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={orderedPlaces.length < 1}
                  className="w-full mt-2 px-6 py-3 bg-[#d4af37] text-[#3a3428] rounded-lg font-cinzel font-bold hover:bg-[#e5bf47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {orderedPlaces.length === 1 ? "Save Location" : "Save Route"}
                </button>
                <button
                  onClick={onBack}
                  className="w-full mt-2 px-6 py-3 bg-[#8b6f47] text-white rounded-lg font-cinzel font-semibold hover:bg-[#9d7f57] transition-colors"
                >
                  Add More Places
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showWarningsModal && (
        <WarningsModal
          warnings={routeWarnings}
          onClose={() => setShowWarningsModal(false)}
          onProceed={proceedWithNavigation}
        />
      )}
    </div>
  );
}
