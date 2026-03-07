"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCategoryIcon } from "@/components/icons/categoryIcons";

type SearchType = "places" | "people";

type Suggestion = {
  id: string;
  title: string;
  subtitle: string;
  type: "place" | "person";
  category?: string;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("places");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [places, setPlaces] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/places")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setPlaces(data.places ?? []);
      })
      .catch(() => {
        if (!cancelled) setPlaces([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const people: Suggestion[] = [];

  const allSuggestions = searchType === "places" ? places : people;
  const filteredSuggestions =
    searchQuery.trim() === ""
      ? allSuggestions
      : allSuggestions.filter(
          (s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        );

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    if (suggestion.type === "place") {
      router.push(`/places/${suggestion.id}`);
    }
  };

  const handleSearchTypeChange = (type: SearchType) => {
    setSearchType(type);
    setSearchQuery("");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/searchbg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#5d4e37",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#5d4e37]/40 via-[#8b6f47]/30 to-[#5d4e37]/40" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8 px-4">
            <p
              className="font-cinzel text-white text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-relaxed"
            >
              Find Places & Connect with People
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative inline-flex bg-white/80 backdrop-blur-sm rounded-full p-1 border border-white/30 shadow-md">
              <div
                className="absolute top-1 bottom-1 rounded-full bg-[#5d4e37] transition-transform duration-300 ease-in-out"
                style={{
                  left: "4px",
                  width: "calc(50% - 8px)",
                  transform:
                    searchType === "places"
                      ? "translateX(0)"
                      : "translateX(100%)",
                }}
              />
              <button
                onClick={() => handleSearchTypeChange("places")}
                className={`relative z-10 px-6 py-2 rounded-full font-cinzel text-sm md:text-base transition-colors duration-300 ${
                  searchType === "places"
                    ? "text-white"
                    : "text-[#5d4e37] hover:text-[#8b6f47]"
                }`}
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
              >
                People
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-white/30 overflow-hidden">
              <div className="flex items-center px-6 py-4 md:py-5">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={
                    searchType === "places"
                      ? "Search places in Cairo..."
                      : "Search people..."
                  }
                  className="flex-1 bg-transparent outline-none text-[#3a3428] placeholder:text-[#8b6f47]/60 font-cinzel text-base md:text-lg"
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

            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden z-20"
              >
                <div
                  className="overflow-y-auto"
                  style={{
                    maxHeight: "264px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#8b6f47 #e8ddd4",
                  }}
                >
                  {loading && searchType === "places" ? (
                    <div className="px-6 py-4 text-[#8b6f47] font-cinzel text-center">
                      Loading...
                    </div>
                  ) : filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((suggestion) => {
                      const PlaceIcon =
                        suggestion.type === "place"
                          ? getCategoryIcon(suggestion.category ?? "other")
                          : null;
                      return (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-start gap-4 px-6 py-4 hover:bg-[#e8ddd4]/50 transition-colors text-left border-b border-[#d4c4b0]/30 last:border-b-0"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {suggestion.type === "place" && PlaceIcon ? (
                              <PlaceIcon
                                size={20}
                                className="text-[#8b6f47]"
                              />
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
                            <p
                              className="font-cinzel text-[#3a3428] font-medium text-base md:text-lg mb-1"
                            >
                              {suggestion.title}
                            </p>
                            <p
                              className="font-cinzel text-[#8b6f47] text-sm md:text-base font-light"
                            >
                              {suggestion.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-6 py-4 text-center">
                      <p
                        className="font-cinzel text-[#8b6f47]"
                      >
                        {searchQuery.trim()
                          ? `No ${searchType === "places" ? "places" : "people"} found for "${searchQuery}"`
                          : searchType === "people"
                            ? "People search coming soon."
                            : "No places in database yet."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {searchQuery.trim() !== "" &&
              filteredSuggestions.length === 0 &&
              !loading && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 z-20"
                >
                  <p
                    className="font-cinzel text-[#8b6f47] text-center"
                  >
                    No {searchType === "places" ? "places" : "people"} found
                    matching "{searchQuery}"
                  </p>
                </div>
              )}
          </div>

          <div
            className={`mt-8 text-center transition-opacity duration-300 ${
              showSuggestions || searchType === "people"
                ? "opacity-0 invisible pointer-events-none"
                : "opacity-100 visible pointer-events-auto"
            }`}
          >
            <p
              className="font-cinzel text-white text-base md:text-lg lg:text-xl mb-4 font-semibold"
            >
              Popular searches:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {["Pyramids", "Museums", "Mosques", "Markets", "Cafes"].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      setShowSuggestions(true);
                      searchInputRef.current?.focus();
                    }}
                    className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-[#5d4e37] font-cinzel text-sm hover:bg-white hover:shadow-md transition-all border border-white/30"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
