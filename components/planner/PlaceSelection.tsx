"use client";

import { PlaceRecommendation } from "@/utils/planner/recommendation";
import Image from "next/image";

interface PlaceSelectionProps {
  recommendations: PlaceRecommendation[];
  selectedPlaces: PlaceRecommendation[];
  onTogglePlace: (place: PlaceRecommendation) => void;
  onContinue: () => void;
}

export default function PlaceSelection({
  recommendations,
  selectedPlaces,
  onTogglePlace,
  onContinue,
}: PlaceSelectionProps) {
  const isSelected = (placeId: string) => {
    return selectedPlaces.some((p) => p.id === placeId);
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
        {/* Overlay for readability - gradient overlay like survey page */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/40 via-[#8b6f47]/30 to-[#5d4e37]/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-32 pb-8">
        <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Your Personalized Recommendations
          </h1>
          <p className="font-cinzel text-white/80 text-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Based on your preferences, we've selected the best places for you. Choose the ones you'd like to visit!
          </p>
        </div>

        {/* Selected Count */}
        {selectedPlaces.length > 0 && (
          <div className="bg-[#d4af37] text-[#3a3428] rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="font-cinzel font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              {selectedPlaces.length} place{selectedPlaces.length !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={onContinue}
              disabled={selectedPlaces.length < 1}
              className="px-6 py-2 bg-[#3a3428] text-[#d4af37] rounded-lg font-cinzel font-semibold hover:bg-[#4a4438] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              {selectedPlaces.length === 1 ? "View Location →" : "Build My Route →"}
            </button>
          </div>
        )}

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((place) => {
            const selected = isSelected(place.id);
            return (
              <div
                key={place.id}
                className={`bg-[#5d4e37] rounded-lg overflow-hidden shadow-lg transition-all cursor-pointer ${
                  selected ? "ring-4 ring-[#d4af37]" : "hover:ring-2 hover:ring-white/30"
                }`}
                onClick={() => onTogglePlace(place)}
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-800">
                  {place.images && place.images.length > 0 ? (
                    <Image
                      src={place.images[0]}
                      alt={place.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Match Score Badge */}
                  <div className="absolute top-3 right-3 bg-[#d4af37] text-[#3a3428] px-3 py-1 rounded-full font-cinzel font-bold text-sm">
                    {Math.round(place.matchScore)}% Match
                  </div>

                  {/* Selected Indicator */}
                  {selected && (
                    <div className="absolute top-3 left-3 bg-[#d4af37] text-[#3a3428] w-8 h-8 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-cinzel text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {place.title}
                  </h3>
                  
                  <p className="font-cinzel text-white/70 text-sm mb-3 line-clamp-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {place.description}
                  </p>

                  {/* Match Reasons */}
                  {place.matchReasons && place.matchReasons.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {place.matchReasons.slice(0, 2).map((reason, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#d4af37] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-cinzel text-white/80 text-xs" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                            {reason}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Vibe Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {place.vibe.slice(0, 3).map((vibe) => (
                      <span
                        key={vibe}
                        className="px-2 py-1 bg-[#8b6f47] text-white text-xs rounded font-cinzel"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>

                  {/* Price & Icons */}
                  <div className="flex items-center justify-between text-white/70 text-sm">
                    <div className="flex items-center gap-2">
                      {place.entryFees !== null && place.entryFees > 0 ? (
                        <span className="font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                          {place.entryFees} EGP
                        </span>
                      ) : (
                        <span className="font-cinzel text-[#d4af37]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                          Free
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {place.kidsFriendly && <span title="Kid-friendly">👶</span>}
                      {place.petsFriendly && <span title="Pet-friendly">🐕</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </div>
  );
}

