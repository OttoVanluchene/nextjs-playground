import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Filter, RefreshCw, Server } from "lucide-react";

import { UseMemoDemo } from "./usememo-demo";
import { BuildHighlight } from "@/components/build-highlight";
import { CodeBlock } from "@/components/code-block";
import { ExperimentBackLink } from "@/components/experiment-back-link";
import { ExperimentBuildSection } from "@/components/experiment-build-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getCatalogExperiment, getGroupColorClasses } from "@/lib/experiments";

const inlineCodeClassName =
  "bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-[11px] text-foreground";

const buildInlineCodeClassName =
  "bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded font-mono text-[11px]";

const experiment = getCatalogExperiment("nextjs", "usememo-basics");

export const metadata: Metadata = {
  title: experiment?.title ?? "useMemo basics",
  description:
    experiment?.description ??
    "When client-side filtering re-renders, and when useMemo actually helps.",
};

const rawSnippet = `"use client";

import { useState } from "react";

const items = [/* … */];

export function SearchList() {
  const [query, setQuery] = useState("");
  const [clicks, setClicks] = useState(0);

  // Runs again on every render — including when only \`clicks\` changes
  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => setClicks((c) => c + 1)}>Unrelated ({clicks})</button>
      <ul>{filtered.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
    </>
  );
}`;

const memoSnippet = `"use client";

import { useMemo, useState } from "react";

const items = [/* … */];

export function SearchList() {
  const [query, setQuery] = useState("");
  const [clicks, setClicks] = useState(0);

  const filtered = useMemo(() => {
    return items.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]); // recalculate only when query changes

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={() => setClicks((c) => c + 1)}>Unrelated ({clicks})</button>
      <ul>{filtered.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
    </>
  );
}`;

const catalogSnippet = `// components/experiment-catalog.tsx (simplified)
const filteredExperiments = useMemo(() => {
  return experiments.filter((experiment) => {
    const matchesGroup = selectedGroup === "all" || experiment.group === selectedGroup;
    const matchesTag = activeTag === "all" || experiment.tags.includes(activeTag);
    // … + search text …
    return matchesGroup && matchesTag && matchesQuery;
  });
}, [activeTag, experiments, query, selectedGroup]);`;

const serverSnippet = `// app/search/page.tsx — Server Component
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await db.experiments.search(q); // filtered on the server

  return <ResultsList items={results} />;
}

// Client search box updates the URL instead of filtering locally:
// router.push(\`/search?q=\${value}\`) or <form> + GET`;

