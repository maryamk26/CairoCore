"use client";

import Link from "next/link";
import { useState } from "react";

// Data for Popular Places
const popularPlaces = [
  { id: 1, title: "Pyramids and Sphinx", subtitle: "Ancient wonders of the world", image: "/images/places/pyramids.jpeg" },
  { id: 2, title: "Grand Museum", subtitle: "Treasures of ancient Egypt", image: "/images/places/grandm.jpeg" },
  { id: 3, title: "Khan el-Khalili", subtitle: "Historic bazaar and souk", image: "/images/places/khan.jpeg" },
  { id: 4, title: "Cairo Tower", subtitle: "Iconic landmark of Cairo", image: "/images/places/cairotower.jpeg" },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <HeroSection />

      {/* Popular Places */}
      <PopularPlacesSection places={popularPlaces} />

      {/* About / CTA Section */}
      <AboutSection showModal={showModal} setShowModal={setShowModal} />

      {/* Modal */}
      <ExploreModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

/* ---------------------- Components ---------------------- */

function HeroSection() {
  return (
    <section 
      className="relative min-h-screen flex items-center"
      style={{
        backgroundImage: 'url(/images/backgrounds/home1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 container mx-auto px-4 py-24 max-w-2xl">
        <p className="text-white text-xl md:text-4xl font-cinzel mb-3">IT'S TIME TO</p>
        <h1 className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          VISIT CAIRO
        </h1>
        <p className="text-white text-sm md:text-xl leading-relaxed mb-8 max-w-xl">
          Crave new adventures, mystical experiences and stunning places? You need to visit Cairo. We make sure that you'll get an experience you'll never forget.
        </p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#3a3428]/50 to-[#3a3428] pointer-events-none"></div>
    </section>
  );
}

interface Place {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

function PopularPlacesSection({ places }: { places: Place[] }) {
  return (
    <section className="bg-[#3a3428] py-16 md:py-24 relative">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#3a3428] via-[#3a3428]/50 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="font-cinzel text-white/80 text-lg mb-2">and get unforgettable emotions</p>
          <h2 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-bold text-white">POPULAR PLACES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map(place => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group overflow-hidden rounded-lg bg-[#5d4e37] hover:bg-[#8b6f47] transition-all duration-300"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={place.image}
                  alt={place.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-cinzel text-white text-xl font-bold mb-1">{place.title}</h3>
                  <p className="font-cinzel text-white/90 text-sm">{place.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#3a3428]/50 to-[#3a3428] pointer-events-none"></div>
    </section>
  );
}

function AboutSection({ showModal, setShowModal }: { showModal: boolean; setShowModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <section 
      id="about"
      className="relative min-h-[600px] flex items-center scroll-mt-20"
      style={{
        backgroundImage: 'url(/images/backgrounds/aboutbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#3a3428] via-[#3a3428]/50 to-transparent z-10 pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-2xl">
        <p className="text-white text-xl md:text-4xl font-cinzel mb-3">IT'S TIME TO</p>
        <h2 className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">VISIT CAIRO</h2>

        <button
          onClick={() => setShowModal(true)}
          className="inline-block px-8 py-3 border-2 border-white/80 text-white font-cinzel font-medium rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm mb-6"
        >
          Explore More
        </button>

        <p className="font-cinzel text-white/80 text-sm md:text-xl leading-relaxed max-w-xl">
          Crave new adventures, mystical experiences and stunning places? You need to visit Cairo. We make sure that you'll get an experience you'll never forget.
        </p>
      </div>
    </section>
  );
}

function ExploreModal({ showModal, setShowModal }: { showModal: boolean; setShowModal: React.Dispatch<React.SetStateAction<boolean>> }) {
  if (!showModal) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    >
      <div 
        className="bg-[#3d2f1f] backdrop-blur-md rounded-2xl shadow-xl border border-[#5d4e37]/50 p-8 md:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transition-all duration-300"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 text-white/80 hover:text-white"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mt-4 space-y-6">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-6">What We Do</h2>
          <div>
            <h3 className="font-cinzel text-xl font-semibold text-white mb-3">Your Ultimate Cairo Guide</h3>
            <p className="text-white/90 leading-relaxed font-cinzel text-lg">
              Think of us as your bestie who knows all the hidden gems in Cairo. We're a bunch of Cairo enthusiasts who got tired of missing out on the coolest spots in the city. From that insta-worthy cafe you've been searching for to ancient places that'll literally blow your mind.
            </p>
          </div>
          <div>
            <h3 className="font-cinzel text-xl font-semibold text-white mb-3">Making Cairo Exploration Effortless</h3>
            <p className="text-white/90 leading-relaxed font-cinzel text-lg mb-4">
              We're making Cairo exploration absolutely effortless and way more fun. We've got all the deets on places you need to check out - photos that'll make you want to book a trip right now, honest reviews from real people, and all the insider tips you won't find anywhere else.
            </p>
            <p className="text-white/90 leading-relaxed font-cinzel text-lg">
              Want to share that amazing spot you discovered? Go for it. Planning the perfect day out? We got you covered. Looking to connect with other explorers who are just as obsessed with Cairo as you are? You've come to the right place. Let's explore this city together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
