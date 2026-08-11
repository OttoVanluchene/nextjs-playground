import Link from "next/link";
import { FlaskConical } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="top-0 z-20 sticky bg-background/80 backdrop-blur-lg border-border/80 border-b">
      <div className="flex justify-between items-center mx-auto px-5 sm:px-8 max-w-6xl h-16">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-medium tracking-tight"
        >
          <span className="place-items-center grid bg-muted group-hover:bg-accent border border-border rounded-lg size-8 text-foreground transition-colors">
            <FlaskConical className="size-4" aria-hidden="true" />
          </span>
          <span>Next.js — Tiny Experiments</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
