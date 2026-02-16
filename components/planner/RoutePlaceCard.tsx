import React from "react";
import { PlaceRecommendation } from "@/utils/planner/recommendation";

interface Props {
  place: PlaceRecommendation;
  index: number;
  movePlace: (index: number, direction: "up" | "down") => void;
  removePlace: (index: number) => void;
  totalPlaces: number;
}

export default function RoutePlaceCard({ place, index, movePlace, removePlace, totalPlaces }: Props) {
  return (
    <div className="bg-[#8b6f47] rounded-lg p-4">
      <div className="flex items-start gap-3">
        {/* Number Badge */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-[#3a3428] font-bold">
          {index + 1}
        </div>

        {/* Place Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm mb-1">{place.title}</h4>
          <p className="text-white/60 text-xs mb-2">{place.address}</p>
          <div className="flex items-center gap-2 text-white/70 text-xs">
            {place.entryFees ? (
              <span>{place.entryFees} EGP</span>
            ) : (
              <span className="text-[#d4af37]">Free</span>
            )}
            {place.kidsFriendly && <span title="Kid-friendly">👶</span>}
            {place.petsFriendly && <span title="Pet-friendly">🐕</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <button onClick={() => movePlace(index, "up")} disabled={index === 0} className="p-1 text-white/70 hover:text-white disabled:opacity-30">
            ↑
          </button>
          <button onClick={() => movePlace(index, "down")} disabled={index === totalPlaces - 1} className="p-1 text-white/70 hover:text-white disabled:opacity-30">
            ↓
          </button>
          <button onClick={() => removePlace(index)} className="p-1 text-red-400 hover:text-red-300">✕</button>
        </div>
      </div>
    </div>
  );
}
