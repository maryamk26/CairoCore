"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import PlaceMap to avoid SSR issues
const PlaceMap = dynamic(() => import("@/components/places/PlaceMap"), { ssr: false, loading: () => <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center rounded-lg">Loading map...</div> });

// ----------------------- Types -----------------------
type WorkingHours = Record<string, { open: string; close: string } | null>;
type BestTime = { season: string[]; timeOfDay: string[] };
type Place = {
  id: string;
  title: string;
  description: string;
  images: string[];
  location: { address: string; lat: number; lng: number };
  workingHours: WorkingHours;
  entryFees?: number;
  cameraFees?: number;
  vibe: string[];
  petsFriendly: boolean;
  kidsFriendly: boolean;
  bestTimeToVisit: BestTime;
  averageRating: number;
  totalReviews: number;
};

// ----------------------- Mock Data -----------------------
const getPlaceData = (id: string): Place | null => {
  const places: Record<string, Place> = {
    "1": { id: "1", title: "Pyramids and Sphinx", description: "The Great Pyramid of Giza ...", images: ["/images/places/pyramids.jpeg"], location: { address: "Al Haram, Giza Governorate, Egypt", lat: 29.9792, lng: 31.1342 }, workingHours: { monday: { open: "08:00", close: "17:00" }, tuesday: { open: "08:00", close: "17:00" }, wednesday: { open: "08:00", close: "17:00" }, thursday: { open: "08:00", close: "17:00" }, friday: { open: "08:00", close: "17:00" }, saturday: { open: "08:00", close: "17:00" }, sunday: { open: "08:00", close: "17:00" } }, entryFees: 200, cameraFees: 50, vibe: ["historical","photography","iconic","ancient"], petsFriendly: false, kidsFriendly: true, bestTimeToVisit: { season: ["Winter","Spring"], timeOfDay: ["Early Morning","Sunset"] }, averageRating: 4.8, totalReviews: 1247 },
    // Add other mock places...
  };
  return places[id] || null;
};

// ----------------------- Subcomponents -----------------------
const ImageCarousel = ({ images, title, rating, totalReviews }: { images: string[], title: string, rating: number, totalReviews: number }) => {
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  return (
    <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
      <img src={images[current]} alt={title} className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
      {images.length > 1 && <>
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3">◀</button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3">▶</button>
      </>}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-4">
          <div>{Array.from({ length: 5 }).map((_, i) => <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-400"}>★</span>)}</div>
          <span className="text-white/80">{rating} ({totalReviews} reviews)</span>
        </div>
      </div>
    </section>
  );
};

const PlaceNotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#3a3428]">
    <div className="text-center">
      <h1 className="text-4xl text-white mb-4">Place Not Found</h1>
      <Link href="/" className="text-white/80 hover:text-white">Return to Home</Link>
    </div>
  </div>
);

// ----------------------- Main Page -----------------------
export default function PlaceProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const place = getPlaceData(id);

  if (!place) return <PlaceNotFound />;

  return (
    <div className="min-h-screen bg-[#3a3428] font-cinzel">
      <ImageCarousel images={place.images} title={place.title} rating={place.averageRating} totalReviews={place.totalReviews} />

      <section className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-[#5d4e37] rounded-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">About</h2>
            <p className="text-white/90">{place.description}</p>
          </div>

          {/* Map */}
          <div className="bg-[#5d4e37] rounded-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Location</h2>
            <p className="text-white mb-2">{place.location.address}</p>
            <PlaceMap lat={place.location.lat} lng={place.location.lng} title={place.title} address={place.location.address} height="400px" zoom={15}/>
          </div>

          {/* Vibe */}
          <div className="bg-[#5d4e37] rounded-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Vibe</h2>
            <div className="flex flex-wrap gap-3">{place.vibe.map(tag => <span key={tag} className="px-4 py-2 bg-[#8b6f47] text-white rounded-full">{tag}</span>)}</div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#5d4e37] rounded-lg p-6 sticky top-4">
            <h3 className="text-xl font-bold text-white mb-6">Quick Info</h3>
            <p className="text-white mb-2">{place.location.address}</p>
            {place.entryFees && <p className="text-white">Entry Fees: {place.entryFees} EGP</p>}
            {place.cameraFees && <p className="text-white">Camera Fees: {place.cameraFees} EGP</p>}
            {place.petsFriendly && <p className="text-green-400">Pets Allowed</p>}
            {place.kidsFriendly && <p className="text-green-400">Kids Friendly</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
