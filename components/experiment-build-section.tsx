import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ExperimentBuildSectionProps = {
  children: ReactNode;
  className?: string;
};

export function ExperimentBuildSection({
  children,
  className,
}: ExperimentBuildSectionProps) {
  return (
    <section
      className={cn(
        "bg-[#ebebed] border-zinc-300 border-t text-zinc-950",
        "dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50",
        className,
      )}
    >
      <div className="mx-auto px-5 sm:px-8 py-12 sm:py-16 max-w-6xl">{children}</div>
    </section>
  );
}
