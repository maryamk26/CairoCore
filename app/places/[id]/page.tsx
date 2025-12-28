"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";

// Mock data - in production this would come from an API
const getPlaceData = (id: string) => {
  const places: Record<string, any> = {
    "1": {
      id: "1",
      title: "Pyramids and Sphinx",
      description: "The Great Pyramid of Giza and the Great Sphinx are among the most famous monuments in the world. These ancient wonders have stood for over 4,500 years, representing the pinnacle of ancient Egyptian engineering and architecture. The Pyramids of Giza are the only remaining wonder of the Seven Wonders of the Ancient World.",
      images: [
        "/images/places/pyramids.jpeg",
        "/images/places/pyramids.jpeg",
        "/images/places/pyramids.jpeg"
      ],
      location: {
        address: "Al Haram, Giza Governorate, Egypt",
        lat: 29.9792,
        lng: 31.1342
      },
      workingHours: {
        monday: { open: "08:00", close: "17:00" },
        tuesday: { open: "08:00", close: "17:00" },
        wednesday: { open: "08:00", close: "17:00" },
        thursday: { open: "08:00", close: "17:00" },
        friday: { open: "08:00", close: "17:00" },
        saturday: { open: "08:00", close: "17:00" },
        sunday: { open: "08:00", close: "17:00" }
      },
      entryFees: 200,
      cameraFees: 50,
      vibe: ["historical", "photography", "iconic", "ancient"],
      petsFriendly: false,
      kidsFriendly: true,
      bestTimeToVisit: {
        season: ["Winter", "Spring"],
        timeOfDay: ["Early Morning", "Sunset"]
      },
      averageRating: 4.8,
      totalReviews: 1247
    },
    "2": {
      id: "2",
      title: "Grand Museum",
      description: "The Grand Egyptian Museum, also known as the Giza Museum, is a world-class institution that houses the largest collection of ancient Egyptian artifacts. This state-of-the-art museum showcases over 100,000 artifacts, including the complete collection of Tutankhamun's treasures.",
      images: [
        "/images/places/grandm.jpeg",
        "/images/places/grandm.jpeg",
        "/images/places/grandm.jpeg"
      ],
      location: {
        address: "Cairo-Alexandria Desert Rd, Kafr Nassar, Al Giza Desert, Giza Governorate, Egypt",
        lat: 30.0081,
        lng: 31.1322
      },
      workingHours: {
        monday: { open: "09:00", close: "18:00" },
        tuesday: { open: "09:00", close: "18:00" },
        wednesday: { open: "09:00", close: "18:00" },
        thursday: { open: "09:00", close: "18:00" },
        friday: { open: "09:00", close: "18:00" },
        saturday: { open: "09:00", close: "18:00" },
        sunday: { open: "09:00", close: "18:00" }
      },
      entryFees: 400,
      cameraFees: 50,
      vibe: ["museum", "educational", "historical", "family-friendly"],
      petsFriendly: false,
      kidsFriendly: true,
      bestTimeToVisit: {
        season: ["All Year"],
        timeOfDay: ["Morning", "Afternoon"]
      },
      averageRating: 4.9,
      totalReviews: 892
    },
    "3": {
      id: "3",
      title: "Khan el-Khalili",
      description: "Khan el-Khalili is a major souk in the historic center of Islamic Cairo. The bazaar district is one of Cairo's main attractions for tourists and Egyptians alike. Established in the 14th century, it's a vibrant marketplace where you can find everything from spices and perfumes to jewelry and traditional crafts.",
      images: [
        "/images/places/khan.jpeg",
        "/images/places/khan.jpeg",
        "/images/places/khan.jpeg"
      ],
      location: {
        address: "El-Gamaleya, El Gamaliya, Cairo Governorate, Egypt",
        lat: 30.0479,
        lng: 31.2626
      },
      workingHours: {
        monday: { open: "09:00", close: "21:00" },
        tuesday: { open: "09:00", close: "21:00" },
        wednesday: { open: "09:00", close: "21:00" },
        thursday: { open: "09:00", close: "21:00" },
        friday: { open: "09:00", close: "21:00" },
        saturday: { open: "09:00", close: "21:00" },
        sunday: { open: "09:00", close: "21:00" }
      },
      entryFees: null,
      cameraFees: null,
      vibe: ["shopping", "cultural", "historic", "authentic"],
      petsFriendly: true,
      kidsFriendly: true,
      bestTimeToVisit: {
        season: ["All Year"],
        timeOfDay: ["Evening"]
      },
      averageRating: 4.5,
      totalReviews: 2156
    },
    "4": {
      id: "4",
      title: "Cairo Tower",
      description: "The Cairo Tower is a free-standing concrete tower in Cairo, Egypt. At 187 meters, it was the tallest structure in Egypt and North Africa for 50 years until 1998. The tower offers panoramic views of Cairo and the Nile River, making it one of the city's most iconic landmarks.",
      images: [
        "/images/places/cairotower.jpeg",
        "/images/places/cairotower.jpeg",
        "/images/places/cairotower.jpeg"
      ],
      location: {
        address: "Zamalek, Cairo Governorate, Egypt",
        lat: 30.0456,
        lng: 31.2242
      },
      workingHours: {
        monday: { open: "09:00", close: "00:00" },
        tuesday: { open: "09:00", close: "00:00" },
        wednesday: { open: "09:00", close: "00:00" },
        thursday: { open: "09:00", close: "00:00" },
        friday: { open: "09:00", close: "00:00" },
        saturday: { open: "09:00", close: "00:00" },
        sunday: { open: "09:00", close: "00:00" }
      },
      entryFees: 200,
      cameraFees: null,
      vibe: ["views", "romantic", "iconic", "modern"],
      petsFriendly: false,
      kidsFriendly: true,
      bestTimeToVisit: {
        season: ["All Year"],
        timeOfDay: ["Sunset", "Evening", "Night"]
      },
      averageRating: 4.3,
      totalReviews: 678
    }
  };

  return places[id] || null;
};

