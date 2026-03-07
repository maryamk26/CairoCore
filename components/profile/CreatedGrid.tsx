"use client";

import Link from "next/link";

export interface PlaceItem {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  address: string | null;
  createdAt: string;
}

interface CreatedGridProps {
  places: PlaceItem[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const months = Math.floor((now.getTime() - d.getTime()) / (30 * 24 * 60 * 60 * 1000));
  if (months < 1) return "Just now";
  if (months === 1) return "1mo";
  return `${months}mo`;
}

export default function CreatedGrid({ places }: CreatedGridProps) {
  if (places.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="font-medium">
          No places yet
        </p>
        <p className="text-sm mt-1">Places you add will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-6">
      {places.map((place) => (
        <Link
          key={place.id}
          href={`/places/${place.id}`}
          className="group rounded-2xl overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <div className="aspect-[3/4] relative bg-gray-200">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: "url(/images/backgrounds/home1.jpg)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 truncate">
              {place.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {place.category ?? "Place"} · {formatDate(place.createdAt)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
