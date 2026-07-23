import Link from "next/link";
import { ShieldCheck, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-void">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-blue-500">
                <ShieldCheck className="h-4 w-4 text-[#04121A]" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Sentinel <span className="text-gradient">Beta</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-foreground/45 max-w-xs leading-relaxed">
              AI-powered vulnerability scanning and auto-fix for solo developers
              and small teams shipping on GitHub.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-foreground/50 hover:text-foreground hover:border-white/25 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-foreground/50 hover:text-foreground hover:border-white/25 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <div className="text-xs font-medium text-foreground/80 mb-3">Product</div>
              <ul className="space-y-2.5 text-sm text-foreground/45">
                <li><Link href="/#product" className="hover:text-foreground/80 transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-foreground/80 transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground/80 transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-medium text-foreground/80 mb-3">Company</div>
              <ul className="space-y-2.5 text-sm text-foreground/45">
                <li><a href="#" className="hover:text-foreground/80 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground/80 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground/80 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-medium text-foreground/80 mb-3">Legal</div>
              <ul className="space-y-2.5 text-sm text-foreground/45">
                <li><a href="#" className="hover:text-foreground/80 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground/80 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground/80 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/35">
          <span>© 2026 Sentinel Beta. All rights reserved.</span>
          <span>Built for developers who ship fast and stay secure.</span>
        </div>
      </div>
    </footer>
  );
}
