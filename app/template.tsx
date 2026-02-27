"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 250);
    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div
      className={`min-h-full transition-all duration-300 ease-in-out ${
        isTransitioning
          ? "opacity-0 translate-y-3"
          : "opacity-100 translate-y-0"
      }`}
      style={{
        willChange: isTransitioning ? "opacity, transform" : "auto",
      }}
    >
      {displayChildren}
    </div>
  );
}

