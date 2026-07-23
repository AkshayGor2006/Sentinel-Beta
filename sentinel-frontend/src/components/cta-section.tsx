"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-28 border-t border-white/[0.06]">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl glass p-12 sm:p-16 text-center"
        >
          <div className="absolute inset-0 bg-grid-glow" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight max-w-xl mx-auto">
              Find out what's actually wrong with your repo
            </h2>
            <p className="mt-4 text-foreground/55 max-w-md mx-auto">
              Your first scan is free. No credit card, no setup call — just paste a repo URL.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="mt-8 gap-2">
                Scan your repository
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
