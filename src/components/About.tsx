"use client";

import { motion } from "framer-motion";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="about"
      className="relative py-32 md:py-48 overflow-hidden bg-slate-50"
    >
      {/* Background large stroke typography */}
      <div className="absolute inset-0 select-none pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-12 -left-20 font-outfit text-[12vw] font-black uppercase"
          style={{
            WebkitTextStroke: "1px rgba(0, 0, 0, 0.025)",
            color: "transparent",
          }}
        >
          Ideas
        </div>
        <div
          className="absolute top-1/4 right-0 font-outfit text-[15vw] font-black uppercase text-right"
          style={{
            WebkitTextStroke: "1px rgba(0, 0, 0, 0.018)",
            color: "transparent",
          }}
        >
          Design
        </div>
        <div
          className="absolute bottom-1/4 -left-12 font-outfit text-[13vw] font-black uppercase"
          style={{
            WebkitTextStroke: "1px rgba(37, 99, 235, 0.025)",
            color: "transparent",
          }}
        >
          Engineering
        </div>
        <div
          className="absolute -bottom-12 right-20 font-outfit text-[14vw] font-black uppercase"
          style={{
            WebkitTextStroke: "1px rgba(0, 0, 0, 0.025)",
            color: "transparent",
          }}
        >
          Impact
        </div>
      </div>

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Section Indicator */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="w-8 h-[1px] bg-blue-500" />
              <span className="font-mono text-xs tracking-[0.2em] text-blue-500 uppercase font-semibold">
                WHO WE ARE
              </span>
            </motion.div>
          </div>

          {/* Main Statement */}
          <div className="lg:col-span-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Heading */}
              <motion.h2
                variants={textVariants}
                className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight mb-8"
              >
                We&apos;re Just Getting Started.
              </motion.h2>

              {/* Body Content */}
              <div className="space-y-6 max-w-2xl font-inter text-slate-600 text-sm md:text-base leading-relaxed">
                <motion.p variants={textVariants}>
                  OpenStudios is an early-stage technology startup dedicated to
                  building modern digital products through thoughtful design and
                  reliable technology.
                </motion.p>
                
                <motion.p variants={textVariants}>
                  We believe great software goes beyond functionality. It should be
                  intuitive, dependable, and genuinely useful. We design for clarity
                  and engineer for durability.
                </motion.p>

                <motion.p variants={textVariants}>
                  Today, we are focused on research, design, engineering, and laying
                  the foundation for our first generation of products. We are not rushing;
                  we are building carefully.
                </motion.p>

                <motion.p
                  variants={textVariants}
                  className="text-slate-900 font-medium inline-block relative py-1"
                >
                  Our journey is only beginning.
                  <span className="absolute bottom-0 left-0 w-12 h-[2px] bg-blue-500" />
                </motion.p>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
