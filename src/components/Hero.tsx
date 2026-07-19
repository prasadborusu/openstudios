"use client";

import { motion } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import InteractiveLogo from "./InteractiveLogo";

interface HeroProps {
  onNavigate?: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const handleScrollTo = (id: string) => {
    const targetSection = id.replace("#", "");
    if (onNavigate) {
      onNavigate(targetSection);
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

  // Text reveal animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0, filter: "blur(8px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const, // Custom cubic-bezier for smooth inertia
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-white"
    >
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
        >
          {/* Label */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/60 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono text-[9px] tracking-[0.2em] text-slate-500 uppercase font-semibold">
              OPENSTUDIOS / TECHNOLOGY STARTUP
            </span>
          </motion.div>

          {/* Main Title */}
          <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
            <div className="overflow-hidden inline-block w-full py-1">
              <motion.span variants={itemVariants} className="block">
                Imagine. Build.
              </motion.span>
            </div>
            <div className="overflow-hidden inline-block w-full py-1">
              <motion.span
                variants={itemVariants}
                className="block text-blue-600"
              >
                Impact.
              </motion.span>
            </div>
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="font-inter text-sm md:text-base text-slate-600 leading-relaxed max-w-xl mb-8"
          >
            From the first idea to the final product, OpenStudios builds technology
            with purpose.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => handleScrollTo("#about")}
              className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.3)] flex items-center justify-center gap-1.5 group cursor-pointer"
            >
              Discover OpenStudios
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => handleScrollTo("#careers")}
              className="px-8 py-3.5 rounded-full bg-slate-100/80 border border-slate-200 hover:border-slate-300 text-xs font-semibold uppercase tracking-[0.15em] text-slate-700 hover:bg-slate-200/85 transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              Join Our Team
            </button>
          </motion.div>
        </motion.div>

        {/* Right Interactive Logo */}
        <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <InteractiveLogo />
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity z-10"
        onClick={() => handleScrollTo("#about")}
      >
        <span className="font-mono text-[9px] tracking-[0.2em] text-slate-500 uppercase">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-blue-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
