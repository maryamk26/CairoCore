import AuthContainer from "@/components/auth/AuthContainer";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 relative"
      style={{
        backgroundImage: 'url(/images/backgrounds/authbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Logo/Brand - Top Left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <Link href="/" className="inline-block">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-[#5d4e37] tracking-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>CairoCore</h1>
        </Link>
      </div>

      <AuthContainer />
    </div>
  );
}

