import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

