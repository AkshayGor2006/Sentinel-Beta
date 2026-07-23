"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Indie",
    price: "$5",
    period: "/mo",
    description: "For solo developers shipping side projects.",
    features: ["1 private repo", "Unlimited public repos", "AI fix suggestions", "Weekly scans"],
    highlighted: false,
  },
  {
    name: "Builder",
    price: "$15",
    period: "/mo",
    description: "For indie hackers running multiple products.",
    features: [
      "10 private repos",
      "Unlimited public repos",
      "AI fix suggestions + auto-PR",
      "Daily scans",
      "GitHub Actions integration",
    ],
    highlighted: true,
  },
  {
    name: "Pay-per-scan",
    price: "$1",
    period: "/scan",
    description: "For occasional audits with no subscription.",
    features: ["Any repo, any size", "Full vulnerability report", "AI fix suggestions", "No commitment"],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 border-t border-white/[0.06]">
      <div className="container">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-xs font-medium text-cyan-300 uppercase tracking-wide">Pricing</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Priced for developers, not enterprises
          </h2>
          <p className="mt-4 text-foreground/55">
            No seat licenses, no annual contracts. Start free, upgrade when you need more repos.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card
                className={cn(
                  "relative p-7 h-full flex flex-col",
                  plan.highlighted && "border-cyan-400/40 glow-cyan"
                )}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1 text-[11px] font-semibold text-[#04121A]">
                    Most popular
                  </span>
                )}
                <div className="text-sm font-medium text-foreground/80">{plan.name}</div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight font-mono">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-foreground/50">{plan.description}</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/65">
                      <Check className="h-4 w-4 text-cyan-300 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? "default" : "secondary"}
                  className="mt-7 w-full"
                >
                  Get started
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
