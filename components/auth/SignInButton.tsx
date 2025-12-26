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
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Sign In
      </button>
    </ClerkSignInButton>
  );
}

