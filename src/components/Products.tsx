"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Products() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const { error: dbError } = await supabase
        .from("product_subscribers")
        .insert([{ email }]);

      if (dbError) {
        console.warn("Supabase Error saving subscriber:", dbError.message);
        // Fallback for development if the table hasn't been created in the Supabase Dashboard yet
        if (process.env.NODE_ENV === "development") {
          setSubmitted(true);
          setEmail("");
        } else {
          setError("Failed to subscribe. Please try again later.");
        }
      } else {
        setSubmitted(true);
        setEmail("");
      }
    } catch (err: any) {
      console.error("Subscription exception:", err);
      if (process.env.NODE_ENV === "development") {
        setSubmitted(true);
        setEmail("");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="products"
      className="relative min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-white py-24 md:py-36 border-y border-slate-200/60"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-[1px] bg-gradient-to-l from-blue-500/20 to-transparent" />
      <div className="absolute top-10 left-10 w-72 h-[1px] bg-gradient-to-r from-blue-500/20 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="w-8 h-[1px] bg-blue-500/50" />
          <span className="font-mono text-xs tracking-[0.3em] text-blue-500 uppercase font-semibold">
            PRODUCTS
          </span>
          <span className="w-8 h-[1px] bg-blue-500/50" />
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-outfit text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight"
        >
          We’re Building <span className="text-blue-600">Something New.</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-inter text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl"
        >
          Our first products are currently taking shape.<br />
          <span className="text-slate-800">Thoughtfully imagined. Carefully built. Coming soon.</span>
        </motion.p>

        {/* Email Capture / Notify Me */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 w-full max-w-md relative"
        >
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs font-medium text-left">
              {error}
            </div>
          )}

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-inter"
            >
              ✓ Thank you! You've been added to our notification list.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3.5 rounded-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white text-sm font-inter transition-all duration-300 w-full disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_4px_15px_rgba(37,99,235,0.15)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.25)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Notify Me"
                )}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}

