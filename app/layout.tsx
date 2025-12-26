import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Cinzel } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "CairoCore - Discover Cairo's Hidden Gems",
  description: "A platform for discovering and sharing historical places, museums, hidden gems, and famous spots in Cairo, Egypt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cinzel.variable}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}

