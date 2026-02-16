"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PlaceRecommendation } from "@/utils/planner/recommendation";

// -------------------------
// Custom Leaflet Icons
// -------------------------

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

const destinationIcon = (color: string = "#ef4444") =>
  L.divIcon({
    className: "custom-destination-marker",
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

// -------------------------
// Types
// -------------------------

export interface NavigationStep {
  distance: number;
  duration: number;
  instruction: string;
  location: [number, number]; // [lng, lat]
  maneuver: {
    type: string;
    modifier?: string;
  };
}

interface NavigationMapProps {
  userLocation: [number, number]; // [lat, lng]
  steps: NavigationStep[];
  currentStep: number;
  places: PlaceRecommendation[];
}

// -------------------------
// Map Follower Component
// -------------------------

function MapFollower({ userLocation }: { userLocation: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(userLocation, 17, { animate: true });
  }, [userLocation, map]);

  return null;
}

// -------------------------
// Main Component
// -------------------------

export default function NavigationMap({
  userLocation,
  steps,
  currentStep,
  places,
}: NavigationMapProps) {
  if (typeof window === "undefined") {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading map...</p>
      </div>
    );
  }

  // Convert steps to [lat, lng] polyline coordinates
  const routeCoordinates: [number, number][] = steps.map((step) => {
    const [lng, lat] = step.location; // <-- correct access
    return [lat, lng];
  });

  // Completed and remaining routes
  const completedRoute = routeCoordinates.slice(0, currentStep + 1);
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

        {/* Completed Route */}
        {completedRoute.length > 1 && (
          <Polyline positions={completedRoute} color="#9ca3af" weight={6} opacity={0.6} />
        )}

        {/* Remaining Route */}
        {remainingRoute.length > 1 && (
          <Polyline positions={remainingRoute} color="#3b82f6" weight={6} opacity={0.9} />
        )}

        {/* User Marker */}
        <Marker position={userLocation} icon={userLocationIcon} />

        {/* Accuracy Circle */}
        <Circle
          center={userLocation}
          radius={20}
          pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.1, weight: 1 }}
        />

        {/* Place Markers */}
        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={destinationIcon("#ef4444")}
          />
        ))}

        {/* Keep user centered */}
        <MapFollower userLocation={userLocation} />
      </MapContainer>
    </div>
  );
}
