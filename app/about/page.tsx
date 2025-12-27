"use client";

import { useState } from "react";
import Link from "next/link";

export default function AboutPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(/images/backgrounds/aboutbg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/80 via-[#8b6f47]/70 to-[#5d4e37]/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-2xl">
            {/* Pre-headline - Medium size */}
            <p className="text-white text-xl md:text-4xl font-cinzel mb-3" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              IT'S TIME TO
            </p>
            
            {/* Main Headline - Large but not overwhelming */}
            <h1 className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              VISIT CAIRO
            </h1>
            
            {/* Description - Body text size */}
            <p className="text-white text-sm md:text-xl leading-relaxed mb-8 font-cinzel max-w-xl" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Crave new adventures, mystical experiences and stunning places? You need to visit Cairo. We make sure that you'll get an experience you'll never forget.
            </p>
            
            {/* CTA Button */}
            <button
              onClick={() => setShowModal(true)}
              className="inline-block px-8 py-3 border-2 border-white/80 text-white font-cinzel font-medium rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              Explore More
            </button>
          </div>
        </div>
      </section>

      {/* Modal Widget */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          showModal ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-0 pointer-events-none'
        }`}
        onClick={() => setShowModal(false)}
      >
        <div 
          className={`bg-[#3d2f1f] backdrop-blur-md rounded-2xl shadow-xl border border-[#5d4e37]/50 p-8 md:p-12 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative transition-all duration-300 ${
            showModal ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <div className="mt-4">
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              What We Do
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-cinzel text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  Your Ultimate Cairo Guide
                </h3>
                <p className="text-white/90 leading-relaxed font-cinzel text-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  Think of us as your bestie who knows all the hidden gems in Cairo. We're a bunch of Cairo enthusiasts who got tired of missing out on the coolest spots in the city. From that insta-worthy cafe you've been searching for to ancient places that'll literally blow your mind.
                </p>
              </div>

              <div>
                <h3 className="font-cinzel text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  Making Cairo Exploration Effortless
                </h3>
                <p className="text-white/90 leading-relaxed font-cinzel text-lg mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  We're making Cairo exploration absolutely effortless and way more fun. We've got all the deets on places you need to check out - photos that'll make you want to book a trip right now, honest reviews from real people, and all the insider tips you won't find anywhere else.
                </p>
                <p className="text-white/90 leading-relaxed font-cinzel text-lg" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  Want to share that amazing spot you discovered? Go for it. Planning the perfect day out? We got you covered. Looking to connect with other explorers who are just as obsessed with Cairo as you are? You've come to the right place. Let's explore this city together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
