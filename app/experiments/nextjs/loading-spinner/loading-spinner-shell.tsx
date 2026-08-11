import Link from "next/link";
import { notFound } from "next/navigation";
import { Folders, LayoutTemplate, Loader2 } from "lucide-react";

import { ReloadButton } from "./reload-button";
import { InvoiceWorkspace } from "@/app/experiments/nextjs/_invoice/invoice-workspace";
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

const experiment = getCatalogExperiment("nextjs", "loading-spinner");

const folderSnippet = `app/dashboard/
  layout.tsx          ← instant shell (nav, chrome) — do not await slow data here
  page.tsx            ← optional index / redirect
  invoice/
    page.tsx          ← await getInvoice() — this segment suspends
    loading.tsx       ← spinner (or skeleton) for this segment only`;

const loadingSnippet = `import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div role="status" aria-live="polite">
      <Loader2 className="size-8 animate-spin" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}`;

const pageSnippet = `export default async function Page() {
  const data = await getSlowData(); // suspends until resolved
  return <Detail data={data} />;
}`;

const layoutSnippet = `export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Shell /> {/* renders immediately — do not await here */}
      {children} {/* invoice/page.tsx, or invoice/loading.tsx while it suspends */}
    </main>
  );
}`;

const multiFolderSnippet = `app/dashboard/
  layout.tsx
  invoice/
    page.tsx
    loading.tsx       ← only the invoice slot
  activity/
    page.tsx
    loading.tsx       ← only the activity slot`;

const multiLoadingSnippet = `// app/dashboard/invoice/loading.tsx
export default function Loading() {
  return <Spinner label="Loading invoice" />;
}

// app/dashboard/activity/loading.tsx
export default function Loading() {
  return <Spinner label="Loading activity" />;
}`;

const explicitSuspenseSnippet = `import { Suspense } from "react";

import { Activity } from "./activity";
import { ActivitySpinner } from "./activity-spinner";
import { Invoice } from "./invoice";
import { InvoiceSpinner } from "./invoice-spinner";

export default function Page() {
  return (
    <>
      <Suspense fallback={<InvoiceSpinner />}>
        <Invoice />
      </Suspense>
      <Suspense fallback={<ActivitySpinner />}>
        <Activity />
      </Suspense>
    </>
  );
}`;

type LoadingSpinnerShellProps = {
  children: React.ReactNode;
};

