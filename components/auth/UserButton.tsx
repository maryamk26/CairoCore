"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

const userMenuClass = "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200";
const userNameClass = "text-sm font-medium text-gray-900 font-cinzel";
const userEmailClass = "text-xs text-gray-500 truncate font-cinzel";
const menuItemClass = "block px-4 py-2 text-sm font-cinzel hover:bg-gray-100";

export default function UserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    setIsOpen(false);
  };

  const userInitials = user?.user_metadata?.first_name?.[0]?.toUpperCase() ||
                       user?.email?.[0]?.toUpperCase() || "U";
  const userName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8b6f47] text-white hover:bg-[#5d4e37] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:ring-offset-2"
        aria-label="User menu"
      >
        {userInitials}
      </button>

      {isOpen && (
        <div className={userMenuClass}>
          <div className="px-4 py-2 border-b border-gray-200">
            <p className={userNameClass}>{userName}</p>
            <p className={userEmailClass}>{user?.email}</p>
          </div>
          <Link href="/profile" className={menuItemClass} onClick={() => setIsOpen(false)}>Profile</Link>
          <button onClick={handleSignOut} className={menuItemClass + " text-red-600"}>Sign Out</button>
        </div>
      )}
    </div>
  );
}
