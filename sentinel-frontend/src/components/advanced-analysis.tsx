"use client";

import { BarChart3, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ScanResult } from "@/lib/types";

const upcomingFeatures = [
  "Multi-Agent Security Reasoning",
  "Attack Path Analysis",
  "AI Confidence Scoring",
  "Security Roadmap Generation",
  "Executive Security Reports",
  "Deep Repository Insights",
  "Automated Risk Prioritization",
];

export function AdvancedAnalysis({ scanResult }: { scanResult: ScanResult }) {
  void scanResult;

  return (
    <Card className="relative overflow-hidden p-5 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10">
            <BarChart3 className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Advanced Analysis</h2>
              <Badge variant="info" className="border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
                ?? Beta Feature
              </Badge>
            </div>
            <p className="mt-1 text-sm font-medium text-foreground/65">Currently in development</p>
          </div>
        </div>
      </div>

      <div className="mt-5 max-w-3xl space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Advanced Analysis is being refined for an upcoming Sentinel Beta update.
        </p>

        <div>
          <p className="mb-3 text-sm font-medium text-foreground/80">It will include:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {upcomingFeatures.map((feature) => (
              <div
                key={feature}
                className="flex min-w-0 items-start gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" />
                <span className="text-sm leading-snug text-foreground/75">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.04] px-3.5 py-3 text-sm text-cyan-100/75">
        Currently in development. Available in a future Sentinel Beta update.
      </div>
    </Card>
  );
}