export default function PlaceProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = use(params);
  const place = getPlaceData(id);

  if (!place) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3a3428]">
        <div className="text-center">
          <h1 className="font-cinzel text-4xl text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Place Not Found
          </h1>
          <Link 
            href="/" 
            className="font-cinzel text-white/80 hover:text-white transition-colors"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % place.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + place.images.length) % place.images.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-400"}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#3a3428]">
      {/* Image Carousel Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {place.images.length > 0 && (
          <>
            <img
              src={place.images[currentImageIndex]}
              alt={place.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
            
            {/* Navigation Arrows */}
            {place.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Indicators */}
            {place.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {place.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "w-8 bg-white" : "w-2 bg-white/50"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                {place.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(place.averageRating)}
                </div>
                <span className="text-white/80 font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  {place.averageRating} ({place.totalReviews} reviews)
                </span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-[#5d4e37] rounded-lg p-6 md:p-8">
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                About
              </h2>
              <p className="font-cinzel text-white/90 leading-relaxed text-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                {place.description}
              </p>
            </div>

            {/* Vibe Tags */}
            <div className="bg-[#5d4e37] rounded-lg p-6 md:p-8">
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Vibe
              </h2>
              <div className="flex flex-wrap gap-3">
                {place.vibe.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-[#8b6f47] text-white rounded-full font-cinzel text-sm"
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section - Placeholder */}
            <div className="bg-[#5d4e37] rounded-lg p-6 md:p-8">
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Reviews & Memories
              </h2>
              <p className="font-cinzel text-white/70 text-center py-8" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Reviews and memories will be displayed here
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-[#5d4e37] rounded-lg p-6 sticky top-4">
              <h3 className="font-cinzel text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Quick Info
              </h3>
              
              <div className="space-y-4">
                {/* Location */}
                <div>
                  <p className="font-cinzel text-white/70 text-sm mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    Location
                  </p>
                  <p className="font-cinzel text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                    {place.location.address}
                  </p>
                </div>

                {/* Entry Fees */}
                {place.entryFees && (
                  <div>
                    <p className="font-cinzel text-white/70 text-sm mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      Entry Fees
                    </p>
                    <p className="font-cinzel text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {place.entryFees} EGP
                    </p>
                  </div>
                )}

                {/* Camera Fees */}
                {place.cameraFees && (
                  <div>
                    <p className="font-cinzel text-white/70 text-sm mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      Camera Fees
                    </p>
                    <p className="font-cinzel text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {place.cameraFees} EGP
                    </p>
                  </div>
                )}

                {/* Pet & Kids Friendly */}
                <div className="flex gap-4">
                  {place.petsFriendly && (
                    <div>
                      <p className="font-cinzel text-white/70 text-sm mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        Pets
                      </p>
                      <p className="font-cinzel text-green-400" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        ✓ Allowed
                      </p>
                    </div>
                  )}
                  {place.kidsFriendly && (
                    <div>
                      <p className="font-cinzel text-white/70 text-sm mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        Kids
                      </p>
                      <p className="font-cinzel text-green-400" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        ✓ Friendly
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-[#5d4e37] rounded-lg p-6">
              <h3 className="font-cinzel text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Working Hours
              </h3>
              <div className="space-y-2">
                {Object.entries(place.workingHours).map(([day, hours]: [string, any]) => (
                  <div key={day} className="flex justify-between">
                    <span className="font-cinzel text-white/70 capitalize" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {day}
                    </span>
                    {hours ? (
                      <span className="font-cinzel text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        {hours.open} - {hours.close}
                      </span>
                    ) : (
                      <span className="font-cinzel text-white/50" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        Closed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Best Time to Visit */}
            <div className="bg-[#5d4e37] rounded-lg p-6">
              <h3 className="font-cinzel text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Best Time to Visit
              </h3>
              <div className="space-y-3">
                {place.bestTimeToVisit.season && (
                  <div>
                    <p className="font-cinzel text-white/70 text-sm mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      Season
                    </p>
                    <p className="font-cinzel text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {place.bestTimeToVisit.season.join(", ")}
                    </p>
                  </div>
                )}
                {place.bestTimeToVisit.timeOfDay && (
                  <div>
                    <p className="font-cinzel text-white/70 text-sm mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      Time of Day
                    </p>
                    <p className="font-cinzel text-white" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                      {place.bestTimeToVisit.timeOfDay.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