export default function UseMemoBasicsPage() {
  if (!experiment) {
    notFound();
  }

  const groupColors = getGroupColorClasses(experiment.groupInfo);

  return (
    <main className="flex-1">
      <div className="mx-auto px-5 sm:px-8 pt-3 sm:pt-4 pb-12 sm:pb-16 max-w-6xl">
        <ExperimentBackLink />

        <div className="mt-6 max-w-2xl">
          <h1 className="font-semibold text-4xl sm:text-5xl text-balance tracking-tight">
            {experiment.title}
          </h1>
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <Badge variant="outline" className={cn(groupColors.badge)}>
              {experiment.groupInfo.name}
            </Badge>
            <span className="px-0.5 text-muted-foreground" aria-hidden="true">
              -
            </span>
            {experiment.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="font-normal text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
            <span className="px-0.5 text-muted-foreground" aria-hidden="true">
              -
            </span>
            <span className="text-muted-foreground text-sm">{experiment.author}</span>
          </div>
          <p className="mt-4 text-muted-foreground text-lg leading-8">
            On the client, lists and tables re-render for lots of reasons — typing in a
            search box, flipping a toggle, opening a menu.{" "}
            <code className={inlineCodeClassName}>useMemo</code> keeps derived data (like
            a filtered list) from being rebuilt when those inputs did not change.
          </p>
        </div>

        <div className="gap-4 grid md:grid-cols-3 mt-10">
          <Card>
            <CardHeader>
              <Filter className="mb-2 size-5 text-muted-foreground" aria-hidden="true" />
              <CardTitle>Caches a derived value</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              <code className={inlineCodeClassName}>useMemo(() =&gt; value, deps)</code>{" "}
              keeps the last result and only recalculates when a dependency changes. It
              does not make the first computation free.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <RefreshCw
                className="mb-2 size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <CardTitle>Client = React re-renders</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              A <code className={inlineCodeClassName}>&quot;use client&quot;</code> tree
              still re-renders when its state updates. Next.js routed you here; React
              decides how often your filter function runs.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Server className="mb-2 size-5 text-muted-foreground" aria-hidden="true" />
              <CardTitle>Correctness vs cost</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              Skipping memo is fine for tiny lists. Client search/filter is the classic
              case where the same <code className={inlineCodeClassName}>.filter()</code>{" "}
              can re-run on every keystroke <em>and</em> every unrelated state update.
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 max-w-2xl">
          <CardHeader>
            <CardTitle>Try it</CardTitle>
          </CardHeader>
          <CardContent>
            <UseMemoDemo />
          </CardContent>
        </Card>
      </div>

      <ExperimentBuildSection>
        <p className="font-mono font-medium text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-[0.18em]">
          Implementation
        </p>
        <h2 className="mt-2 font-semibold text-2xl tracking-tight">How to build it</h2>
        <p className="mt-3 max-w-2xl text-zinc-800 dark:text-zinc-300 text-sm leading-6">
          The demo is a miniature version of what the experiment catalog does: hold a list
          in memory, filter it in the browser, and decide whether that filter should
          re-run on every render.
        </p>

        <div className="space-y-10 mt-8 max-w-3xl">
          <div>
            <p className="mb-2 font-medium text-sm">
              1. Filter on every render (no memo)
            </p>
            <CodeBlock
              filename="search-list-raw.tsx"
              tone="elevated"
              code={rawSnippet}
              highlightLines={[11, 12, 13, 14]}
            />
            <div className="space-y-3 mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <p>
                Any <code className={buildInlineCodeClassName}>useState</code> update
                re-renders the component. The{" "}
                <BuildHighlight>
                  <code className={buildInlineCodeClassName}>.filter()</code> sits in the
                  render body
                </BuildHighlight>
                , so it runs again even when only{" "}
                <code className={buildInlineCodeClassName}>clicks</code> changed. The
                result is still correct — you just paid for work you did not need.
              </p>
              <p>
                That is the whole client-side story: once you are past{" "}
                <code className={buildInlineCodeClassName}>&quot;use client&quot;</code>,
                you are in <BuildHighlight>React re-render land</BuildHighlight>. Next.js
                does not skip those re-renders for you.
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">2. Memoize the derived list</p>
            <CodeBlock
              filename="search-list-memo.tsx"
              tone="elevated"
              code={memoSnippet}
              highlightLines={[11, 12, 13, 14, 15]}
            />
            <div className="space-y-3 mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <p>
                <BuildHighlight>
                  <code className={buildInlineCodeClassName}>useMemo</code> stores the
                  last filtered array
                </BuildHighlight>{" "}
                and returns it again while{" "}
                <code className={buildInlineCodeClassName}>query</code> stays the same.
                Unrelated state can still re-render the UI (the button label updates)
                without re-filtering.
              </p>
              <p>
                Put every value the calculation reads into the{" "}
                <BuildHighlight>dependency array</BuildHighlight>. Miss a dep and you
                cache a stale result; include an unstable identity every render and you
                gain nothing.
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              3. Same pattern as this playground&apos;s catalog
            </p>
            <CodeBlock
              filename="components/experiment-catalog.tsx"
              tone="elevated"
              code={catalogSnippet}
              highlightLines={[2, 3, 4, 5, 6, 7, 8, 9]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              The home page is a Server Component that loads the full experiment metadata
              from <code className={buildInlineCodeClassName}>lib/experiments.ts</code>{" "}
              and passes it as props.{" "}
              <code className={buildInlineCodeClassName}>ExperimentCatalog</code> is a
              client component: search, group, and tag filters live in{" "}
              <code className={buildInlineCodeClassName}>useState</code>, and the visible
              rows are derived with{" "}
              <BuildHighlight>
                <code className={buildInlineCodeClassName}>useMemo</code>
              </BuildHighlight>
              . At lab scale (~100 entries) shipping the whole list to the browser is
              intentional and fine.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              4. Different world: URL + server / DB filtering
            </p>
            <CodeBlock
              filename="app/search/page.tsx"
              tone="elevated"
              code={serverSnippet}
              highlightLines={[7, 8]}
            />
            <div className="space-y-3 mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <p>
                If the source of truth is a database and filters live in the URL (
                <code className={buildInlineCodeClassName}>?q=</code>
                ), the server returns the already-filtered page. You typically do{" "}
                <BuildHighlight>not memoize a local filter</BuildHighlight> — there is no
                full list in memory to derive from.
              </p>
              <p>
                Optimize that path differently:{" "}
                <BuildHighlight>debounce, transitions, and fetch caching</BuildHighlight>{" "}
                — network and UX concerns, not &quot;did my filter re-run on an unrelated
                click.&quot;
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">5. React Compiler footnote</p>
            <p className="text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              React Compiler can auto-memoize many derived values so you write fewer
              manual <code className={buildInlineCodeClassName}>useMemo</code> calls. This
              repo does not enable it in{" "}
              <code className={buildInlineCodeClassName}>next.config.ts</code> yet — so
              the catalog and this demo reason about classic React rules on purpose.
            </p>
          </div>
        </div>
      </ExperimentBuildSection>
    </main>
  );
}
