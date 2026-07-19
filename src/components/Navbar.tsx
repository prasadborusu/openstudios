"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Vision", href: "#vision" },
  { name: "Products", href: "#products" },
  { name: "Careers", href: "#careers" },
  { name: "Contact", href: "#contact" },
];

interface NavbarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function Navbar({ activeSection = "home", onSectionChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const targetSection = href.replace("#", "");
    if (onSectionChange) {
      onSectionChange(targetSection);
    } else {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.scrollTo(targetElement);
        } else {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "py-4 bg-white/70 backdrop-blur-md border-b border-slate-200/50 shadow-[0_4px_30px_rgba(37,99,235,0.03)]"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo Brand */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-3 group z-50"
          >
            {/* Logo Image */}
            <img
              src="/logo_web.png"
              alt="OpenStudios Logo"
              className="w-8 h-8 object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <span className="font-outfit font-bold text-lg tracking-[0.15em] text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
              OPENSTUDIOS
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`font-inter text-xs tracking-[0.12em] font-medium uppercase transition-colors duration-300 relative py-1 group ${
                    isActive ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-blue-600 transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </a>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:block">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "#about")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-100/80 border border-slate-200 hover:border-blue-500/50 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700 hover:bg-blue-50/85 hover:text-blue-600 transition-all duration-300 cursor-pointer"
            >
              Explore
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors z-50"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-white/98 backdrop-blur-lg flex flex-col justify-center items-center md:hidden"
          >
            {/* Background grid decorative */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="flex flex-col gap-6 text-center z-10">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`font-outfit text-3xl font-bold tracking-[0.1em] uppercase block py-2 transition-colors duration-300 ${
                      activeSection === item.href.replace("#", "") ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ delay: navItems.length * 0.05, duration: 0.4 }}
                className="mt-6"
              >
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, "#about")}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.2)]"
                >
                  Explore OpenStudios
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
