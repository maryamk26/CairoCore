"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import AuthSwitch from "@/components/auth/AuthSwitch";

interface AuthContainerProps {
  initialMode?: "sign-in" | "sign-up";
}

export default function AuthContainer({ initialMode }: AuthContainerProps) {
  const pathname = usePathname();
  const [isSignIn, setIsSignIn] = useState(() => {
    if (initialMode === "sign-up") return false;
    if (pathname?.includes("/sign-up")) return false;
    return true;
  });

  // Update state when pathname changes (for direct navigation)
  useEffect(() => {
    if (pathname?.includes("/sign-up")) {
      setIsSignIn(false);
    } else if (pathname?.includes("/sign-in")) {
      setIsSignIn(true);
    }
  }, [pathname]);

  const handleSwitch = (type: "sign-in" | "sign-up") => {
    setIsSignIn(type === "sign-in");
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Auth Switch */}
      <AuthSwitch isSignIn={isSignIn} onSwitch={handleSwitch} />

      {/* Auth Card with smooth transition */}
      <div className={`bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 mt-6 relative overflow-hidden min-h-[700px] ${
        isSignIn ? "px-8 pt-8 pb-6" : "p-8"
      }`}>
        <div className="grid grid-cols-1">
          {/* Sign In Form */}
          <div
            className={`col-start-1 row-start-1 transition-all duration-500 ease-in-out flex flex-col ${
              isSignIn
                ? "opacity-100 translate-x-0 z-10 justify-start"
                : "opacity-0 translate-x-[-30px] z-0 pointer-events-none"
            }`}
          >
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-cinzel font-bold text-[#5d4e37] mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Welcome back</h2>
              <p className="text-[#8b6f47] font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Sign in to continue your adventure</p>
            </div>
            <SignInForm />
          </div>

          {/* Sign Up Form */}
          <div
            className={`col-start-1 row-start-1 transition-all duration-500 ease-in-out ${
              !isSignIn
                ? "opacity-100 translate-x-0 z-10"
                : "opacity-0 translate-x-[30px] z-0 pointer-events-none"
            }`}
          >
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-cinzel font-bold text-[#5d4e37] mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Create account</h2>
              <p className="text-[#8b6f47] font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Start exploring Cairo's amazing places</p>
            </div>
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}

