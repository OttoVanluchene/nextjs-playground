import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BuildHighlightProps = {
  children: ReactNode;
  className?: string;
};

/** Emphasize a key phrase in How-to-build explanations */
export function BuildHighlight({ children, className }: BuildHighlightProps) {
  return (
    <mark
      className={cn(
        "bg-amber-500/20 dark:bg-amber-400/20 px-1 rounded font-medium text-inherit",
        className,
      )}
    >
      {children}
    </mark>
  );
}
