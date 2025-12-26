import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#f5f1e8] via-[#e8ddd4] to-[#d4c4b0]">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-5xl font-cinzel font-bold text-[#5d4e37] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>CairoCore</h1>
          </Link>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-8">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-cinzel font-bold text-[#5d4e37] mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Create account</h2>
            <p className="text-[#8b6f47] font-cinzel" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Start exploring Cairo's amazing places</p>
          </div>

          <SignUpForm />
        </div>
      </div>
    </div>
  );
}

