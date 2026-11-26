"use client";

import { useState } from "react";
import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { BackgroundLayer } from "@/components/site/BackgroundLayer";
import { TopNav } from "@/components/site/TopNav";
import { Hero } from "@/components/site/Hero";
import { ProfileSection } from "@/components/site/ProfileSection";
import { AboutSection } from "@/components/site/AboutSection";
import { NecklaceSection } from "@/components/site/NecklaceSection";
import { InternshipSection } from "@/components/site/InternshipSection";
import { CertificationSection } from "@/components/site/CertificationSection";
import { HashtagSection } from "@/components/site/HashtagSection";
import { RegistrationSection } from "@/components/site/RegistrationSection";
import { Footer } from "@/components/site/Footer";
import { SettingsPanel } from "@/components/site/SettingsPanel";
import { useScrollReveal } from "@/lib/hooks";

export default function HomePage() {
  const { config, ready } = useConfig();
  const { animations } = usePrefs();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const revealEnabled = config.animation.enabled && animations;
  useScrollReveal(revealEnabled, [config, animations, ready]);

  return (
    <div className="relative min-h-screen">
      <BackgroundLayer />

      <TopNav onOpenSettings={() => setSettingsOpen(true)} />

      <main className="relative">
        <Hero />
        <ProfileSection />
        <AboutSection />
        <NecklaceSection />
        <InternshipSection />
        <CertificationSection />
        <HashtagSection />
        <RegistrationSection />
      </main>

      <Footer onOpenSettings={() => setSettingsOpen(true)} />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
