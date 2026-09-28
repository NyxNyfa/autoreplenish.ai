import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { BentoFeatures } from "@/components/BentoFeatures";
import { LiveSimulator } from "@/components/LiveSimulator";
import { TelegramSimulator } from "@/components/TelegramSimulator";
import { WorkflowSection } from "@/components/WorkflowSection";
import { ComparisonMatrix } from "@/components/ComparisonMatrix";
import { RoiMetrics } from "@/components/RoiMetrics";
import { ArchitectureSection } from "@/components/ArchitectureSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { DemoModal } from "@/components/DemoModal";

export function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleOpenDemo = () => setDemoModalOpen(true);
  const handleCloseDemo = () => setDemoModalOpen(false);

  const handleScrollToSimulator = () => {
    const el = document.getElementById("simulasi");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Navbar onOpenDemo={handleOpenDemo} />

      <main>
        <HeroSection
          onOpenDemo={handleOpenDemo}
          onExploreSimulator={handleScrollToSimulator}
        />
        <BentoFeatures />
        <LiveSimulator />
        <TelegramSimulator />
        <WorkflowSection />
        <ComparisonMatrix />
        <RoiMetrics onOpenDemo={handleOpenDemo} />
        <ArchitectureSection />
        <FaqSection />
      </main>

      <Footer onOpenDemo={handleOpenDemo} />

      <DemoModal isOpen={demoModalOpen} onClose={handleCloseDemo} />
    </div>
  );
}

export default App;
