"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import InteractiveBackground from "@/components/InteractiveBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Vision from "@/components/Vision";
import Products from "@/components/Products";
import Careers from "@/components/Careers";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  // Keep scroll position synced to top on every section change
  useEffect(() => {
    const scrollToTop = () => {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        lenis.resize();
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();

    // Re-check scroll position after animation frames and potential exit animation heights collapse
    const timer1 = setTimeout(scrollToTop, 50);
    const timer2 = setTimeout(scrollToTop, 150);
    const timer3 = setTimeout(scrollToTop, 360); // slightly after the 350ms exit transition finishes

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activeSection]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <>
      {/* 1. First-Load Loader Overlay */}
      <Loader onComplete={() => setIsLoading(false)} />

      {/* 2. Main Page Layout (Rendered post-loader) */}
      {!isLoading && (
        <SmoothScroll>
          <div className="relative min-h-screen bg-white text-slate-900 flex flex-col overflow-x-hidden">
            {/* Global interactive background grid & curves */}
            <InteractiveBackground />

            {/* Sticky Navigation */}
            <Navbar activeSection={activeSection} onSectionChange={handleSectionChange} />

            {/* Main Content Sections */}
            <main className="flex-1 min-h-[70vh] relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {activeSection === "home" && (
                    <Hero onNavigate={handleSectionChange} />
                  )}
                  {activeSection === "about" && <About />}
                  {activeSection === "vision" && <Vision />}
                  {activeSection === "products" && <Products />}
                  {activeSection === "careers" && <Careers />}
                  {activeSection === "contact" && <Contact />}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Global Footer */}
            {activeSection === "home" && (
              <Footer activeSection={activeSection} onSectionChange={handleSectionChange} />
            )}
          </div>
        </SmoothScroll>
      )}
    </>
  );
}
