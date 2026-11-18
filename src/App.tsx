import { useState, type FC } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { CaraKerja } from "@/components/sections/CaraKerja";
import { BentoFeatures } from "@/components/BentoFeatures";
import { WorkflowSection } from "@/components/WorkflowSection";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";
import { RoiMetrics } from "@/components/RoiMetrics";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { DemoModal } from "@/components/DemoModal";

export const App: FC = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleOpenDemo = () => setDemoModalOpen(true);
  const handleCloseDemo = () => setDemoModalOpen(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-mono selection:bg-[var(--accent)]/30 selection:text-[var(--text)]">
      {/* 1. Monospace Navbar */}
      <Navbar onOpenDemo={handleOpenDemo} />

      <main>
        {/* 2. Full-Bleed 3D Hero Cinematic Background + Monospace DOM Overlay */}
        <HeroSection
          onOpenDemo={handleOpenDemo}
          onNavigateDemo={handleOpenDemo}
        />

        {/* 3. Executive Metrics & 5-Step Pipeline Section */}
        <CaraKerja onOpenDemo={handleOpenDemo} />

        {/* 4. Core Feature & Architecture Sections */}
        <BentoFeatures />
        <WorkflowSection />
        <ComparisonMatrix />
        <RoiMetrics onOpenDemo={handleOpenDemo} />
        <ArchitectureSection />
        <FaqSection />
      </main>

      {/* 5. Footer */}
      <Footer onOpenDemo={handleOpenDemo} />

      {/* 6. Demo Request Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={handleCloseDemo} />
    </div>
  );
};

export default App;
