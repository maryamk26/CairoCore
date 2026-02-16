"use client";

import React from "react";

export type Suggestion = {
  id: string;
  title: string;
  subtitle: string;
  type: "place" | "person";
};

interface SearchSuggestionsProps {
  suggestions: Suggestion[];
  show: boolean;
  onSelect: (suggestion: Suggestion) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, show, onSelect }) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className={`absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden z-20 transition-all duration-300 ease-out ${
        show ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div style={{ maxHeight: '264px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#8b6f47 #e8ddd4' }}>
        {suggestions.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="w-full flex items-start gap-4 px-6 py-4 hover:bg-[#e8ddd4]/50 transition-colors text-left border-b border-[#d4c4b0]/30 last:border-b-0"
          >
            <div className="flex-shrink-0 mt-1">
              {s.type === "place" ? (
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
                {s.title}
              </p>
              <p className="font-cinzel text-[#8b6f47] text-sm md:text-base font-light" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                {s.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
