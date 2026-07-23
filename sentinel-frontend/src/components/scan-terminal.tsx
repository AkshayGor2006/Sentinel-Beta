"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Circle, ShieldAlert, ShieldCheck } from "lucide-react";
import { scanLogLines } from "@/lib/mock-data";

function lineTone(line: string) {
  if (line.startsWith("✗")) return "text-severity-critical";
  if (line.startsWith("✓")) return "text-severity-low";
  if (line.startsWith("$")) return "text-cyan-300";
  return "text-foreground/50";
}

export function ScanTerminal() {
  const [visible, setVisible] = React.useState(0);

  React.useEffect(() => {
    if (visible >= scanLogLines.length) {
      const reset = setTimeout(() => setVisible(0), 2200);
      return () => clearTimeout(reset);
    }
    const t = setTimeout(() => setVisible((v) => v + 1), visible === 0 ? 400 : 480);
    return () => clearTimeout(t);
  }, [visible]);

  const score = 74;
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-full max-w-md">
      {/* Ambient glow behind the terminal */}
      <div className="absolute -inset-8 rounded-[2rem] bg-cyan-500/10 blur-3xl" />

      <div className="relative glass rounded-2xl overflow-hidden glow-cyan">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-severity-critical/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-severity-medium/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-severity-low/60" />
          </div>
          <span className="ml-2 text-xs font-mono text-foreground/40">
            sentinel — scanning api-gateway
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-cyan-300/80">
            <Circle className="h-2 w-2 fill-cyan-400 text-cyan-400 animate-pulse-glow" />
            live
          </span>
        </div>

        {/* Terminal body */}
        <div className="h-52 px-4 py-4 font-mono text-[12.5px] leading-6 overflow-hidden">
          {scanLogLines.slice(0, visible).map((line, i) => (
            <div key={i} className={lineTone(line)}>
              {line}
              {i === visible - 1 && visible < scanLogLines.length && (
                <span className="inline-block w-1.5 h-3.5 bg-cyan-300 ml-1 align-middle animate-blink" />
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.07]" />

        {/* Score readout */}
        <div className="flex items-center justify-between px-5 py-4 bg-white/[0.015]">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14">
              <svg viewBox="0 0 100 100" className="h-14 w-14 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="8" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono text-foreground">
                {score}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Security score</div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-severity-low">
                <ShieldCheck className="h-3.5 w-3.5" />
                +6 this scan
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-severity-critical/25 bg-severity-critical/10 px-3 py-1.5 text-xs font-medium text-severity-critical">
            <ShieldAlert className="h-3.5 w-3.5" />
            2 critical
          </div>
        </div>
      </div>
    </div>
  );
}
