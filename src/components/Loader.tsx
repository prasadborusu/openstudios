"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    // Check if user has already seen the loader in this session
    const hasSeenLoader = sessionStorage.getItem("openstudios-loader-seen");
    if (hasSeenLoader === "true") {
      setVisible(false);
      onComplete();
      return;
    }

    // Sequence timing
    // 0.8s: Show tagline
    const taglineTimeout = setTimeout(() => {
      setShowTagline(true);
    }, 850);

    // 1.8s: Fade out and complete
    const fadeTimeout = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("openstudios-loader-seen", "true");
      // Wait for exit animation (0.3s) before calling onComplete
      setTimeout(onComplete, 300);
    }, 1800);

    return () => {
      clearTimeout(taglineTimeout);
      clearTimeout(fadeTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
          {/* Logo Outline & Animation */}
          <div className="relative w-24 h-24 mb-6">
            {/* Glowing Backlight Core */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.6, 0.2], scale: [0.5, 1.2, 0.9] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 m-auto w-12 h-12 bg-blue-600/10 rounded-full blur-xl pointer-events-none"
            />

            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Circular Outline - Glass background */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(0, 0, 0, 0.05)"
                strokeWidth="1.5"
              />

              {/* Outer circle - blue light path */}
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ strokeDasharray: "251", strokeDashoffset: "251" }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 1.4,
                  ease: "easeInOut",
                }}
              />
            </svg>

            {/* Centered logo image */}
            <motion.img
              src="/logo_web.png"
              alt="OpenStudios Logo"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 0.8 }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="absolute inset-0 m-auto w-[76%] h-[76%] object-contain"
            />
          </div>

          {/* Texts */}
          <div className="text-center overflow-hidden flex flex-col items-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-outfit text-xl font-bold tracking-[0.3em] text-slate-900 uppercase"
            >
              OpenStudios
            </motion.h1>

            <div className="h-6 mt-2 overflow-hidden">
              <AnimatePresence>
                {showTagline && (
                  <motion.p
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -15, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="font-inter text-[9px] tracking-[0.25em] text-slate-500 uppercase font-medium"
                  >
                    Building Products That Matter.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
