"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import UserButton from "@/components/auth/UserButton";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    // If not on home page, let the default Link behavior handle navigation
  };

  // Don't show header on sign-in or sign-up pages
  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
    return null;
  }

  const textNavLinks = [
    { href: "/", label: "Home" },
    ...(isSignedIn ? [{ href: "/planner", label: "Planner" }] : [{ href: "/sign-up", label: "Join Us" }]),
    { href: "/about", label: "About" },
  ];

  const isSearchPage = pathname === "/search";
  const isAboutPage = pathname === "/about";
  const isHomePage = pathname === "/";
  const isLightHeader = isSearchPage || isAboutPage || isHomePage;

  return (
    <header 
      className={`w-full pt-8 pb-4 absolute top-0 left-0 right-0 z-50 ${isLightHeader ? 'bg-transparent backdrop-blur-0' : 'bg-transparent'}`} 
      style={isLightHeader ? { backgroundColor: 'transparent', background: 'none' } : {}}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className={`font-cinzel text-3xl md:text-4xl font-bold transition-colors ${
              isLightHeader 
                ? 'text-white hover:text-white/80' 
                : 'text-[#5d4e37] hover:text-[#8b6f47]'
            }`}
            style={{ fontFamily: 'var(--font-cinzel), serif' }}
          >
            CairoCore
          </Link>

          {/* Navigation Links - Text */}
          <nav className="flex items-center gap-8">
            {textNavLinks.map((link) => {
              // Special handling for About link on home page
              if (link.href === "/about") {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleAboutClick}
                    className={`font-cinzel text-base md:text-lg font-normal transition-colors hover:underline ${
                      isLightHeader
                        ? 'text-white hover:text-white/80'
                        : 'text-[#5d4e37] hover:text-[#8b6f47]'
                    }`}
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                  >
                    {link.label}
                  </Link>
                );
              }
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-cinzel text-base md:text-lg font-normal transition-colors hover:underline ${
                    isLightHeader
                      ? 'text-white hover:text-white/80'
                      : 'text-[#5d4e37] hover:text-[#8b6f47]'
                  }`}
                  style={{ fontFamily: 'var(--font-cinzel), serif' }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Actions - Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <Link
              href="/search"
              className={`p-1 transition-colors ${
                isLightHeader
                  ? 'text-white hover:text-white/80'
                  : 'text-[#5d4e37] hover:text-[#8b6f47]'
              }`}
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Profile Icon - Redirects to profile if signed in, sign-in if not */}
            <Link
              href={isSignedIn ? "/profile" : "/sign-in"}
              className={`p-1 transition-colors ${
                isLightHeader
                  ? 'text-white hover:text-white/80'
                  : 'text-[#5d4e37] hover:text-[#8b6f47]'
              }`}
              aria-label="Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            {/* UserButton - Only shows when signed in */}
            {isSignedIn && <UserButton />}
          </div>
        </div>
      </div>
    </header>
  );
}

