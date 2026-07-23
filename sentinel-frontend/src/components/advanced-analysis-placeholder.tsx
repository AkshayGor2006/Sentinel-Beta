"use client";

import { motion } from "framer-motion";
import {
  Layers,
  Network,
  Crosshair,
  Gauge,
  Map,
  FileBarChart,
  SearchCode,
  ListChecks,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const upcoming = [
  { icon: Network, label: "Multi-Agent Security Reasoning" },
  { icon: Crosshair, label: "Attack Path Analysis" },
  { icon: Gauge, label: "AI Confidence Scoring" },
  { icon: Map, label: "Security Roadmap Generation" },
  { icon: FileBarChart, label: "Executive Security Reports" },
  { icon: SearchCode, label: "Deep Repository Insights" },
  { icon: ListChecks, label: "Automated Risk Prioritization" },
];

/**
 * Purely presentational — no scanResult data is read or rendered here.
 * Your backend still computes and returns all of this (progress,
 * recommendations, patches, executive_report, etc.) exactly as before;
 * this card just replaces the raw-JSON view that used to sit here.
 */
export function AdvancedAnalysisPlaceholder() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-glow opacity-40 pointer-events-none" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/15 to-blue-500/15 border border-cyan-400/15">
                <Layers className="h-4.5 w-4.5 text-cyan-300" />
              </div>
              <h2 className="text-base font-semibold text-foreground/90">Advanced Analysis</h2>
            </div>
            <Badge variant="medium">🚧 Beta Feature</Badge>
          </div>

          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-foreground/40">
            Currently in development
          </p>

          <p className="mt-2 max-w-2xl text-sm text-foreground/55 leading-relaxed">
            Advanced Analysis is being refined for an upcoming Sentinel Beta update. It will include:
          </p>

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {upcoming.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5"
              >
                <item.icon className="h-4 w-4 text-cyan-300/60 shrink-0" />
                <span className="text-sm text-foreground/65">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-2 text-xs text-foreground/35">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            Currently in development. Available in a future Sentinel Beta update.
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
