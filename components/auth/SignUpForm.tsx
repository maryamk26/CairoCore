"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

const inputClass = "w-full px-4 py-3 rounded-full border border-white/50 bg-white/20 backdrop-blur-sm text-[#3a3428] font-cinzel focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/70 transition-all";
const labelClass = "block text-sm font-cinzel font-medium text-[#5d4e37] mb-2";
const buttonClass = "w-full py-3 px-4 rounded-full bg-[#8b6f47]/80 backdrop-blur-sm text-white font-cinzel font-medium hover:bg-[#8b6f47] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
const errorClass = "p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-cinzel";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (signUpError) return setError(signUpError.message || "Something went wrong. Please try again.");
      if (data.user) {
        if (data.session) window.location.href = redirectTo;
        else setError("Please check your email to confirm your account.");
      } else setError("Something went wrong. Please try again.");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelClass}>First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={inputClass}
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={inputClass}
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
            placeholder="Create a password"
          />
          <p className="mt-2 text-xs text-[#8b6f47] font-cinzel">Must be at least 8 characters long</p>
        </div>

        {error && <div className={errorClass}>{error}</div>}

        <button type="submit" disabled={isLoading} className={buttonClass}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
