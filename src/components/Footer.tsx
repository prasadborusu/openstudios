"use client";

import { useState } from "react";
import { ArrowUp, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LegalModal from "./LegalModal";

interface FooterProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function Footer({ activeSection = "home", onSectionChange }: FooterProps) {
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; type: "privacy" | "terms" }>({
    isOpen: false,
    type: "privacy",
  });
  const handleScrollToTop = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const targetSection = id.replace("#", "");
    if (onSectionChange) {
      onSectionChange(targetSection);
    } else {
      const target = document.querySelector(id);
      if (target) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(target);
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/135106665",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="relative bg-white border-t border-slate-200 pt-28 pb-20 z-10 overflow-hidden">
      {/* Sleek horizontal glowing line border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/35 to-transparent" />

      {/* Decorative vector grid inside footer background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Soft dome glow rising from the bottom */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[70vw] h-[350px] bg-gradient-to-t from-blue-600/5 via-indigo-600/2 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top CTA Row */}
        <AnimatePresence>
          {activeSection === "home" && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: "5rem" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 pb-20 border-b border-slate-200/80">
                <div className="max-w-2xl">
                  <h3 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-5 leading-[1.15]">
                    Let’s build the future of{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      digital products
                    </span>{" "}
                    together.
                  </h3>
                  <p className="font-inter text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
                    We collaborate with visionary brands and build thoughtful digital experiences. Start a conversation or explore our current works.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <a
                    href="#contact"
                    onClick={(e) => handleScrollTo(e, "#contact")}
                    className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_4px_15px_rgba(37,99,235,0.15)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.25)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    Get in touch
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-20">
          
          {/* Brand Column (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo_web.png"
                alt="OpenStudios Logo"
                className="w-9 h-9 object-contain"
              />
              <span className="font-outfit font-bold text-xl tracking-[0.15em] text-slate-900">
                OPENSTUDIOS
              </span>
            </div>
            
            <p className="font-inter text-sm text-slate-600 max-w-sm leading-relaxed">
              An early-stage startup engineering and designing a thoughtful, modern ecosystem of digital interfaces.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              OPEN FOR PARTNERSHIPS
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="space-y-5">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold">
              Company
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleScrollTo(e, "#about")}
                  className="inline-block font-inter text-xs text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-300"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#vision"
                  onClick={(e) => handleScrollTo(e, "#vision")}
                  className="inline-block font-inter text-xs text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-300"
                >
                  Vision
                </a>
              </li>
              <li>
                <a
                  href="#careers"
                  onClick={(e) => handleScrollTo(e, "#careers")}
                  className="inline-block font-inter text-xs text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-300"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleScrollTo(e, "#contact")}
                  className="inline-block font-inter text-xs text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-5">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold">
              Legal
            </h4>
            <ul className="space-y-3.5">
              <li>
                <button
                  onClick={() => setLegalModal({ isOpen: true, type: "privacy" })}
                  className="inline-block font-inter text-xs text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-300 text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModal({ isOpen: true, type: "terms" })}
                  className="inline-block font-inter text-xs text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-300 text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Socials */}
          <div className="space-y-5">
            <h4 className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase font-bold">
              Connect
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500/50 hover:bg-blue-50/50 text-slate-500 hover:text-blue-600 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-[0_4px_15px_rgba(37,99,235,0.1)] hover:-translate-y-0.5"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">
            © 2026 OpenStudios. All rights reserved.
          </span>
          
          <button
            onClick={handleScrollToTop}
            className="group inline-flex items-center gap-2 font-mono text-[10px] text-slate-500 hover:text-slate-900 uppercase tracking-wider transition-colors cursor-pointer"
          >
            Back to Top
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Huge Backdrop Text (Matching the premium typography aesthetic of the landing page) */}
      <div className="absolute bottom-4 left-0 right-0 w-full text-center select-none pointer-events-none opacity-[0.025] md:opacity-[0.035]">
        <span
          className="font-outfit text-[12vw] font-black uppercase tracking-[0.2em] block whitespace-nowrap leading-none"
          style={{
            WebkitTextStroke: "1px #0f172a",
            color: "transparent",
          }}
        >
          OPENSTUDIOS
        </span>
      </div>

      {/* Legal documents modals */}
      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        onClose={() => setLegalModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </footer>
  );
}
