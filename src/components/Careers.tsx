"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Briefcase, MapPin, Clock, ArrowUpRight } from "lucide-react";
import ApplyModal from "./ApplyModal";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  mode: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  duration?: string;
  stipend?: string;
  opportunity?: string;
}

const jobOpenings: Job[] = [
  {
    id: "mobile-intern",
    title: "Mobile App Development Intern",
    department: "Engineering",
    location: "Remote / Hybrid",
    mode: "Remote / Hybrid",
    type: "Internship",
    description:
      "Join Open Studios and gain hands-on experience building a real-world mobile application. You’ll work closely with our team, contribute to an active product, and transform creative ideas into functional and engaging mobile experiences.",
    responsibilities: [
      "Develop and improve features for our mobile application using Flutter or React Native.",
      "Build clean, responsive, and user-friendly mobile interfaces.",
      "Integrate APIs, backend services, and database functionality.",
      "Test, debug, and optimize the application for better performance.",
      "Collaborate with the team and contribute ideas to improve the product.",
    ],
    requirements: [
      "Basic knowledge of Flutter/Dart or React Native/JavaScript.",
      "Basic understanding of APIs and mobile application development.",
      "Interest in creating clean and intuitive user experiences.",
      "Willingness to learn, experiment, and solve real-world problems.",
      "Personal projects or a portfolio are a plus, but not mandatory.",
    ],
    duration: "3 Weeks",
    stipend: "Performance-based — determined by your contribution, work quality, and overall performance during the internship.",
    opportunity: "Gain practical experience by contributing to a real-world product and working directly with the Open Studios team.",
  },
];


export default function Careers() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <section
      id="careers"
      className="relative py-28 md:py-36 overflow-hidden bg-white"
    >
      {/* Background glow element */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="w-8 h-[1px] bg-blue-500" />
            <span className="font-mono text-xs tracking-[0.2em] text-blue-500 uppercase font-semibold">
              CAREERS
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Build With Us.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-inter text-slate-600 text-sm md:text-base leading-relaxed"
          >
            We&apos;re building our foundation and looking for curious people who want to learn,
            experiment, and create meaningful technology. Join us in shaping modern products.
          </motion.p>
        </div>

        {/* Jobs List Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {jobOpenings.map((job) => {
            const isExpanded = expandedId === job.id;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "bg-slate-50 border-blue-500/30 shadow-[0_10px_30px_rgba(37,99,235,0.03)]"
                    : "bg-slate-50/40 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80"
                }`}
              >
                {/* Header Summary (Click to expand) */}
                <button
                  onClick={() => toggleExpand(job.id)}
                  className="w-full p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center text-left gap-4 cursor-pointer group"
                >
                  <div>
                    <h3 className="font-outfit text-lg md:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    
                    {/* Tags summary */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                        <Briefcase className="w-3 h-3 text-blue-500" />
                        {job.department}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                        <MapPin className="w-3 h-3 text-blue-500" />
                        {job.location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {job.mode} / {job.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-stretch md:self-auto justify-end">
                    <span className="hidden md:inline font-mono text-[10px] text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                      {isExpanded ? "Collapse" : "View Details"}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 rounded-lg bg-slate-100 border border-slate-200"
                    >
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-8 md:px-8 md:pb-10 border-t border-slate-200/55 pt-6 space-y-6">
                        {/* Description */}
                        <div>
                          <p className="font-inter text-xs md:text-sm text-slate-600 leading-relaxed">
                            {job.description}
                          </p>
                        </div>

                        {/* Responsibilities */}
                        <div>
                          <h4 className="font-mono text-[9px] tracking-wider text-blue-600 uppercase font-bold mb-3">
                            Responsibilities:
                          </h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((resp, i) => (
                              <li
                                key={i}
                                className="font-inter text-xs text-slate-600 leading-relaxed flex items-start gap-2.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="font-mono text-[9px] tracking-wider text-blue-600 uppercase font-bold mb-3">
                            Requirements:
                          </h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, i) => (
                              <li
                                key={i}
                                className="font-inter text-xs text-slate-600 leading-relaxed flex items-start gap-2.5"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Internship Details */}
                        {job.duration && (
                          <div>
                            <h4 className="font-mono text-[9px] tracking-wider text-blue-600 uppercase font-bold mb-3">
                              Internship Details:
                            </h4>
                            <div className="bg-slate-100/50 border border-slate-200/60 p-5 rounded-2xl space-y-3 max-w-2xl">
                              <p className="font-inter text-xs text-slate-600">
                                <strong className="text-slate-800">Duration:</strong> {job.duration}
                              </p>
                              <p className="font-inter text-xs text-slate-600">
                                <strong className="text-slate-800">Mode:</strong> {job.mode}
                              </p>
                              <p className="font-inter text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">Stipend:</strong> {job.stipend}
                              </p>
                              <p className="font-inter text-xs text-slate-600 leading-relaxed">
                                <strong className="text-slate-800">Opportunity:</strong> {job.opportunity}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="pt-4 flex justify-end">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(37,99,235,0.2)]"
                          >
                            Apply Now
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Apply Fullscreen Modal */}
      <AnimatePresence>
        {selectedJob && (
          <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
