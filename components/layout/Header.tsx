"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import UserButton from "@/components/auth/UserButton";

export default function Header() {
  const pathname = usePathname();
  const { isSignedIn, isLoading, userId } = useAuth();
  const authenticated = !isLoading && (isSignedIn || !!userId);

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
    return null;
  }

  const textNavLinks = [
    { href: "/", label: "Home" },
    ...(authenticated ? [{ href: "/planner", label: "Planner" }] : [{ href: "/sign-up", label: "Join Us" }]),
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

          <nav className="flex items-center gap-8">
            {textNavLinks.map((link) => {
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

          <div className="flex items-center gap-4">
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

            {!authenticated && (
              <Link
                href="/sign-in"
                className={`p-1 transition-colors ${
                  isLightHeader
                    ? 'text-white hover:text-white/80'
                    : 'text-[#5d4e37] hover:text-[#8b6f47]'
                }`}
                aria-label="Sign In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {authenticated && <UserButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
