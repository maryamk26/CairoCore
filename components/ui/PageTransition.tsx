"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"idle" | "fadeOut" | "fadeIn">("idle");
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Only animate if pathname actually changed
    if (prevPathnameRef.current !== pathname) {
      // Start fade out
      setTransitionStage("fadeOut");
      
      // After fade out, update content and fade in
      const fadeOutTimer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("fadeIn");
        
        // Complete transition
        const fadeInTimer = setTimeout(() => {
          setTransitionStage("idle");
        }, 300);
        
        return () => clearTimeout(fadeInTimer);
      }, 300);

      prevPathnameRef.current = pathname;
      return () => clearTimeout(fadeOutTimer);
    } else {
      // Initial load or same pathname - no animation needed
      setDisplayChildren(children);
      setTransitionStage("idle");
    }
  }, [pathname, children]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        transitionStage === "fadeOut"
          ? "opacity-0 translate-y-4"
          : transitionStage === "fadeIn"
          ? "opacity-100 translate-y-0"
          : "opacity-100 translate-y-0"
      }`}
      style={{
        willChange: transitionStage !== "idle" ? "opacity, transform" : "auto",
      }}
    >
      {displayChildren}
    </div>
  );
}
