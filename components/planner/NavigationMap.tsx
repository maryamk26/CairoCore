"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PlaceRecommendation } from "@/utils/planner/recommendation";

// Custom icon for user's current location
const userLocationIcon = L.divIcon({
  className: "custom-user-marker",
  html: `<div style="
    background-color: #3b82f6;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 4px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Custom icon for destination markers
const destinationIcon = (color: string = "#ef4444") => L.divIcon({
  className: "custom-destination-marker",
  html: `<div style="
    background-color: ${color};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
  ">📍</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

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

interface NavigationMapProps {
  userLocation: [number, number];
  steps: NavigationStep[];
  currentStep: number;
  places: PlaceRecommendation[];
}

// Component to update map view to follow user
function MapFollower({ userLocation }: { userLocation: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(userLocation, 17, { animate: true });
  }, [userLocation, map]);

  return null;
}

export default function NavigationMap({ userLocation, steps, currentStep, places }: NavigationMapProps) {
  if (typeof window === "undefined") {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading map...</p>
      </div>
    );
  }

  // Convert steps to route polyline
  const routeCoordinates: [number, number][] = steps.map(step => 
    [step.location[1], step.location[0]] // Convert from [lng, lat] to [lat, lng]
  );

  // Completed route (from start to current position)
  const completedRoute = routeCoordinates.slice(0, currentStep + 1);
  
  // Remaining route (from current position to end)
  const remainingRoute = routeCoordinates.slice(currentStep);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={userLocation}
        zoom={17}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Completed route - gray */}
        {completedRoute.length > 1 && (
          <Polyline
            positions={completedRoute}
            color="#9ca3af"
            weight={6}
            opacity={0.6}
          />
        )}
        
        {/* Remaining route - blue */}
        {remainingRoute.length > 1 && (
          <Polyline
            positions={remainingRoute}
            color="#3b82f6"
            weight={6}
            opacity={0.9}
          />
        )}
        
        {/* User's current location */}
        <Marker position={userLocation} icon={userLocationIcon} />
        
        {/* Accuracy circle around user */}
        <Circle
          center={userLocation}
          radius={20}
          pathOptions={{
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1,
          }}
        />
        
        {/* Destination markers */}
        {places.map((place, index) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={destinationIcon("#ef4444")}
          />
        ))}
        
        {/* Map follower to keep user centered */}
        <MapFollower userLocation={userLocation} />
      </MapContainer>
    </div>
  );
}

