"use client";

import { motion } from "framer-motion";
import { Github, ScanSearch, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Github,
    title: "Connect a repository",
    description: "Paste a GitHub URL or authorize Sentinel to read your repos directly.",
  },
  {
    icon: ScanSearch,
    title: "Sentinel scans your code",
    description: "Static analysis and dependency checks run in under 90 seconds, mapped to real CWEs.",
  },
  {
    icon: Sparkles,
    title: "Review AI-written fixes",
    description: "Every vulnerability comes with working replacement code you can apply in one click.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 border-t border-white/[0.06] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-glow opacity-60" />
      <div className="container relative">
        <div className="max-w-xl">
          <span className="text-xs font-medium text-cyan-300 uppercase tracking-wide">How it works</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            From repo to remediation in three steps
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
                  <step.icon className="h-5 w-5 text-[#04121A]" strokeWidth={2.2} />
                </div>
                <span className="font-mono text-sm text-foreground/25">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground/90">{step.title}</h3>
              <p className="mt-2 text-sm text-foreground/50 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
