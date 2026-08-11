import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Component, ExternalLink, MousePointerClick } from "lucide-react";

import { DialogDemo } from "./dialog-demo";
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

const experiment = getCatalogExperiment("ui", "dialog-basics");

export const metadata: Metadata = {
  title: experiment?.title ?? "Dialog basics (template example)",
  description:
    experiment?.description ??
    "A shadcn dialog example with a small client-side component.",
};

const installSnippet = `pnpm dlx shadcn@latest add dialog`;

const clientSnippet = `"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button size="lg" />}>
        <Sparkles aria-hidden="true" />
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>A focused client-side interaction</DialogTitle>
          <DialogDescription>
            The dialog primitive handles focus management, Escape to close, and
            the modal layer. This demo component is the only client boundary on
            the page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}`;

const pageSnippet = `import { DialogDemo } from "./dialog-demo";

// page.tsx stays a Server Component — no "use client"
export default function DialogBasicsPage() {
  return (
    <main>
      {/* theory / layout */}
      <DialogDemo />
    </main>
  );
}`;

export default function DialogBasicsPage() {
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
            A small dialog built with shadcn. The page stays on the server; only the
            dialog itself runs in the browser when you open it.
          </p>
          <Link
            href="/admin/template"
            className="inline-flex items-center gap-1.5 mt-4 font-medium text-foreground text-sm hover:underline underline-offset-4"
          >
            How this experiment was added
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="gap-4 grid md:grid-cols-2 mt-10">
          <Card>
            <CardHeader>
              <Component
                className="mb-2 size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <CardTitle>Route stays server-rendered</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              This page has no client directive. It can render the explanatory content
              without sending it all to the browser.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MousePointerClick
                className="mb-2 size-5 text-muted-foreground"
                aria-hidden="true"
              />
              <CardTitle>Dialog is the client boundary</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              The colocated demo component owns the interactive dialog behavior and
              imports the generated shadcn primitive.
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 max-w-xl">
          <CardHeader>
            <CardTitle>Try it</CardTitle>
          </CardHeader>
          <CardContent>
            <DialogDemo />
          </CardContent>
        </Card>
      </div>

      <ExperimentBuildSection>
        <p className="font-mono font-medium text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-[0.18em]">
          Implementation
        </p>
        <h2 className="mt-2 font-semibold text-2xl tracking-tight">How to build it</h2>
        <p className="mt-3 max-w-2xl text-zinc-800 dark:text-zinc-300 text-sm leading-6">
          Walkthrough of the pieces below — what each file does, and why the boundary
          between server page and client dialog is drawn this way.
        </p>

        <div className="space-y-10 mt-8 max-w-3xl">
          <div>
            <p className="mb-2 font-medium text-sm">1. Add the shadcn dialog</p>
            <CodeBlock
              filename="terminal"
              language="bash"
              tone="elevated"
              code={installSnippet}
              highlightLines={[1]}
            />
            <p className="mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              We use the <BuildHighlight>shadcn CLI</BuildHighlight> instead of
              hand-rolling a modal. The generated{" "}
              <code className={inlineCodeClassName}>components/ui/dialog.tsx</code> wraps
              an accessible dialog primitive (focus trap, Escape to close, overlay click).
              That means the experiment can teach composition — trigger, content, header,
              footer — without reimplementing a11y from scratch.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              2. Create the client demo next to the page
            </p>
            <CodeBlock
              filename="app/experiments/ui/dialog-basics/dialog-demo.tsx"
              tone="elevated"
              code={clientSnippet}
              highlightLines={[1, 49, 50, 51]}
            />
            <div className="space-y-3 mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <p>
                <BuildHighlight>
                  <code className={inlineCodeClassName}>&quot;use client&quot;</code> is
                  required
                </BuildHighlight>{" "}
                because the dialog opens from a click and needs browser event handlers.
                Putting that directive on the whole{" "}
                <code className={inlineCodeClassName}>page.tsx</code> would force the
                title, copy, and theory cards into the client bundle too — so we{" "}
                <BuildHighlight>isolate interactivity</BuildHighlight> in this small
                colocated file instead.
              </p>
              <p>
                <code className={inlineCodeClassName}>DialogTrigger</code> uses{" "}
                <code className={inlineCodeClassName}>
                  render={'{<Button size="lg" />}'}
                </code>{" "}
                so the trigger stays a real{" "}
                <code className={inlineCodeClassName}>Button</code> (styles + keyboard
                behavior) while the dialog library wires open/close. Nesting{" "}
                <code className={inlineCodeClassName}>DialogHeader</code> /{" "}
                <code className={inlineCodeClassName}>DialogTitle</code> /{" "}
                <code className={inlineCodeClassName}>DialogDescription</code> gives the
                overlay a proper accessible name and description — screen readers announce
                those, not just a blank panel.
              </p>
              <p>
                <code className={inlineCodeClassName}>DialogFooter showCloseButton</code>{" "}
                adds an explicit close control. Escape and overlay click already work; the
                footer button makes the same action discoverable for pointer users.
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium text-sm">
              3. Keep the route server-rendered and import the demo
            </p>
            <CodeBlock
              filename="app/experiments/ui/dialog-basics/page.tsx"
              tone="elevated"
              code={pageSnippet}
              highlightLines={[3, 8]}
            />
            <div className="space-y-3 mt-3 text-zinc-800 dark:text-zinc-300 text-sm leading-6">
              <p>
                The page itself has{" "}
                <BuildHighlight>no &quot;use client&quot;</BuildHighlight>. In the App
                Router, Server Components are the default: they can fetch registry
                metadata, render static explanation, and ship less JavaScript. Importing{" "}
                <code className={inlineCodeClassName}>DialogDemo</code> creates a{" "}
                <BuildHighlight>client boundary only around that subtree</BuildHighlight>{" "}
                — the rest of the page stays on the server.
              </p>
              <p>
                That split is the whole lesson: treat the page as the shell and docs, and
                push event-driven UI into the smallest client leaf that needs it. When you
                add more experiments, copy this shape — server{" "}
                <code className={inlineCodeClassName}>page.tsx</code> + colocated{" "}
                <code className={inlineCodeClassName}>*-demo.tsx</code> — unless the whole
                route truly must be interactive.
              </p>
            </div>
          </div>
        </div>
      </ExperimentBuildSection>
    </main>
  );
}
