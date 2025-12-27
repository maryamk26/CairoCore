"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type SearchType = "places" | "people";

// Mock data for search suggestions - replace with actual API calls
const mockPlaces = [
  {
    id: "1",
    title: "Pyramids of Giza, Cairo, Egypt",
    subtitle: "One of the Seven Wonders of the Ancient World",
    type: "place",
  },
  {
    id: "2",
    title: "Khan el-Khalili, Cairo, Egypt",
    subtitle: "Historic bazaar and souq in the Islamic Cairo district",
    type: "place",
  },
  {
    id: "3",
    title: "The Egyptian Museum, Cairo, Egypt",
    subtitle: "Home to the world's largest collection of Pharaonic antiquities",
    type: "place",
  },
  {
    id: "4",
    title: "Al-Azhar Mosque, Cairo, Egypt",
    subtitle: "One of the oldest mosques in Cairo, dating back to 970 AD",
    type: "place",
  },
  {
    id: "5",
    title: "Cairo Citadel, Cairo, Egypt",
    subtitle: "Medieval Islamic fortification with stunning city views",
    type: "place",
  },
];

const mockPeople = [
  {
    id: "p1",
    title: "Ahmed Hassan",
    subtitle: "Cairo explorer • 45 memories shared",
    type: "person",
  },
  {
    id: "p2",
    title: "Sara Mohamed",
    subtitle: "Photography enthusiast • 32 memories shared",
    type: "person",
  },
  {
    id: "p3",
    title: "Omar Ali",
    subtitle: "History lover • 67 memories shared",
    type: "person",
  },
  {
    id: "p4",
    title: "Fatima Ibrahim",
    subtitle: "Local guide • 89 memories shared",
    type: "person",
  },
  {
    id: "p5",
    title: "Youssef Nasser",
    subtitle: "Adventure seeker • 23 memories shared",
    type: "person",
  },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("places");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(mockPlaces);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Get current suggestions based on search type
  const getCurrentSuggestions = () => {
    return searchType === "places" ? mockPlaces : mockPeople;
  };

  // Filter suggestions based on search query and type
  useEffect(() => {
    const currentSuggestions = getCurrentSuggestions();
    if (searchQuery.trim() === "") {
      setFilteredSuggestions(currentSuggestions);
    } else {
      const filtered = currentSuggestions.filter(
        (suggestion) =>
          suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          suggestion.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [searchQuery, searchType]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: typeof mockPlaces[0] | typeof mockPeople[0]) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    // TODO: Navigate to place/user page or perform search
  };

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    setSearchQuery("");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/searchbg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#5d4e37' // Fallback color
          }}
        />
        {/* Overlay for readability - lighter overlay to show the image */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/40 via-[#8b6f47]/30 to-[#5d4e37]/40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="w-full max-w-3xl">
          {/* Inspirational Quote */}
          <div className="text-center mb-8 px-4">
            <p className="font-cinzel text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-relaxed" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Find Places & Connect with People
            </p>
          </div>

          {/* Search Type Selector */}
          <div className="flex justify-center mb-6">
            <div className="relative inline-flex bg-white/80 backdrop-blur-sm rounded-full p-1 border border-white/30 shadow-md">
              {/* Animated Background Slider */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-[#5d4e37] transition-transform duration-300 ease-in-out"
                style={{ 
                  left: '4px',
                  width: 'calc(50% - 8px)',
                  transform: searchType === "places" ? 'translateX(0)' : 'translateX(100%)'
                }}
              />
              <button
                onClick={() => handleSearchTypeChange("places")}
                className={`relative z-10 px-6 py-2 rounded-full font-cinzel text-sm md:text-base transition-colors duration-300 ${
                  searchType === "places"
                    ? "text-white"
                    : "text-[#5d4e37] hover:text-[#8b6f47]"
                }`}
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                Places
              </button>
              <button
                onClick={() => handleSearchTypeChange("people")}
                className={`relative z-10 px-6 py-2 rounded-full font-cinzel text-sm md:text-base transition-colors duration-300 ${
                  searchType === "people"
                    ? "text-white"
                    : "text-[#5d4e37] hover:text-[#8b6f47]"
                }`}
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                People
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-white/30 overflow-hidden">
              <div className="flex items-center px-6 py-4 md:py-5">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={searchType === "places" ? "Search places in Cairo..." : "Search people..."}
                  className="flex-1 bg-transparent outline-none text-[#3a3428] placeholder:text-[#8b6f47]/60 font-cinzel text-base md:text-lg"
                  style={{ fontFamily: 'var(--font-cinzel), serif' }}
                />
                <button
                  type="button"
                  className="ml-4 p-2 text-[#5d4e37] hover:text-[#8b6f47] transition-colors"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Suggestions Dropdown */}
            {filteredSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className={`absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden z-20 transition-all duration-300 ease-out ${
                  showSuggestions ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div 
                  className="overflow-y-auto"
                  style={{ 
                    maxHeight: '264px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#8b6f47 #e8ddd4'
                  }}
                >
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-start gap-4 px-6 py-4 hover:bg-[#e8ddd4]/50 transition-colors text-left border-b border-[#d4c4b0]/30 last:border-b-0"
                    >
                    {/* Icon - Location Pin for Places, User Icon for People */}
                    <div className="flex-shrink-0 mt-1">
                      {suggestion.type === "place" ? (
                        <svg
                          className="w-5 h-5 text-[#8b6f47]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-[#8b6f47]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cinzel text-[#3a3428] font-medium text-base md:text-lg mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        {suggestion.title}
                      </p>
                      <p className="font-cinzel text-[#8b6f47] text-sm md:text-base font-light" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        {suggestion.subtitle}
                      </p>
                    </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {searchQuery.trim() !== "" && filteredSuggestions.length === 0 && (
              <div
                ref={suggestionsRef}
                className={`absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 z-20 transition-all duration-300 ease-out ${
                  showSuggestions ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <p className="font-cinzel text-[#8b6f47] text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  No {searchType === "places" ? "places" : "people"} found matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>

          {/* Popular Searches - Always rendered to maintain consistent layout */}
          <div className={`mt-8 text-center transition-opacity duration-300 ${
            (showSuggestions || searchType === "people") ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible pointer-events-auto'
          }`}>
            <p className="font-cinzel text-white text-base md:text-lg lg:text-xl mb-4 font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              Popular searches:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Pyramids", "Museums", "Mosques", "Markets", "Cafes"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    setShowSuggestions(true);
                    searchInputRef.current?.focus();
                  }}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-[#5d4e37] font-cinzel text-sm hover:bg-white hover:shadow-md transition-all border border-white/30"
                  style={{ fontFamily: 'var(--font-cinzel), serif' }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
