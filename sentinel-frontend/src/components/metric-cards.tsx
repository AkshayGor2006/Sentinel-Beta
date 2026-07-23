"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MetricCard {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "cyan" | "rose" | "blue" | "emerald" | "amber";
  hint?: string;
}

const accentMap = {
  cyan: { text: "text-cyan-300", ring: "from-cyan-400/20 to-transparent" },
  rose: { text: "text-severity-critical", ring: "from-rose-500/20 to-transparent" },
  blue: { text: "text-blue-400", ring: "from-blue-500/20 to-transparent" },
  emerald: { text: "text-emerald-400", ring: "from-emerald-500/20 to-transparent" },
  amber: { text: "text-severity-medium", ring: "from-amber-400/20 to-transparent" },
};

/**
 * Bound to whatever real numbers you pass in — no fabricated "security
 * score /100" here, since that field's shape wasn't confirmed from your
 * API samples. Used for GET /dashboard totals and per-scan severity counts.
 */
export function MetricCards({ cards }: { cards: MetricCard[] }) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const accent = accentMap[card.accent ?? "cyan"];
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Card className="glass-hover relative overflow-hidden p-5">
              <div
                className={cn(
                  "absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl",
                  accent.ring
                )}
              />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">{card.label}</div>
                  <div className="mt-2 text-3xl font-semibold tracking-tight font-mono text-foreground">
                    {card.value}
                  </div>
                </div>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06]",
                    accent.text
                  )}
                >
                  <card.icon className="h-4.5 w-4.5" />
                </div>
              </div>
              {card.hint && (
                <div className="relative mt-3 text-xs text-muted-foreground">{card.hint}</div>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
