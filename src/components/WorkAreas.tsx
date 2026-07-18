"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, Users, Compass, Cpu, Code } from "lucide-react";

interface AreaItem {
  title: string;
  icon: React.ReactNode;
  status: "Exploring" | "Researching" | "Building";
  description: string;
  comingSoon?: boolean;
}

const areas: AreaItem[] = [
  {
    title: "Education Technology",
    icon: <BookOpen className="w-5 h-5 text-blue-400" />,
    status: "Researching",
    description: "Rethinking digital learning spaces, knowledge acquisition, and skill mastery for the next generation of builders.",
  },
  {
    title: "Event Technology",
    icon: <Calendar className="w-5 h-5 text-blue-400" />,
    status: "Building",
    description: "Designing seamless platforms that bring people together, simplifying planning, hosting, and attendance.",
  },
  {
    title: "Digital Communities",
    icon: <Users className="w-5 h-5 text-blue-400" />,
    status: "Exploring",
    description: "Researching secure, high-engagement networks designed to foster authentic connections and collaboration.",
  },
  {
    title: "Productivity",
    icon: <Compass className="w-5 h-5 text-blue-400" />,
    status: "Exploring",
    description: "Designing simple, flow-state workflows that clear away friction and help individuals do their best work.",
  },
  {
    title: "Artificial Intelligence",
    icon: <Cpu className="w-5 h-5 text-blue-400" />,
    status: "Researching",
    description: "Integrating intelligent agents and contexts into everyday tools to augment, rather than replace, human creativity.",
  },
  {
    title: "Developer Tools",
    icon: <Code className="w-5 h-5 text-blue-400" />,
    status: "Researching",
    description: "Building developer-first frameworks and platforms that accelerate product delivery from concept to scale.",
  },
];

export default function WorkAreas() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Building":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Researching":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Exploring":
        default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  return (
    <section
      id="products"
      className="relative py-28 md:py-36 overflow-hidden bg-[#030303]"
    >
      {/* Light glow in corner */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

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
              OUR SCOPE
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            What We&apos;re Working Toward.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-inter text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl"
          >
            We choose to focus on areas where digital interaction can be meaningfully
            improved. Here are the fields we are actively exploring, researching, and building.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {areas.map((area, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col justify-between h-72"
            >
              <div>
                {/* Header: Icon & Status */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    {area.icon}
                  </div>
                  <span
                    className={`font-mono text-[9px] tracking-[0.15em] uppercase font-semibold px-2.5 py-1 rounded-full border ${getStatusStyle(
                      area.status
                    )}`}
                  >
                    {area.status}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-outfit text-lg font-bold text-white mb-3">
                  {area.title}
                </h3>
                <p className="font-inter text-xs text-gray-400 leading-relaxed">
                  {area.description}
                </p>
              </div>

              {/* Bottom footer text */}
              <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">
                  Coming in the Future
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
