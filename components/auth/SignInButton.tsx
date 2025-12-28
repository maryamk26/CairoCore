"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

export default function SignInButton() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading || isSignedIn) {
    return null;
  }

  return (
    <Link href="/sign-in">
      <button className="px-4 py-2 bg-[#8b6f47]/80 backdrop-blur-sm text-white font-cinzel font-medium rounded-full hover:bg-[#8b6f47] transition-all" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
        Sign In
      </button>
    </Link>
  );
}
