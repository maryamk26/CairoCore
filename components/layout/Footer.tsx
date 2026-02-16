"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";

const linkContainerClass = "flex flex-col items-center hover:text-[#8b6f47] transition-colors";
const iconClass = "text-2xl";
const labelClass = "text-xs text-[#5d4e37] font-medium font-cinzel";

export default function Footer() {
  const { isSignedIn, isLoading, userId, user } = useAuth();
  const authenticated = !isLoading && (isSignedIn || !!userId);

  useEffect(() => {
    if (!isLoading) {
      console.log("Footer auth state:", { isSignedIn, userId, user: !!user });
    }
  }, [isLoading, isSignedIn, userId, user]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/40 border-t border-white/30 z-50 backdrop-blur-md">
      <nav className="flex justify-around items-center h-16 px-4">
        <Link href="/" className={linkContainerClass}>
          <span className={iconClass}>🏠</span>
          <span className={labelClass}>Home</span>
        </Link>
        <Link href="/search" className={linkContainerClass}>
          <span className={iconClass}>🔍</span>
          <span className={labelClass}>Search</span>
        </Link>
        {authenticated ? (
          <Link href="/planner" className={linkContainerClass}>
            <span className={iconClass}>🗺️</span>
            <span className={labelClass}>Planner</span>
          </Link>
        ) : (
          <Link href="/sign-up" className={linkContainerClass}>
            <span className={iconClass}>✨</span>
            <span className={labelClass}>Join Us</span>
          </Link>
        )}
        <Link href="/profile" className={linkContainerClass}>
          <span className={iconClass}>👤</span>
          <span className={labelClass}>Profile</span>
        </Link>
      </nav>
    </footer>
  );
}
