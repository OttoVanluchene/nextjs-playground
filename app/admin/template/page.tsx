import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ExternalLink, FilePlus2, FolderPlus } from "lucide-react";

import { CodeBlock } from "@/components/code-block";
import { ExperimentBackLink } from "@/components/experiment-back-link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Experiment template",
  description: "A private reference for adding experiment groups and routes.",
};

const groupSnippet = `{
  slug: "ui",
  name: "UI & Design",
  description: "Components, layouts, motion, and styling experiments.",
  order: 2,
  color: "emerald",
},`;

const experimentSnippet = `{
  slug: "dialog-basics",
  title: "Dialog basics (template example)",
  description: "A focused example of accessible dialog composition with shadcn.",
  group: "ui",
  tags: ["shadcn", "accessibility", "dialog"],
  publishedAt: "2026-08-11T10:00Z",
},`;

const pageSnippet = `import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DialogDemo } from "./dialog-demo";
import { ExperimentBackLink } from "@/components/experiment-back-link";
import { ExperimentBuildSection } from "@/components/experiment-build-section";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getCatalogExperiment,
  getGroupColorClasses,
} from "@/lib/experiments";

const experiment = getCatalogExperiment("ui", "dialog-basics");

export const metadata: Metadata = {
  title: experiment?.title ?? "Dialog basics",
  description: experiment?.description ?? "",
};

export default function DialogBasicsPage() {
  if (!experiment) notFound();

  const groupColors = getGroupColorClasses(experiment.groupInfo);

  return (
    <main className="flex-1">
      <div className="mx-auto px-5 sm:px-8 pt-3 sm:pt-4 pb-12 sm:pb-16 max-w-6xl">
        <div className="flex justify-between items-center gap-3">
          <ExperimentBackLink />
          <Badge variant="outline" className={cn(groupColors.badge)}>
            {experiment.groupInfo.name}
          </Badge>
        </div>

        <div className="mt-6 max-w-2xl">
          <h1>{experiment.title}</h1>
          <p>{experiment.description}</p>

          <Link href="/admin/template">How this experiment was added</Link>
        </div>

        <DialogDemo />
      </div>

      <ExperimentBuildSection>
        <h2>How to build it</h2>
        {/* CodeBlock tone="elevated" + teaching notes per step */}
      </ExperimentBuildSection>
    </main>
  );
}`;

const clientComponentSnippet = `"use client";

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

export default function AdminTemplatePage() {
  return (
    <main className="flex-1">
      <div className="mx-auto px-5 sm:px-8 pt-3 sm:pt-4 pb-12 sm:pb-16 max-w-6xl">
        <div className="flex justify-between items-center gap-3">
          <ExperimentBackLink />
          <Badge variant="secondary">Unlisted reference</Badge>
        </div>

        <div className="mt-6 max-w-2xl">
          <h1 className="font-semibold text-4xl sm:text-5xl text-balance tracking-tight">
            Add an experiment or group
          </h1>
          <p className="mt-4 text-muted-foreground text-lg leading-8">
            A private reference for keeping the catalog and route structure in sync.
            Linked from the dialog template example so you can jump between the finished
            experiment and these steps.
          </p>
        </div>

        <div className="space-y-5 mt-10">
          <Card>
            <CardHeader>
              <div className="place-items-center grid bg-muted mb-2 rounded-lg size-9">
                <FolderPlus className="size-4" aria-hidden="true" />
              </div>
              <CardTitle>1. Add a group when you need one</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground text-sm leading-6">
              <p>
                In{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  lib/experiments.ts
                </code>
                , add a group to
                <code className="bg-muted mx-1 px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  experimentGroups
                </code>
                . Its slug becomes the middle part of every route in that group.
              </p>
              <CodeBlock
                filename="lib/experiments.ts — experimentGroups"
                code={groupSnippet}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="place-items-center grid bg-muted mb-2 rounded-lg size-9">
                <FilePlus2 className="size-4" aria-hidden="true" />
              </div>
              <CardTitle>2. Create the experiment route</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground text-sm leading-6">
              <p>Create the route page using the matching group and experiment slugs:</p>
              <CodeBlock
                code="app/experiments/ui/dialog-basics/page.tsx"
                language="path"
              />
              <p>
                Keep the page as a Server Component by default. The dialog template page
                imports a colocated client demo and otherwise stays server-rendered:
              </p>
              <CodeBlock
                filename="app/experiments/ui/dialog-basics/page.tsx"
                code={pageSnippet}
              />
              <p>
                If only part of the route needs state, event handlers, or browser APIs,
                put that part in a small colocated file that begins with{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  &quot;use client&quot;
                </code>
                :
              </p>
              <CodeBlock
                filename="app/experiments/ui/dialog-basics/dialog-demo.tsx"
                code={clientComponentSnippet}
              />
              <p>
                Every experiment page must include a{" "}
                <strong className="font-medium text-foreground">How to build it</strong>{" "}
                section with real code blocks (install commands, key files, wiring) — not
                only a live demo and theory cards. Wrap it in{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  ExperimentBuildSection
                </code>{" "}
                (full-bleed grey band: light in light mode, dark in dark mode) and reuse{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  CodeBlock
                </code>{" "}
                with{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  tone=&quot;elevated&quot;
                </code>
                . After each block, add short teaching notes: what the code does and why
                that approach was chosen (server/client split, library APIs,
                accessibility). Write for someone learning the pattern, not for someone
                who already knows it.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="place-items-center grid bg-muted mb-2 rounded-lg size-9">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </div>
              <CardTitle>3. Register it when it is ready</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground text-sm leading-6">
              <p>
                Add the completed experiment to{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  experiments
                </code>{" "}
                in
                <code className="bg-muted mx-1 px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  lib/experiments.ts
                </code>
                . It will then automatically appear in search, group filters, and the
                overview.
              </p>
              <CodeBlock
                filename="lib/experiments.ts — experiments"
                code={experimentSnippet}
              />
              <p>
                Leave unfinished routes unregistered. The catalog validates group
                references and duplicate generated paths during development and builds.
              </p>
              <Link
                href="/experiments/ui/dialog-basics"
                className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline underline-offset-4"
              >
                View the complete working example
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        </div>

        <p className="mt-8 text-muted-foreground text-sm leading-6">
          Before considering an experiment complete, run{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
            pnpm lint
          </code>{" "}
          and
          <code className="bg-muted mx-1 px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
            pnpm build
          </code>
          .
        </p>
      </div>
    </main>
  );
}
