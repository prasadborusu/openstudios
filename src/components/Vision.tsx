"use client";

import { motion } from "framer-motion";

export default function Vision() {
  return (
    <section
      id="vision"
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white py-24 md:py-32"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Subtle grid elements floating in behind */}
      <div className="absolute inset-0 bg-white select-none pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/20 rounded-full blur-[2px] scale-95 animate-pulse-slow" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 w-full">
        
        {/* Main Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="w-8 h-[1px] bg-blue-500/50" />
            <span className="font-mono text-xs tracking-[0.3em] text-blue-500 uppercase font-semibold">
              OUR VISION
            </span>
            <span className="w-8 h-[1px] bg-blue-500/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-outfit text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
          >
            What Drives <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">OpenStudios</span>
          </motion.h2>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
          
          {/* Card 1: WE BELIEVE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 md:p-10 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500/30 hover:bg-blue-50/50 transition-all duration-500 flex flex-col justify-between shadow-sm group hover:-translate-y-1"
          >
            <div>
              <h3 className="font-outfit text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 uppercase mb-6 group-hover:text-blue-600 transition-colors duration-300">
                WE BELIEVE.
              </h3>
              <p className="font-mono text-xs text-blue-500 uppercase tracking-widest mb-4 font-semibold">
                Core Philosophy
              </p>
              <p className="font-inter text-slate-600 text-sm md:text-base leading-relaxed mb-6 group-hover:text-slate-700 transition-colors duration-300">
                Great ideas deserve the courage to become real. Technology should be a tool that empowers, solves real-world challenges, and elevates human experiences. We don't build for the sake of novelty; we build for utility, beauty, and lasting impact.
              </p>
            </div>
            <p className="font-inter text-slate-500 text-xs italic border-t border-slate-200/60 pt-4 mt-4">
              "Great ideas deserve the courage to become real."
            </p>
          </motion.div>

          {/* Card 2: WE BUILD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 md:p-10 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500/30 hover:bg-blue-50/50 transition-all duration-500 flex flex-col justify-between shadow-sm group hover:-translate-y-1"
          >
            <div>
              <h3 className="font-outfit text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 uppercase mb-6 group-hover:text-blue-600 transition-colors duration-300">
                WE BUILD.
              </h3>
              <p className="font-mono text-xs text-blue-500 uppercase tracking-widest mb-4 font-semibold">
                Our Action
              </p>
              <p className="font-inter text-slate-600 text-sm md:text-base leading-relaxed mb-6 group-hover:text-slate-700 transition-colors duration-300">
                We build modern digital interfaces, cloud platforms, and mobile ecosystems designed to solve meaningful problems. Through thoughtful design, careful engineering, and a focus on pixel-perfection, we turn complex challenges into simple, elegant software solutions.
              </p>
            </div>
            <p className="font-inter text-slate-500 text-xs italic border-t border-slate-200/60 pt-4 mt-4">
              "Technology designed to solve meaningful problems."
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
