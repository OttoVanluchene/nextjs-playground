import Link from "next/link";
import { notFound } from "next/navigation";
import { Link2, MoveHorizontal, RectangleHorizontal } from "lucide-react";

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

const experiment = getCatalogExperiment("nextjs", "loading-skeleton");

const installSnippet = `pnpm dlx shadcn@latest add skeleton`;

const loadingSnippet = `import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card aria-busy="true" aria-live="polite">
      <CardHeader className="border-b">
        <div className="flex justify-between gap-3">
          <Skeleton className="w-36 h-5" />
          <Skeleton className="rounded-full w-14 h-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between gap-4">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-28 h-4" />
        </div>
        {/* more field rows… */}
      </CardContent>
      <span className="sr-only">Loading…</span>
    </Card>
  );
}`;

type LoadingSkeletonShellProps = {
  children: React.ReactNode;
};

export function LoadingSkeletonShell({ children }: LoadingSkeletonShellProps) {
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
            Same billing shell as the spinner demo — stats and the recent list show
            immediately. Only the nested invoice segment is slow; its{" "}
            <code className={inlineCodeClassName}>loading.tsx</code> paints a ghost of
            that card while it streams in. Suspense wiring is covered in{" "}
            <Link
              href="/experiments/nextjs/loading-spinner"
              className="font-medium text-foreground hover:underline underline-offset-4"
            >
              Suspense - loading.js with a spinner
            </Link>
            ; this page is about a nicer fallback.
          </p>
        </div>

        <div className="gap-4 grid md:grid-cols-3 mt-10">
          <Card>
            <CardHeader>
              <RectangleHorizontal
                className="mb-2 size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <CardTitle>Skeleton mirrors the UI</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              Match the finished layout: header, chips, field rows. Pulse blocks hint at
              content without inventing fake numbers.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MoveHorizontal
                className="mb-2 size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <CardTitle>Less layout shift</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              A shape-matched skeleton keeps width and rhythm stable when the real card
              arrives — usually smoother than a lone centered spinner.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Link2 className="mb-2 size-5 text-muted-foreground" aria-hidden="true" />
              <CardTitle>Same loading.tsx boundary</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              Folders, awaits, and multi-segment Suspense are unchanged — see{" "}
              <Link
                href="/experiments/nextjs/loading-spinner"
                className="font-medium text-foreground hover:underline underline-offset-4"
              >
                the spinner experiment
              </Link>{" "}
              for that walkthrough. Here you only swap the fallback UI.
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
          Same route / <code className={buildInlineCodeClassName}>loading.tsx</code> model
          as{" "}
          <Link
            href="/experiments/nextjs/loading-spinner"
            className="font-medium text-zinc-950 dark:text-zinc-50 hover:underline underline-offset-4"
          >
            Suspense - loading.js with a spinner
          </Link>
          . Read that for folder structure, where to{" "}
          <code className={buildInlineCodeClassName}>await</code>, parent layouts, and
          multi-component patterns. Below is only the nicer fallback.
        </p>

        <div className="space-y-10 mt-8 max-w-3xl">
          <div>
            <p className="mb-2 font-medium text-sm">1. Add a skeleton primitive</p>
            <CodeBlock
              filename="terminal"
              language="bash"
              tone="elevated"
              code={installSnippet}
              highlightLines={[1]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              A pulsing muted block is enough. Compose several into the shape of your real
              UI instead of inventing a one-off loading graphic.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              2. Mirror the finished UI in{" "}
              <code className={buildInlineCodeClassName}>loading.tsx</code>
            </p>
            <CodeBlock
              filename="app/dashboard/invoice/loading.tsx"
              tone="elevated"
              code={loadingSnippet}
              highlightLines={[5, 8, 9]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <BuildHighlight>Same chrome as the finished view</BuildHighlight>, with
              skeleton bars where titles, badges, and fields will sit. Matching structure
              keeps width and rhythm stable when the page resolves — a clearer loading
              indication than a spinner floating in an empty slot.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              3. Explicit <code className={buildInlineCodeClassName}>Suspense</code>? Same
              skeleton
            </p>
            <p className="text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              If you stay on one page without nested{" "}
              <code className={buildInlineCodeClassName}>loading.tsx</code> files, pass
              that skeleton component as{" "}
              <code className={buildInlineCodeClassName}>fallback</code> on each{" "}
              <code className={buildInlineCodeClassName}>{"<Suspense>"}</code>. The wiring
              is covered in step 6 of the{" "}
              <Link
                href="/experiments/nextjs/loading-spinner"
                className="font-medium text-zinc-950 dark:text-zinc-50 hover:underline underline-offset-4"
              >
                spinner experiment
              </Link>
              — only the fallback UI changes.
            </p>
          </div>
        </div>
      </ExperimentBuildSection>
    </main>
  );
}
