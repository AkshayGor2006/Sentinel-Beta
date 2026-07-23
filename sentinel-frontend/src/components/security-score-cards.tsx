"use client";

import { motion } from "framer-motion";
import { ShieldCheck, TriangleAlert, Sparkles, FileCode2, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { scoreCards } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  "Security Score": ShieldCheck,
  "Open Vulnerabilities": TriangleAlert,
  "AI Fixes Available": Sparkles,
  "Files Scanned": FileCode2,
};

const accentMap = {
  cyan: { text: "text-cyan-300", ring: "from-cyan-400/20 to-transparent", trend: "text-cyan-300" },
  rose: { text: "text-severity-critical", ring: "from-rose-500/20 to-transparent", trend: "text-severity-critical" },
  blue: { text: "text-blue-400", ring: "from-blue-500/20 to-transparent", trend: "text-blue-400" },
  emerald: { text: "text-emerald-400", ring: "from-emerald-500/20 to-transparent", trend: "text-emerald-400" },
};

export function SecurityScoreCards({
  data = scoreCards,
}: {
  data?: typeof scoreCards;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {data.map((card, i) => {
        const Icon = iconMap[card.label];
        const accent = accentMap[card.accent];
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07 }}
          >
            <Card className="glass-hover relative overflow-hidden p-5">
              <div className={cn("absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl", accent.ring)} />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">{card.label}</div>
                  <div className="mt-2 flex items-baseline gap-1 font-mono">
                    <span className="text-3xl font-semibold tracking-tight text-foreground">
                      {card.value}
                    </span>
                    {card.suffix && (
                      <span className="text-sm text-muted-foreground">{card.suffix}</span>
                    )}
                  </div>
                </div>
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]", accent.text)}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="relative mt-3 flex items-center gap-1.5 text-xs">
                <span className={cn("font-medium", accent.trend)}>{card.trend}</span>
                <span className="text-muted-foreground">{card.description}</span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
