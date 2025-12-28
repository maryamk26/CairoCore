"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Next.js
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png";
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

// Custom icon creator for numbered markers
function createNumberedIcon(number: number, color: string = "#3388ff") {
  return L.divIcon({
    className: "custom-numbered-marker",
    html: `<div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

L.Marker.prototype.options.icon = DefaultIcon;

interface Place {
  id: string;
  title: string;
  lat: number;
  lng: number;
  address?: string;
}

interface RouteMapProps {
  places: Place[];
  height?: string;
}

// Component to fit map bounds to show all markers
function MapBoundsUpdater({ places }: { places: Place[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map(place => [place.lat, place.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [places, map]);

  return null;
}

// Fetch route from OSRM API (free Open Source Routing Machine)
async function fetchRoute(places: Place[]): Promise<L.LatLng[][] | null> {
  if (places.length < 2) return null;

  try {
    // Build coordinates string for OSRM API (longitude,latitude format)
    const coordinates = places.map(place => `${place.lng},${place.lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code === "Ok" && data.routes && data.routes.length > 0) {
      // Convert GeoJSON coordinates [lng, lat] to Leaflet LatLng format [lat, lng]
      const geometry = data.routes[0].geometry.coordinates;
      const routePoints = geometry.map(([lng, lat]: [number, number]) => 
        [lat, lng] as [number, number]
      );
      return [routePoints];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}

export default function RouteMap({ places, height = "500px" }: RouteMapProps) {
  const [routeCoordinates, setRouteCoordinates] = useState<L.LatLng[][] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (places.length >= 2) {
      setIsLoading(true);
      fetchRoute(places).then(route => {
        setRouteCoordinates(route);
        setIsLoading(false);
      });
    } else {
      setRouteCoordinates(null);
    }
  }, [places]);

  if (typeof window === "undefined") {
    return (
      <div 
        className="w-full bg-gray-200 flex items-center justify-center rounded-lg"
        style={{ height }}
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div 
        className="w-full bg-gray-200 flex items-center justify-center rounded-lg"
        style={{ height }}
      >
        <p className="text-gray-500">No places selected</p>
      </div>
    );
  }

  // Calculate center point
  const centerLat = places.reduce((sum, place) => sum + place.lat, 0) / places.length;
  const centerLng = places.reduce((sum, place) => sum + place.lng, 0) / places.length;

  return (
    <div className="w-full rounded-lg overflow-hidden relative" style={{ height }}>
      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm text-gray-700">Loading route...</p>
        </div>
      )}
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Route polyline */}
        {routeCoordinates && routeCoordinates.map((route, index) => (
          <Polyline
            key={index}
            positions={route}
            color="#3b82f6"
            weight={4}
            opacity={0.7}
          />
        ))}
        
        {/* Markers */}
        {places.map((place, index) => {
          const isFirst = index === 0;
          const isLast = index === places.length - 1;
          // Green for start, red for end, blue for intermediate
          const color = isFirst ? "#22c55e" : isLast ? "#ef4444" : "#3b82f6";
          const icon = createNumberedIcon(index + 1, color);
          
          return (
            <Marker key={place.id} position={[place.lat, place.lng]} icon={icon}>
              <Popup>
                <div className="font-semibold text-sm mb-1">
                  {index + 1}. {place.title}
                </div>
                {place.address && (
                  <div className="text-xs text-gray-600">{place.address}</div>
                )}
              </Popup>
            </Marker>
          );
        })}
        
        <MapBoundsUpdater places={places} />
      </MapContainer>
    </div>
  );
}

