type HeroSectionProps = {
    onExplore: () => void;
  };
  
  export default function HeroSection({ onExplore }: HeroSectionProps) {
    return (
      <section
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: "url(/images/backgrounds/aboutbg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/80 via-[#8b6f47]/70 to-[#5d4e37]/80" />
  
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-2xl">
            <p className="text-white text-xl md:text-4xl font-cinzel mb-3">
              IT'S TIME TO
            </p>
  
            <h1 className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              VISIT CAIRO
            </h1>
  
            <p className="text-white text-sm md:text-xl leading-relaxed mb-8 max-w-xl">
              Crave new adventures, mystical experiences and stunning places?
              You need to visit Cairo. We make sure that you'll get an experience
              you'll never forget.
            </p>
  
            <button
              onClick={onExplore}
              className="px-8 py-3 border-2 border-white/80 text-white font-medium rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
            >
              Explore More
            </button>
          </div>
        </div>
      </section>
    );
  }
  