"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  LayoutDashboard,
  FileBarChart2,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getToken, clearToken, decodeUsernameFromToken } from "@/lib/api";

const navItems = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "reports", label: "Reports", href: "/reports", icon: FileBarChart2 },
  { key: "settings", label: "Settings", href: "/settings", icon: Settings },
];

export function DashboardShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: "dashboard" | "reports" | "settings";
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const [username, setUsername] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUsername(decodeUsernameFromToken(getToken()));
  }, []);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-void bg-dot-grid">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-white/[0.07] bg-void/60 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 px-6 h-16 border-b border-white/[0.07]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
            <ShieldCheck className="h-4.5 w-4.5 text-[#04121A]" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            Sentinel <span className="text-gradient">Beta</span>
          </span>
        </Link>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active === item.key
                  ? "bg-gradient-to-r from-cyan-400/15 to-blue-500/10 text-cyan-300 border border-cyan-400/20"
                  : "text-foreground/55 hover:text-foreground hover:bg-white/[0.04]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.07]">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{(username ?? "?").slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{username ?? "Not signed in"}</div>
              <div className="text-xs text-muted-foreground truncate">Sentinel Beta</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/40 hover:text-foreground hover:bg-white/[0.06] transition-colors"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-4 border-b border-white/[0.07] bg-void/85 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
            <ShieldCheck className="h-4.5 w-4.5 text-[#04121A]" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold">
            Sentinel <span className="text-gradient">Beta</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 hover:bg-white/5"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 z-50 h-screen w-72 flex flex-col border-r border-white/[0.07] bg-void lg:hidden"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/[0.07]">
                <span className="text-[15px] font-semibold">
                  Sentinel <span className="text-gradient">Beta</span>
                </span>
                <button onClick={() => setMobileOpen(false)} className="text-foreground/70">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-5 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                      active === item.key
                        ? "bg-gradient-to-r from-cyan-400/15 to-blue-500/10 text-cyan-300 border border-cyan-400/20"
                        : "text-foreground/55 hover:text-foreground hover:bg-white/[0.04]"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="hidden lg:flex items-center justify-end h-16 px-8 border-b border-white/[0.07]">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-foreground/60 hover:bg-white/[0.04] hover:text-foreground transition-colors">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </button>
        </div>
        <main className="px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-8">{children}</main>
      </div>
    </div>
  );
}
