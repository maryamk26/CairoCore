"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <nav className="flex justify-around items-center h-16 px-4">
        <Link href="/" className="flex flex-col items-center">
          <span className="text-2xl">🏠</span>
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center">
          <span className="text-2xl">🔍</span>
          <span className="text-xs">Search</span>
        </Link>
        <Link href="/planner" className="flex flex-col items-center">
          <span className="text-2xl">🗺️</span>
          <span className="text-xs">Plan</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center">
          <span className="text-2xl">👤</span>
          <span className="text-xs">Profile</span>
        </Link>
      </nav>
    </footer>
  );
}

