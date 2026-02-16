"use client";

import React, { useState, useEffect, useRef } from "react";
import SearchBar from "../../components/search/SearchBar";
import SearchSuggestions, { Suggestion } from "../../components/search/SearchSuggestions";
import PopularSearches from "../../components/search/PopularSearches";

type SearchType = "places" | "people";

const mockPlaces: Suggestion[] = [
  { id: "1", title: "Pyramids of Giza, Cairo, Egypt", subtitle: "One of the Seven Wonders of the Ancient World", type: "place" },
  { id: "2", title: "Khan el-Khalili, Cairo, Egypt", subtitle: "Historic bazaar and souq in the Islamic Cairo district", type: "place" },
  { id: "3", title: "The Egyptian Museum, Cairo, Egypt", subtitle: "Home to the world's largest collection of Pharaonic antiquities", type: "place" },
  { id: "4", title: "Al-Azhar Mosque, Cairo, Egypt", subtitle: "One of the oldest mosques in Cairo, dating back to 970 AD", type: "place" },
  { id: "5", title: "Cairo Citadel, Cairo, Egypt", subtitle: "Medieval Islamic fortification with stunning city views", type: "place" },
];

const mockPeople: Suggestion[] = [
  { id: "p1", title: "Ahmed Hassan", subtitle: "Cairo explorer • 45 memories shared", type: "person" },
  { id: "p2", title: "Sara Mohamed", subtitle: "Photography enthusiast • 32 memories shared", type: "person" },
  { id: "p3", title: "Omar Ali", subtitle: "History lover • 67 memories shared", type: "person" },
  { id: "p4", title: "Fatima Ibrahim", subtitle: "Local guide • 89 memories shared", type: "person" },
  { id: "p5", title: "Youssef Nasser", subtitle: "Adventure seeker • 23 memories shared", type: "person" },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("places");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(mockPlaces);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);

  // Update suggestions based on search query and type
  useEffect(() => {
    const currentSuggestions = searchType === "places" ? mockPlaces : mockPeople;
    if (!searchQuery.trim()) {
      setFilteredSuggestions(currentSuggestions);
    } else {
      setFilteredSuggestions(
        currentSuggestions.filter(
          s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, searchType]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current && !searchInputRef.current.contains(event.target as Node)
      ) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    setSearchQuery("");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
  };

  const handlePopularSelect = (tag: string) => {
    setSearchQuery(tag);
    setShowSuggestions(true);
    searchInputRef.current?.focus();
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/backgrounds/searchbg.jpg')", backgroundColor: '#5d4e37' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/40 via-[#8b6f47]/30 to-[#5d4e37]/40"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-24 w-full max-w-3xl mx-auto">
        <div className="text-center mb-8 px-4">
          <p className="font-cinzel text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-relaxed" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Find Places & Connect with People
          </p>
        </div>

        {/* Search Type Selector */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative inline-flex bg-white/80 backdrop-blur-sm rounded-full p-1 border border-white/30 shadow-md">
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
                searchType === "places" ? "text-white" : "text-[#5d4e37] hover:text-[#8b6f47]"
              }`}
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              Places
            </button>
            <button
              onClick={() => handleSearchTypeChange("people")}
              className={`relative z-10 px-6 py-2 rounded-full font-cinzel text-sm md:text-base transition-colors duration-300 ${
                searchType === "people" ? "text-white" : "text-[#5d4e37] hover:text-[#8b6f47]"
              }`}
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              People
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <SearchBar
            inputRef={searchInputRef}
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            placeholder={searchType === "places" ? "Search places in Cairo..." : "Search people..."}
          />

          <SearchSuggestions
            suggestions={filteredSuggestions}
            show={showSuggestions}
            onSelect={handleSuggestionSelect}
          />

          {searchQuery.trim() && filteredSuggestions.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 z-20 transition-all duration-300 ease-out">
              <p className="font-cinzel text-[#8b6f47] text-center" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                No {searchType === "places" ? "places" : "people"} found matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        <PopularSearches
          tags={["Pyramids", "Museums", "Mosques", "Markets", "Cafes"]}
          onSelect={handlePopularSelect}
          hidden={showSuggestions || searchType === "people"}
        />
      </div>
    </div>
  );
}
