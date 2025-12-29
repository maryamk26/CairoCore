"use client";

import { useState, useEffect } from "react";

interface SavedLocation {
  id: string;
  title: string;
  address?: string;
  latitude: number;
  longitude: number;
}

interface LocationSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; title?: string }) => void;
  currentLocation: { lat: number; lng: number } | null;
}

export default function LocationSelector({ onLocationSelect, currentLocation }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'browser' | 'manual' | 'saved'>('browser');
  const [isLoadingBrowser, setIsLoadingBrowser] = useState(false);
  
  // Manual entry state
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [locationTitle, setLocationTitle] = useState('');
  const [shouldSave, setShouldSave] = useState(false);
  
  // Saved locations
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Fetch saved locations when component mounts or when saved tab is opened
  useEffect(() => {
    if (mode === 'saved' && savedLocations.length === 0) {
      fetchSavedLocations();
    }
  }, [mode]);

  const fetchSavedLocations = async () => {
    setIsLoadingSaved(true);
    try {
      const response = await fetch('/api/user/locations');
      if (response.ok) {
        const data = await response.json();
        setSavedLocations(data.locations || []);
      }
    } catch (error) {
      console.error('Error fetching saved locations:', error);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const handleBrowserLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoadingBrowser(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            title: 'Current Location',
          });
          setIsLoadingBrowser(false);
          setIsOpen(false);
        },
        (error) => {
          alert('Please enable location access in your browser settings.');
          setIsLoadingBrowser(false);
        }
      );
    }
  };

  const handleManualEntry = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Coordinates out of range. Latitude: -90 to 90, Longitude: -180 to 180');
      return;
    }
    
    onLocationSelect({
      lat,
      lng,
      title: locationTitle || 'Custom Location',
    });
    
    if (shouldSave && locationTitle) {
      // Save to database via API
      saveLocation(locationTitle, lat, lng);
    }
    
    // Reset form
    setManualLat('');
    setManualLng('');
    setLocationTitle('');
    setShouldSave(false);
    setIsOpen(false);
  };

  const saveLocation = async (title: string, lat: number, lng: number) => {
    try {
      const response = await fetch('/api/user/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          latitude: lat,
          longitude: lng,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add to local state
        setSavedLocations([data.location, ...savedLocations]);
      } else {
        console.error('Failed to save location');
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const deleteLocation = async (locationId: string) => {
    try {
      const response = await fetch(`/api/user/locations?id=${locationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from local state
        setSavedLocations(savedLocations.filter(loc => loc.id !== locationId));
      } else {
        console.error('Failed to delete location');
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleSavedLocation = (location: SavedLocation) => {
    onLocationSelect({
      lat: location.latitude,
      lng: location.longitude,
      title: location.title,
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 bg-[#d4af37] text-[#3a3428] rounded font-cinzel font-semibold hover:bg-[#e5bf47] transition-colors text-sm"
        style={{ fontFamily: 'var(--font-cinzel), serif' }}
      >
        {currentLocation ? 'Change Starting Location' : 'Set Starting Location'}
      </button>
    );
  }

  return (
    <div className="bg-[#8b6f47] rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-cinzel text-white font-bold text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Select Starting Location
        </h4>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/70 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('browser')}
          className={`flex-1 px-3 py-2 rounded font-cinzel text-xs font-semibold transition-colors ${
            mode === 'browser'
              ? 'bg-[#d4af37] text-[#3a3428]'
              : 'bg-[#5d4e37] text-white hover:bg-[#6d5e47]'
          }`}
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          📍 Current
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 px-3 py-2 rounded font-cinzel text-xs font-semibold transition-colors ${
            mode === 'manual'
              ? 'bg-[#d4af37] text-[#3a3428]'
              : 'bg-[#5d4e37] text-white hover:bg-[#6d5e47]'
          }`}
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          ✏️ Manual
        </button>
        <button
          onClick={() => setMode('saved')}
          className={`flex-1 px-3 py-2 rounded font-cinzel text-xs font-semibold transition-colors ${
            mode === 'saved'
              ? 'bg-[#d4af37] text-[#3a3428]'
              : 'bg-[#5d4e37] text-white hover:bg-[#6d5e47]'
          }`}
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          💾 Saved
        </button>
      </div>

      {/* Browser Location */}
      {mode === 'browser' && (
        <div className="space-y-2">
          <p className="font-cinzel text-white/80 text-xs" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Use your device's current location
          </p>
          <button
            onClick={handleBrowserLocation}
            disabled={isLoadingBrowser}
            className="w-full px-4 py-3 bg-[#d4af37] text-[#3a3428] rounded font-cinzel font-bold hover:bg-[#e5bf47] transition-colors disabled:opacity-50"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            {isLoadingBrowser ? 'Getting Location...' : 'Use Current Location'}
          </button>
        </div>
      )}

      {/* Manual Entry */}
      {mode === 'manual' && (
        <div className="space-y-3">
          <div>
            <label className="font-cinzel text-white text-xs mb-1 block" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Location Name (optional)
            </label>
            <input
              type="text"
              value={locationTitle}
              onChange={(e) => setLocationTitle(e.target.value)}
              placeholder="e.g., Home, Work, Hotel"
              className="w-full px-3 py-2 rounded bg-[#5d4e37] text-white placeholder-white/50 font-cinzel text-sm"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-cinzel text-white text-xs mb-1 block" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="30.0444"
                className="w-full px-3 py-2 rounded bg-[#5d4e37] text-white placeholder-white/50 font-cinzel text-sm"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              />
            </div>
            <div>
              <label className="font-cinzel text-white text-xs mb-1 block" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                placeholder="31.2357"
                className="w-full px-3 py-2 rounded bg-[#5d4e37] text-white placeholder-white/50 font-cinzel text-sm"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shouldSave}
              onChange={(e) => setShouldSave(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="font-cinzel text-white text-xs" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Save for future use
            </span>
          </label>
          <button
            onClick={handleManualEntry}
            className="w-full px-4 py-3 bg-[#d4af37] text-[#3a3428] rounded font-cinzel font-bold hover:bg-[#e5bf47] transition-colors"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            Use This Location
          </button>
        </div>
      )}

      {/* Saved Locations */}
      {mode === 'saved' && (
        <div className="space-y-2">
          {isLoadingSaved ? (
            <p className="font-cinzel text-white/70 text-xs text-center py-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Loading saved locations...
            </p>
          ) : savedLocations.length === 0 ? (
            <p className="font-cinzel text-white/70 text-xs text-center py-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              No saved locations yet. Add one manually!
            </p>
          ) : (
            savedLocations.map((location) => (
              <div
                key={location.id}
                className="w-full p-3 bg-[#5d4e37] rounded flex items-start justify-between gap-2"
              >
                <button
                  onClick={() => handleSavedLocation(location)}
                  className="flex-1 text-left hover:opacity-80 transition-opacity"
                >
                  <p className="font-cinzel text-white font-semibold text-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {location.title}
                  </p>
                  {location.address && (
                    <p className="font-cinzel text-white/60 text-xs mt-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {location.address}
                    </p>
                  )}
                  <p className="font-cinzel text-white/50 text-xs mt-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                </button>
                <button
                  onClick={() => deleteLocation(location.id)}
                  className="p-1 text-red-400 hover:text-red-300"
                  aria-label="Delete location"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

