"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Ear,
  House,
  Menu,
  Mic,
  PenLine,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/brand";

const NAV = [
  { href: "/", label: "Dashboard", icon: House },
  { href: "/writing", label: "Writing", icon: PenLine },
  { href: "/reading", label: "Reading", icon: BookOpen },
  { href: "/listening", label: "Listening", icon: Ear },
  { href: "/speaking", label: "Speaking", icon: Mic },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex h-[34px] items-center gap-2.5 rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:text-foreground",
              active && "bg-[#edecE7] font-medium text-foreground",
            )}
          >
            <Icon size={16} strokeWidth={1.6} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  children,
  todayCount,
}: {
  children: React.ReactNode;
  todayCount: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const section =
    pathname === "/"
      ? "Dashboard"
      : (NAV.find((n) => isActive(pathname, n.href))?.label ?? "Practice");

  return (
    <div className="flex h-dvh bg-chrome text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden w-[232px] shrink-0 flex-col md:flex">
        <Link href="/" className="flex h-12 items-center px-5">
          <Brand />
        </Link>
        <div className="flex-1 px-3 pt-5">
          <NavList pathname={pathname} />
        </div>
        <div className="px-5 pb-5">
          <p className="text-xs leading-5 text-muted-foreground">
            Band 5.5 &rarr; 7.0
            <br />
            Daily drills, not lectures.
          </p>
        </div>
      </aside>

      {/* Right column: top bar + white sheet */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between pl-4 pr-4 md:pl-6 md:pr-5">
          <div className="flex items-center gap-3">
            <button
              className="flex size-8 items-center justify-center rounded-lg text-foreground md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} strokeWidth={1.8} />
            </button>
            <span className="text-sm font-medium md:hidden">Bandwork</span>
            <span className="hidden text-sm text-muted-foreground md:block">
              {section}
            </span>
          </div>
          <span className="num text-xs text-muted-foreground">
            {todayCount === 1 ? "1 drill today" : `${todayCount} drills today`}
          </span>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto bg-sheet md:mb-2 md:mr-2 md:rounded-2xl md:border md:border-border">
          {children}
        </main>
      </div>

      {/* Mobile nav sheet */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-chrome md:hidden">
          <div className="flex h-12 items-center justify-between px-4">
            <Brand />
            <button
              className="flex size-8 items-center justify-center rounded-lg"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} strokeWidth={1.8} />
            </button>
          </div>
          <div className="px-3 pt-4">
            <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
          <div className="mt-auto px-5 pb-6">
            <p className="text-xs text-muted-foreground">Band 5.5 &rarr; 7.0</p>
          </div>
        </div>
      )}
    </div>
  );
}
