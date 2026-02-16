"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import UserButton from "@/components/auth/UserButton";

const linkBaseClass = "font-cinzel text-base md:text-lg font-normal transition-colors hover:underline";
const iconLinkClass = "p-1 transition-colors";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn, isLoading, userId, user } = useAuth();
  const authenticated = !isLoading && (isSignedIn || !!userId);

  useEffect(() => {
    if (!isLoading) {
      console.log("\n=== HEADER AUTH STATE ===", { isSignedIn, userId, user });
    }
  }, [isLoading, isSignedIn, userId, user, authenticated]);

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) return null;

  const textNavLinks = [
    { href: "/", label: "Home" },
    ...(authenticated ? [{ href: "/planner", label: "Planner" }] : [{ href: "/sign-up", label: "Join Us" }]),
    { href: "/about", label: "About" },
  ];

  const isLightHeader = ["/", "/search", "/about", "/planner"].includes(pathname);

  const linkColorClass = isLightHeader ? "text-white hover:text-white/80" : "text-[#5d4e37] hover:text-[#8b6f47]";

  return (
    <header className={`w-full pt-8 pb-4 absolute top-0 left-0 right-0 z-50 ${isLightHeader ? 'bg-transparent backdrop-blur-0' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className={`font-cinzel text-3xl md:text-4xl font-bold transition-colors ${linkColorClass}`}>
          CairoCore
        </Link>

        <nav className="flex items-center gap-8">
          {textNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={link.href === "/about" ? handleAboutClick : undefined}
              className={`${linkBaseClass} ${linkColorClass}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/search" className={`${iconLinkClass} ${linkColorClass}`} aria-label="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {!authenticated && (
            <Link href="/sign-in" className={`${iconLinkClass} ${linkColorClass}`} aria-label="Sign In">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}

          {authenticated && <UserButton />}
        </div>
      </div>
    </header>
  );
}
