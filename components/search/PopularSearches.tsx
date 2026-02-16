"use client";

import React from "react";

interface PopularSearchesProps {
  tags: string[];
  onSelect: (tag: string) => void;
  hidden?: boolean;
}

const PopularSearches: React.FC<PopularSearchesProps> = ({ tags, onSelect, hidden }) => {
  return (
    <div className={`mt-8 text-center transition-opacity duration-300 ${hidden ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible pointer-events-auto'}`}>
      <p className="font-cinzel text-white text-base md:text-lg lg:text-xl mb-4 font-semibold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
        Popular searches:
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-[#5d4e37] font-cinzel text-sm hover:bg-white hover:shadow-md transition-all border border-white/30"
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearches;
