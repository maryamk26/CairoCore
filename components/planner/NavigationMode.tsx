"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { PlaceRecommendation } from "@/utils/planner/recommendation";

const NavigationMap = dynamic(() => import("@/components/planner/NavigationMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white">Loading navigation...</p>
    </div>
  ),
});

type TransportMode = 'driving' | 'walking' | 'cycling';

interface NavigationStep {
  distance: number;
  duration: number;
  instruction: string;
  location: [number, number];
  maneuver: {
    type: string;
    modifier?: string;
  };
}

interface NavigationModeProps {
  startLocation: { lat: number; lng: number; title?: string };
  places: PlaceRecommendation[];
  onExit: () => void;
}

export default function NavigationMode({ startLocation, places, onExit }: NavigationModeProps) {
  const [transportMode, setTransportMode] = useState<TransportMode | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [steps, setSteps] = useState<NavigationStep[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [userLocation, setUserLocation] = useState<[number, number]>([startLocation.lat, startLocation.lng]);
  const [isNavigating, setIsNavigating] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Fetch route with turn-by-turn directions
  const fetchNavigationRoute = async (mode: TransportMode) => {
    setIsLoadingRoute(true);
    try {
      // Build all waypoints: start + all places
      const allPoints = [
        startLocation,
        ...places.map(p => ({ lat: p.latitude, lng: p.longitude }))
      ];

      const coordinates = allPoints.map(p => `${p.lng},${p.lat}`).join(';');
      
      // Use appropriate OSRM profile based on transport mode
      const profile = mode === 'driving' ? 'car' : mode === 'cycling' ? 'bike' : 'foot';
      const url = `https://router.project-osrm.org/route/v1/${profile}/${coordinates}?` +
        `overview=full&geometries=geojson&steps=true&annotations=true`;

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.code === "Ok" && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          
          // Extract all steps from all legs
          const allSteps: NavigationStep[] = [];
          route.legs.forEach((leg: any) => {
            leg.steps.forEach((step: any) => {
              allSteps.push({
                distance: step.distance,
                duration: step.duration,
                instruction: step.maneuver.instruction || getInstructionFromManeuver(step.maneuver),
                location: step.maneuver.location,
                maneuver: step.maneuver
              });
            });
          });

          setSteps(allSteps);
          setTotalDistance(route.distance);
          setTotalDuration(route.duration);
          setIsNavigating(true);
          startLocationTracking();
        }
      }
    } catch (error) {
      console.error('Error fetching navigation route:', error);
      alert('Failed to load navigation route. Please try again.');
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Convert maneuver type to readable instruction
  const getInstructionFromManeuver = (maneuver: any): string => {
    const type = maneuver.type;
    const modifier = maneuver.modifier;
    
    const instructions: { [key: string]: string } = {
      'depart': 'Head ' + (modifier || 'straight'),
      'turn': 'Turn ' + (modifier || ''),
      'new name': 'Continue on new road',
      'continue': 'Continue straight',
      'arrive': 'Arrive at destination',
      'merge': 'Merge ' + (modifier || ''),
      'fork': 'Take the fork ' + (modifier || ''),
      'roundabout': 'Take the roundabout',
      'exit roundabout': 'Exit the roundabout',
    };

    return instructions[type] || `${type} ${modifier || ''}`.trim();
  };

  // Start tracking user's real-time location
  const startLocationTracking = () => {
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          setUserLocation(newLocation);
          
          // Check if we're close to the next step
          if (steps[currentStep]) {
            const [stepLat, stepLng] = steps[currentStep].location;
            const distance = calculateDistance(
              newLocation[0],
              newLocation[1],
              stepLat,
              stepLng
            );
            
            // If within 20 meters, move to next step
            if (distance < 0.02) {
              if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
              }
            }
          }
        },
        (error) => {
          console.error('Location tracking error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  // Stop location tracking
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Calculate distance between two points (in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Mode selection screen
  if (!transportMode) {
    return (
      <div className="fixed inset-0 bg-[#3a3428] z-50 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <button
            onClick={onExit}
            className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors font-cinzel"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4 text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Choose Your Transport
          </h1>
          <p className="font-cinzel text-white/80 text-lg mb-8 text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            How would you like to travel?
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Driving */}
            <button
              onClick={() => {
                setTransportMode('driving');
                fetchNavigationRoute('driving');
              }}
              className="bg-[#5d4e37] hover:bg-[#6d5e47] p-8 rounded-lg transition-colors group"
            >
              <div className="text-6xl mb-4 text-center">🚗</div>
              <h3 className="font-cinzel text-white text-xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Car
              </h3>
              <p className="font-cinzel text-white/70 text-sm text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Fastest route
              </p>
            </button>

            {/* Walking */}
            <button
              onClick={() => {
                setTransportMode('walking');
                fetchNavigationRoute('walking');
              }}
              className="bg-[#5d4e37] hover:bg-[#6d5e47] p-8 rounded-lg transition-colors group"
            >
              <div className="text-6xl mb-4 text-center">🚶</div>
              <h3 className="font-cinzel text-white text-xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Walking
              </h3>
              <p className="font-cinzel text-white/70 text-sm text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Pedestrian paths
              </p>
            </button>

            {/* Cycling */}
            <button
              onClick={() => {
                setTransportMode('cycling');
                fetchNavigationRoute('cycling');
              }}
              className="bg-[#5d4e37] hover:bg-[#6d5e47] p-8 rounded-lg transition-colors group"
            >
              <div className="text-6xl mb-4 text-center">🚴</div>
              <h3 className="font-cinzel text-white text-xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Bicycle
              </h3>
              <p className="font-cinzel text-white/70 text-sm text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Bike-friendly
              </p>
            </button>

            {/* Motorcycle */}
            <button
              onClick={() => {
                setTransportMode('driving'); // Use driving profile for motorcycle
                fetchNavigationRoute('driving');
              }}
              className="bg-[#5d4e37] hover:bg-[#6d5e47] p-8 rounded-lg transition-colors group"
            >
              <div className="text-6xl mb-4 text-center">🏍️</div>
              <h3 className="font-cinzel text-white text-xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Motorcycle
              </h3>
              <p className="font-cinzel text-white/70 text-sm text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Quick & agile
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (isLoadingRoute) {
    return (
      <div className="fixed inset-0 bg-[#3a3428] z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="font-cinzel text-white text-xl" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Calculating route...
          </p>
        </div>
      </div>
    );
  }

  // Navigation screen
  if (isNavigating && steps.length > 0) {
    const currentStepData = steps[currentStep];
    const remainingDistance = steps.slice(currentStep).reduce((sum, step) => sum + step.distance, 0);
    const remainingDuration = steps.slice(currentStep).reduce((sum, step) => sum + step.duration, 0);

    return (
      <div className="fixed inset-0 bg-gray-900 z-50">
        {/* Map */}
        <NavigationMap
          userLocation={userLocation}
          steps={steps}
          currentStep={currentStep}
          places={places}
        />

        {/* Top instruction panel */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-4 z-10">
          <div className="container mx-auto">
            <div className="flex items-start justify-between mb-4">
              <button
                onClick={() => {
                  if (watchIdRef.current) {
                    navigator.geolocation.clearWatch(watchIdRef.current);
                  }
                  onExit();
                }}
                className="text-white/70 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex gap-2">
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {formatDuration(remainingDuration)}
                  </span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {formatDistance(remainingDistance)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {currentStepData.maneuver.type === 'arrive' ? '🎯' :
                   currentStepData.maneuver.modifier?.includes('left') ? '⬅️' :
                   currentStepData.maneuver.modifier?.includes('right') ? '➡️' : '⬆️'}
                </div>
                <div className="flex-1">
                  <p className="font-cinzel text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {currentStepData.instruction}
                  </p>
                  <p className="font-cinzel text-gray-600 text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    in {formatDistance(currentStepData.distance)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom steps list */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 z-10 max-h-48 overflow-y-auto">
          <div className="container mx-auto space-y-2">
            {steps.slice(currentStep + 1, currentStep + 4).map((step, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <p className="font-cinzel text-white text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  {step.instruction} - {formatDistance(step.distance)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

