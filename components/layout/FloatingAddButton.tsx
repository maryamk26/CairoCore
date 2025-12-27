"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingAddButton() {
  const pathname = usePathname();

  // Don't show button on sign-in, sign-up, about, or search pages
  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up") || pathname === "/about" || pathname === "/search") {
    return null;
  }

  return (
    <Link
      href="/places/new"
      className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#8b6f47] hover:bg-[#5d4e37] text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
      aria-label="Add new place"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
    </Link>
  );
}

