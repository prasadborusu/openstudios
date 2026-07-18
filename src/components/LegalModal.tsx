"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "privacy" | "terms";
}

export default function LegalModal({ isOpen, onClose, type }: LegalModalProps) {
  const content = {
    privacy: {
      title: "Privacy Policy",
      paragraphs: [
        "Open Studios respects your privacy. We may collect basic information that you voluntarily provide through our website, such as your name, email address, or contact details. This information will only be used to communicate with you and improve our services. We do not sell your personal information to third parties.",
        "Open Studios is currently an independent initiative and is not yet registered as a company or trademark. This policy may be updated as our platform and services develop."
      ]
    },
    terms: {
      title: "Terms of Service",
      paragraphs: [
        "By accessing or using the Open Studios website, you agree to use the platform responsibly and lawfully. The content, designs, and materials displayed on this website are intended for informational and promotional purposes and should not be copied or misused without permission.",
        "Open Studios is currently an independent initiative and is not yet registered as a company, business entity, or trademark. Our services, features, and these terms may change as the platform develops and completes its legal registration processes."
      ]
    }
  };

  const current = content[type] || content.privacy;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-[#f8faff] via-white to-white border border-blue-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col"
            data-lenis-prevent
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-outfit font-bold text-lg text-slate-900 tracking-tight">
                {current.title}
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[60vh] space-y-4" data-lenis-prevent>
              {current.paragraphs.map((p, index) => (
                <p key={index} className="font-inter text-sm text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Footer button */}
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
