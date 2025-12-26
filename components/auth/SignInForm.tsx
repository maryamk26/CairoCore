"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (strategy: "oauth_google" | "oauth_apple" | "oauth_github" | "oauth_facebook") => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to sign in with social provider");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
        <label htmlFor="email" className="block text-sm font-cinzel font-medium text-[#5d4e37] mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-full border border-white/50 bg-white/20 backdrop-blur-sm text-[#3a3428] font-cinzel focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/70 transition-all"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-cinzel font-medium text-[#5d4e37] mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-full border border-white/50 bg-white/20 backdrop-blur-sm text-[#3a3428] font-cinzel focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/70 transition-all"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
          placeholder="Enter your password"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-[#5d4e37] font-cinzel cursor-pointer" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          <input type="checkbox" className="w-4 h-4 rounded border-white/50 bg-white/20 text-[#8b6f47] focus:ring-2 focus:ring-white/50" />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-sm text-[#8b6f47] hover:text-[#5d4e37] font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Forgot password?
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded-full bg-red-50/50 border border-red-200/50 text-red-700 text-sm font-cinzel backdrop-blur-sm" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !isLoaded}
        className="w-full py-3 px-4 rounded-full bg-[#8b6f47]/80 backdrop-blur-sm text-white font-cinzel font-medium hover:bg-[#8b6f47] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: 'var(--font-cinzel), serif' }}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/40"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-[#5d4e37] font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            or
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleSocialSignIn("oauth_google")}
          disabled={!isLoaded}
          className="w-full py-3 px-4 rounded-full border-2 border-white/50 bg-white/30 backdrop-blur-sm text-[#5d4e37] font-cinzel font-medium hover:bg-[#5d4e37]/20 hover:border-[#5d4e37]/40 hover:text-[#3a3428] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialSignIn("oauth_apple")}
          disabled={!isLoaded}
          className="w-full py-3 px-4 rounded-full border-2 border-white/50 bg-white/30 backdrop-blur-sm text-[#5d4e37] font-cinzel font-medium hover:bg-[#5d4e37]/20 hover:border-[#5d4e37]/40 hover:text-[#3a3428] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ fontFamily: 'var(--font-cinzel), serif' }}
        >
          <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Continue with Apple
        </button>
      </div>

      <div className="text-center text-sm text-[#5d4e37] font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-[#8b6f47] hover:text-[#5d4e37] font-medium font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Sign up
        </Link>
      </div>
    </div>
  );
}

