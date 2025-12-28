"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Footer() {
  const { isSignedIn, isLoading, userId, user } = useAuth();
  
  // Use userId as the most reliable indicator
  const authenticated = !isLoading && (isSignedIn || !!userId);
  
  // Debug: log auth state (remove in production)
  useEffect(() => {
    if (!isLoading) {
      console.log("Footer auth state:", { isSignedIn, userId, user: !!user });
    }
  }, [isLoading, isSignedIn, userId, user]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/40 border-t border-white/30 z-50 backdrop-blur-md">
      <nav className="flex justify-around items-center h-16 px-4">
        <Link href="/" className="flex flex-col items-center hover:text-[#8b6f47] transition-colors">
          <span className="text-2xl">🏠</span>
          <span className="text-xs text-[#5d4e37] font-medium font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Home</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center hover:text-[#8b6f47] transition-colors">
          <span className="text-2xl">🔍</span>
          <span className="text-xs text-[#5d4e37] font-medium font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Search</span>
        </Link>
        {authenticated ? (
          <Link href="/planner" className="flex flex-col items-center hover:text-[#8b6f47] transition-colors">
            <span className="text-2xl">🗺️</span>
            <span className="text-xs text-[#5d4e37] font-medium font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Planner</span>
          </Link>
        ) : (
          <Link href="/sign-up" className="flex flex-col items-center hover:text-[#8b6f47] transition-colors">
            <span className="text-2xl">✨</span>
            <span className="text-xs text-[#5d4e37] font-medium font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Join Us</span>
          </Link>
        )}
        <Link href="/profile" className="flex flex-col items-center hover:text-[#8b6f47] transition-colors">
          <span className="text-2xl">👤</span>
          <span className="text-xs text-[#5d4e37] font-medium font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Profile</span>
        </Link>
      </nav>
    </footer>
  );
}