export function LoadingSpinnerShell({ children }: LoadingSpinnerShellProps) {
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
            <code className={inlineCodeClassName}>loading.tsx</code> Suspense is{" "}
            <span className="font-medium text-foreground">route-level</span>, not
            component-level — it wraps a folder&apos;s{" "}
            <code className={inlineCodeClassName}>page.tsx</code>, not an import. Nest a
            route around the slow UI (here, the invoice) so that segment gets its own
            spinner while the billing shell stays up. Prefer a card-shaped placeholder?
            See{" "}
            <Link
              href="/experiments/nextjs/loading-skeleton"
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              Suspense - loading.js with a skeleton
            </Link>
            .
          </p>
        </div>

        <div className="gap-4 grid md:grid-cols-3 mt-10">
          <Card>
            <CardHeader>
              <Loader2 className="mb-2 size-5 text-muted-foreground" aria-hidden="true" />
              <CardTitle>Route-level, not component-level</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              <code className={inlineCodeClassName}>loading.tsx</code> cannot target an
              arbitrary component. Next attaches it to the route segment — that
              folder&apos;s <code className={inlineCodeClassName}>page.tsx</code> — as the
              Suspense fallback.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <LayoutTemplate
                className="mb-2 size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <CardTitle>Parent layout stays visible</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              The fallback only replaces the nested page slot. Shared chrome in the parent
              layout keeps rendering while the child suspends.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Folders className="mb-2 size-5 text-muted-foreground" aria-hidden="true" />
              <CardTitle>Nest a route around the UI</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              Want a clearer structure for one slow component? Give it a nested folder
              with its own <code className={inlineCodeClassName}>page.tsx</code> +{" "}
              <code className={inlineCodeClassName}>loading.tsx</code>. That is how you
              &quot;wrap&quot; a component with the file convention.
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3 mt-6 max-w-4xl">
          <h2 className="font-medium text-base">Try it</h2>
          <InvoiceWorkspace actions={<ReloadButton />}>{children}</InvoiceWorkspace>
        </div>
      </div>

      <ExperimentBuildSection>
        <p className="font-mono font-medium text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-[0.18em]">
          Implementation
        </p>
        <h2 className="mt-2 font-semibold text-2xl tracking-tight">How to build it</h2>
        <p className="mt-3 max-w-2xl text-zinc-800 dark:text-zinc-300 text-sm leading-6">
          <BuildHighlight>Suspense via loading.tsx is route-level</BuildHighlight>, not
          component-level. Nest a route around the slow UI, put a spinner in that
          segment&apos;s <code className={buildInlineCodeClassName}>loading.tsx</code>,
          and keep shared chrome in the parent layout.
        </p>

        <div className="space-y-10 mt-8 max-w-3xl">
          <div>
            <p className="mb-2 font-medium text-sm">1. Set up the folder structure</p>
            <CodeBlock
              filename="folder structure"
              language="text"
              tone="elevated"
              code={folderSnippet}
              highlightLines={[4, 5, 6]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <BuildHighlight>
                You cannot attach loading.tsx to a component import
              </BuildHighlight>
              — only to a route segment. To give one UI (invoice, sidebar panel, etc.) its
              own spinner with a clear project layout,{" "}
              <BuildHighlight>wrap it in a nested folder</BuildHighlight> with{" "}
              <code className={buildInlineCodeClassName}>page.tsx</code> +{" "}
              <code className={buildInlineCodeClassName}>loading.tsx</code>. That nested
              route is the Suspense boundary; the parent layout stays mounted around it.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">2. Add a spinner fallback</p>
            <CodeBlock
              filename="app/dashboard/invoice/loading.tsx"
              tone="elevated"
              code={loadingSnippet}
              highlightLines={[4, 5, 6, 7]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <BuildHighlight>File name is the API</BuildHighlight> — no imports from the
              page. Next wraps that segment&apos;s{" "}
              <code className={buildInlineCodeClassName}>page.tsx</code> in Suspense and
              uses this component as the fallback. Keep it lightweight so the parent
              layout does not jump when content arrives.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              3. Await data only in the segment{" "}
              <code className={buildInlineCodeClassName}>page.tsx</code>
            </p>
            <CodeBlock
              filename="app/dashboard/invoice/page.tsx"
              tone="elevated"
              code={pageSnippet}
              highlightLines={[2]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <BuildHighlight>The page is what suspends</BuildHighlight>. Any{" "}
              <code className={buildInlineCodeClassName}>await</code> that has not
              resolved yet keeps the Suspense boundary open, so Next keeps showing{" "}
              <code className={buildInlineCodeClassName}>loading.tsx</code>. When the
              promise settles, the real page streams in and replaces the spinner.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              4. Keep shared UI in the parent layout
            </p>
            <CodeBlock
              filename="app/dashboard/layout.tsx"
              tone="elevated"
              code={layoutSnippet}
              highlightLines={[3, 4]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <BuildHighlight>
                Layout owns the shell; children is the nested page slot
              </BuildHighlight>
              . Nav, sidebars, and other chrome that should stay up while data loads
              belong in the parent layout — not behind the same{" "}
              <code className={buildInlineCodeClassName}>await</code> as the invoice page.
              While the child suspends, Next swaps in{" "}
              <code className={buildInlineCodeClassName}>loading.tsx</code> only for{" "}
              <code className={buildInlineCodeClassName}>{"{children}"}</code>.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              5. Multiple components with different data
            </p>
            <CodeBlock
              filename="folder structure"
              language="text"
              tone="elevated"
              code={multiFolderSnippet}
              highlightLines={[4, 5, 7, 8]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              One <code className={buildInlineCodeClassName}>loading.tsx</code> cannot
              target two siblings inside a single{" "}
              <code className={buildInlineCodeClassName}>page.tsx</code>. For separate
              spinners, give each slow UI{" "}
              <BuildHighlight>its own route segment</BuildHighlight> with its own{" "}
              <code className={buildInlineCodeClassName}>loading.tsx</code> (nested
              folders or parallel route slots).
            </p>
            <div className="mt-4">
              <CodeBlock
                filename="invoice/loading.tsx + activity/loading.tsx"
                tone="elevated"
                code={multiLoadingSnippet}
                highlightLines={[2, 3, 7, 8]}
              />
            </div>
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              Each file is that segment&apos;s Suspense fallback — Next wires it
              automatically, no manual{" "}
              <code className={buildInlineCodeClassName}>{"<Suspense>"}</code> around the
              page.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              6. Same page, no nested routes — explicit{" "}
              <code className={buildInlineCodeClassName}>Suspense</code>
            </p>
            <CodeBlock
              filename="app/dashboard/page.tsx"
              tone="elevated"
              code={explicitSuspenseSnippet}
              highlightLines={[10, 11, 12, 13, 14, 15]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              When invoice and activity stay on one{" "}
              <code className={buildInlineCodeClassName}>page.tsx</code> (not nested
              folders), there is{" "}
              <BuildHighlight>no loading.tsx per component</BuildHighlight>. You draw the
              boundaries yourself: wrap each async Server Component in{" "}
              <code className={buildInlineCodeClassName}>{"<Suspense>"}</code> and pass a
              loading component as{" "}
              <code className={buildInlineCodeClassName}>fallback</code> (
              <code className={buildInlineCodeClassName}>InvoiceSpinner</code>,{" "}
              <code className={buildInlineCodeClassName}>ActivitySpinner</code>, etc.).
              Same streaming idea as{" "}
              <code className={buildInlineCodeClassName}>loading.tsx</code> — you own the
              wiring instead of the file convention.
            </p>
          </div>
        </div>
      </ExperimentBuildSection>
    </main>
  );
}
