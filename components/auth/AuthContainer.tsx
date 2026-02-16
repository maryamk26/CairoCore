"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import AuthSwitch from "./AuthSwitch";

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

  useEffect(() => {
    if (pathname?.includes("/sign-up")) setIsSignIn(false);
    else if (pathname?.includes("/sign-in")) setIsSignIn(true);
  }, [pathname]);

  const handleSwitch = (type: "sign-in" | "sign-up") => {
    setIsSignIn(type === "sign-in");
  };

  const formWrapperClasses = (active: boolean, direction: "left" | "right") =>
    `col-start-1 row-start-1 transition-all duration-500 ease-in-out flex flex-col ${
      active
        ? "opacity-100 translate-x-0 z-10"
        : `opacity-0 translate-x-[${direction === "left" ? "-30px" : "30px"}] z-0 pointer-events-none`
    }`;

  const cardPadding = isSignIn ? "px-8 pt-8 pb-6" : "p-8";

  return (
    <div className="w-full max-w-2xl">
      <AuthSwitch isSignIn={isSignIn} onSwitch={handleSwitch} />

      <div
        className={`bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 mt-6 relative overflow-hidden min-h-[700px] ${cardPadding}`}
      >
        <div className="grid grid-cols-1">
          {/* Sign In */}
          <div className={formWrapperClasses(isSignIn, "left")}>
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-cinzel font-bold text-[#5d4e37] mb-2">
                Welcome back
              </h2>
              <p className="text-[#8b6f47] font-cinzel">
                Sign in to continue your adventure
              </p>
            </div>
            <SignInForm />
          </div>

          {/* Sign Up */}
          <div className={formWrapperClasses(!isSignIn, "right")}>
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-cinzel font-bold text-[#5d4e37] mb-2">
                Create account
              </h2>
              <p className="text-[#8b6f47] font-cinzel">
                Start exploring Cairo's amazing places
              </p>
            </div>
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
