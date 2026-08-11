"use client";

import { useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ITEMS = [
  { id: "1", title: "Server Components", tags: ["nextjs", "rsc"] },
  { id: "2", title: "Client boundaries", tags: ["react", "client"] },
  { id: "3", title: "useMemo filtering", tags: ["react", "performance"] },
  { id: "4", title: "URL search params", tags: ["nextjs", "routing"] },
  { id: "5", title: "shadcn dialog", tags: ["ui", "a11y"] },
  { id: "6", title: "Catalog registry", tags: ["typescript", "dx"] },
] as const;

type Mode = "raw" | "memo";

function filterItems(query: string) {
  const normalized = query.trim().toLocaleLowerCase();

  return ITEMS.filter((item) => {
    if (!normalized) {
      return true;
    }

    const haystack = [item.title, ...item.tags].join(" ").toLocaleLowerCase();
    return haystack.includes(normalized);
  });
}

function FilterPanel({
  mode,
  filtered,
  filterRuns,
  query,
  onQueryChange,
  unrelatedClicks,
  onUnrelatedClick,
}: {
  mode: Mode;
  filtered: ReturnType<typeof filterItems>;
  filterRuns: number;
  query: string;
  onQueryChange: (value: string) => void;
  unrelatedClicks: number;
  onUnrelatedClick: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="items-end gap-3 grid sm:grid-cols-[1fr_auto]">
        <label className="block space-y-1.5">
          <span className="font-medium text-muted-foreground text-xs">Search</span>
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Try “react” or “nextjs”"
            aria-label="Filter demo items"
          />
        </label>
        <Button type="button" variant="outline" onClick={onUnrelatedClick}>
          Unrelated re-render ({unrelatedClicks})
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 font-mono text-muted-foreground text-xs">
        <span
          className={cn(
            "px-2 py-1 border rounded-md",
            mode === "raw"
              ? "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
          )}
        >
          Mode: {mode === "raw" ? "raw filter" : "useMemo"}
        </span>
        <span className="bg-muted px-2 py-1 border border-border rounded-md">
          Filter runs: {filterRuns}
        </span>
        <span className="bg-muted px-2 py-1 border border-border rounded-md">
          Matches: {filtered.length}
        </span>
      </div>

      <p className="text-muted-foreground text-sm leading-6">
        {mode === "raw" ? (
          <>
            Click{" "}
            <strong className="font-medium text-foreground">Unrelated re-render</strong>.
            The filter runs again even though the query did not change — every render
            re-filters.
          </>
        ) : (
          <>
            Click{" "}
            <strong className="font-medium text-foreground">Unrelated re-render</strong>.
            The filter run count stays put —{" "}
            <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">
              useMemo
            </code>{" "}
            only recalculates when{" "}
            <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px]">
              query
            </code>{" "}
            changes.
          </>
        )}
      </p>

      <ul className="border border-border rounded-lg divide-y divide-border overflow-hidden">
        {filtered.map((item) => (
          <li key={item.id} className="bg-card px-3 py-2.5">
            <p className="font-medium text-sm">{item.title}</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
              {item.tags.join(" · ")}
            </p>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="bg-muted/40 px-3 py-6 text-muted-foreground text-sm text-center">
            No matches.
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function RawFilterDemo() {
  const [query, setQuery] = useState("");
  const [unrelatedClicks, setUnrelatedClicks] = useState(0);
  const filterRunsRef = useRef(0);

  // Intentional: count filter work that happens during render (the lesson).
  // eslint-disable-next-line react-hooks/refs -- demo counter for render-time .filter()
  filterRunsRef.current += 1;
  const filtered = filterItems(query);

  return (
    <FilterPanel
      mode="raw"
      filtered={filtered}
      // eslint-disable-next-line react-hooks/refs -- read demo counter after increment above
      filterRuns={filterRunsRef.current}
      query={query}
      onQueryChange={setQuery}
      unrelatedClicks={unrelatedClicks}
      onUnrelatedClick={() => setUnrelatedClicks((count) => count + 1)}
    />
  );
}

function MemoFilterDemo() {
  const [query, setQuery] = useState("");
  const [unrelatedClicks, setUnrelatedClicks] = useState(0);
  const filterRunsRef = useRef(0);

  const filtered = useMemo(() => {
    // eslint-disable-next-line react-hooks/refs -- demo counter inside memoized filter
    filterRunsRef.current += 1;
    return filterItems(query);
  }, [query]);

  return (
    <FilterPanel
      mode="memo"
      filtered={filtered}
      // eslint-disable-next-line react-hooks/refs -- read demo counter after memoized filter
      filterRuns={filterRunsRef.current}
      query={query}
      onQueryChange={setQuery}
      unrelatedClicks={unrelatedClicks}
      onUnrelatedClick={() => setUnrelatedClicks((count) => count + 1)}
    />
  );
}

export function UseMemoDemo() {
  const [mode, setMode] = useState<Mode>("raw");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "raw" ? "default" : "outline"}
          onClick={() => setMode("raw")}
        >
          Without useMemo
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "memo" ? "default" : "outline"}
          onClick={() => setMode("memo")}
        >
          With useMemo
        </Button>
      </div>

      {mode === "raw" ? <RawFilterDemo /> : <MemoFilterDemo />}
    </div>
  );
}
