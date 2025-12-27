import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-cinzel text-5xl md:text-6xl lg:text-7xl font-bold text-[#5d4e37] mb-6 tracking-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Discover Cairo's Hidden Gems
            </h1>
            <p className="text-xl md:text-2xl text-[#8b6f47] mb-10 font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Explore historical sites, museums, and unforgettable places in the heart of Egypt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/search"
                className="px-8 py-4 bg-[#8b6f47]/80 backdrop-blur-sm text-white font-cinzel font-medium rounded-full hover:bg-[#8b6f47] transition-all shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                Start Exploring
              </Link>
              <Link
                href="/planner"
                className="px-8 py-4 bg-white/40 backdrop-blur-md border-2 border-white/50 text-[#5d4e37] font-cinzel font-medium rounded-full hover:bg-[#5d4e37]/20 hover:border-[#5d4e37]/40 transition-all shadow-lg"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Places Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-[#5d4e37] mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Featured Places
          </h2>
          <p className="text-lg text-[#8b6f47] max-w-2xl mx-auto font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Discover the most popular and beloved destinations in Cairo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              id: 1,
              title: "The Great Pyramid of Giza",
              description: "One of the Seven Wonders of the Ancient World",
              image: "🏺",
              rating: 4.8,
              reviews: 1243,
              tags: ["Historical", "Ancient", "Iconic"],
            },
            {
              id: 2,
              title: "Khan el-Khalili Bazaar",
              description: "A vibrant medieval marketplace full of life",
              image: "🕌",
              rating: 4.6,
              reviews: 892,
              tags: ["Shopping", "Culture", "Traditional"],
            },
            {
              id: 3,
              title: "The Egyptian Museum",
              description: "Home to an extensive collection of ancient Egyptian artifacts",
              image: "🏛️",
              rating: 4.7,
              reviews: 1156,
              tags: ["Museum", "History", "Education"],
            },
            {
              id: 4,
              title: "Al-Azhar Park",
              description: "A beautiful green oasis in the heart of Cairo",
              image: "🌳",
              rating: 4.5,
              reviews: 756,
              tags: ["Nature", "Relaxation", "Family"],
            },
            {
              id: 5,
              title: "Coptic Cairo",
              description: "Historic Christian neighborhood with ancient churches",
              image: "⛪",
              rating: 4.6,
              reviews: 634,
              tags: ["Religious", "Historical", "Architecture"],
            },
            {
              id: 6,
              title: "Cairo Citadel",
              description: "Medieval Islamic fortification with stunning city views",
              image: "🏰",
              rating: 4.7,
              reviews: 987,
              tags: ["Historical", "Views", "Architecture"],
            },
          ].map((place) => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                {place.image}
              </div>
              <div className="p-6">
                <h3 className="font-cinzel text-xl font-semibold text-[#5d4e37] mb-2 group-hover:text-[#8b6f47] transition-colors" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  {place.title}
                </h3>
                <p className="text-[#5d4e37]/70 mb-4 text-sm line-clamp-2 font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  {place.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500">⭐</span>
                    <span className="ml-1 font-semibold text-[#5d4e37] font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>{place.rating}</span>
                  </div>
                  <span className="text-[#8b6f47]/70 text-sm font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>({place.reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/30 backdrop-blur-sm text-[#5d4e37] text-xs rounded-full font-cinzel border border-white/40"
                      style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/search"
            className="inline-block px-8 py-3 bg-[#8b6f47]/80 backdrop-blur-sm text-white font-cinzel font-medium rounded-full hover:bg-[#8b6f47] transition-all shadow-lg"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            View All Places
          </Link>
        </div>
      </section>

      {/* Recent Memories Feed Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-[#5d4e37] mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Recent Memories
          </h2>
          <p className="text-lg text-[#8b6f47] max-w-2xl mx-auto font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            See what others are discovering and sharing in Cairo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              id: 1,
              user: "Ahmed M.",
              place: "The Great Pyramid of Giza",
              image: "📸",
              rating: 5,
              comment: "Absolutely breathtaking! The history here is incredible. Make sure to visit early in the morning to avoid crowds.",
              pros: ["Iconic landmark", "Rich history", "Great photo ops"],
              timeAgo: "2 hours ago",
            },
            {
              id: 2,
              user: "Sarah K.",
              place: "Khan el-Khalili Bazaar",
              image: "🛍️",
              rating: 4,
              comment: "Love the vibrant atmosphere and authentic souvenirs. Bargaining is part of the experience!",
              pros: ["Authentic goods", "Great prices", "Cultural experience"],
              timeAgo: "5 hours ago",
            },
            {
              id: 3,
              user: "Mohamed H.",
              place: "Al-Azhar Park",
              image: "🌅",
              rating: 5,
              comment: "Perfect escape from the city bustle. Beautiful sunset views over Cairo. Family-friendly and peaceful.",
              pros: ["Beautiful views", "Family-friendly", "Peaceful"],
              timeAgo: "1 day ago",
            },
          ].map((memory) => (
            <div
              key={memory.id}
              className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-video bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center text-5xl">
                {memory.image}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-[#5d4e37] font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>{memory.user}</h4>
                    <p className="text-sm text-[#8b6f47]/70 font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>{memory.place}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < memory.rating ? "text-yellow-500" : "text-gray-300"}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-[#5d4e37]/80 text-sm mb-4 line-clamp-3 font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>{memory.comment}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {memory.pros.map((pro, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white/30 backdrop-blur-sm text-[#5d4e37] text-xs rounded-full font-cinzel border border-white/40"
                      style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                      ✓ {pro}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#8b6f47]/60 font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>{memory.timeAgo}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-8 md:p-12 text-center">
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-[#5d4e37] mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Ready to Explore Cairo?
          </h2>
          <p className="text-lg md:text-xl text-[#8b6f47] mb-8 max-w-2xl mx-auto font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Join thousands of explorers discovering the magic of Cairo. Share your memories and help others find their next adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="px-8 py-4 bg-[#8b6f47]/80 backdrop-blur-sm text-white font-cinzel font-medium rounded-full hover:bg-[#8b6f47] transition-all shadow-lg"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              Discover Places
            </Link>
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-white/40 backdrop-blur-md border-2 border-white/50 text-[#5d4e37] font-cinzel font-medium rounded-full hover:bg-[#5d4e37]/20 hover:border-[#5d4e37]/40 transition-all shadow-lg"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
