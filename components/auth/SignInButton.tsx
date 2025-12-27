"use client";

import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInButton() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return null;
  }

  return (
    <ClerkSignInButton mode="modal">
      <button className="px-4 py-2 bg-[#8b6f47]/80 backdrop-blur-sm text-white font-cinzel font-medium rounded-full hover:bg-[#8b6f47] transition-all" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
        Sign In
      </button>
    </ClerkSignInButton>
  );
}

