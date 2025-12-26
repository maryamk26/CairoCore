"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          CairoCore
        </Link>
        <nav className="flex items-center gap-4">
          {/* Navigation items will be added later */}
        </nav>
      </div>
    </header>
  );
}

