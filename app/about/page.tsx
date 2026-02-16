"use client";

import { useState } from "react";
import HeroSection from "./components/HeroSection";
import AboutModal from "./components/AboutModal";

export default function AboutPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <HeroSection onExplore={() => setShowModal(true)} />

      {/* Modal */}
      <AboutModal open={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
