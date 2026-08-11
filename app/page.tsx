import { BookOpenCheck, Layers } from "lucide-react";

import { ExperimentCatalog } from "@/components/experiment-catalog";
import { experimentGroups, getCatalogExperiments } from "@/lib/experiments";

export default function Home() {
  const catalogExperiments = getCatalogExperiments();

  return (
    <main className="flex-1">
      <section className="bg-linear-to-b from-muted/70 via-background to-background border-border/80 border-b">
        <div className="mx-auto px-5 sm:px-8 py-8 sm:py-10 max-w-6xl">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 mb-3 font-mono font-medium text-muted-foreground text-xs uppercase tracking-[0.18em]">
              Learning lab
            </p>
            <h1 className="max-w-2xl font-semibold text-3xl sm:text-4xl text-balance tracking-tight">
              Next.js — Tiny Experiments
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground text-base sm:text-lg leading-7">
              A growing index of small Next.js related experiments for learning,
              experimenting, and keeping reusable patterns within reach.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-3 bg-background/80 shadow-xs backdrop-blur-sm px-4 py-2.5 border border-border rounded-xl">
              <Layers className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Learning groups</span>
              <strong className="font-mono text-sm">{experimentGroups.length}</strong>
            </div>
            <div className="flex items-center gap-3 bg-background/80 shadow-xs backdrop-blur-sm px-4 py-2.5 border border-border rounded-xl">
              <BookOpenCheck className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">Ready experiments</span>
              <strong className="font-mono text-sm">{catalogExperiments.length}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto px-5 sm:px-8 py-12 sm:py-16 max-w-6xl">
        <ExperimentCatalog experiments={catalogExperiments} groups={experimentGroups} />
      </section>
    </main>
  );
}
