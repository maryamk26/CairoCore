"use client";

import React from "react";

interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ inputRef, value, onChange, placeholder }) => {
  return (
    <div className="relative bg-white/95 backdrop-blur-sm rounded-full shadow-xl border border-white/30 overflow-hidden">
      <div className="flex items-center px-6 py-4 md:py-5">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
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
  );
};

export default SearchBar;
