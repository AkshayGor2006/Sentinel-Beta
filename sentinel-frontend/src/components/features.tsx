"use client";

import { motion } from "framer-motion";
import { ScanSearch, GitPullRequest, Brain, Gauge, Lock, Webhook } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: ScanSearch,
    title: "Deep static analysis",
    description:
      "Combines Bandit, Semgrep, and Sentinel's own CWE-mapped rule engine to catch what generic linters miss.",
  },
  {
    icon: Brain,
    title: "AI-generated fixes",
    description:
      "Every finding ships with working, secure replacement code — not just a description of the problem.",
  },
  {
    icon: GitPullRequest,
    title: "One-click PRs",
    description:
      "Apply a fix and Sentinel opens a pull request against your default branch, ready for review.",
  },
  {
    icon: Gauge,
    title: "Security scoring",
    description:
      "Track a single 0–100 score per repo over time so you can see whether you're actually getting safer.",
  },
  {
    icon: Lock,
    title: "Secrets detection",
    description:
      "Finds hardcoded credentials, API keys, and tokens before they make it into your git history.",
  },
  {
    icon: Webhook,
    title: "CI-native",
    description:
      "Drop Sentinel into GitHub Actions and block merges on new critical findings automatically.",
  },
];

export function Features() {
  return (
    <section id="product" className="py-28 border-t border-white/[0.06]">
      <div className="container">
        <div className="max-w-xl">
          <span className="text-xs font-medium text-cyan-300 uppercase tracking-wide">Product</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Everything you need to ship secure code, solo
          </h2>
          <p className="mt-4 text-foreground/55 leading-relaxed">
            Sentinel Beta replaces the enterprise security stack you can't afford yet
            with one scanner that finds problems and writes the fix.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Card className="glass-hover h-full p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/15 to-blue-500/15 border border-cyan-400/15">
                  <f.icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold text-foreground/90">{f.title}</h3>
                <p className="mt-2 text-sm text-foreground/50 leading-relaxed">{f.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
