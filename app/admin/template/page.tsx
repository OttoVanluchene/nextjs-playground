import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FilePlus2,
  FolderPlus,
} from "lucide-react";

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
},`;

const experimentSnippet = `{
  slug: "dialog-basics",
  title: "Dialog basics (template example)",
  description: "A focused example of accessible dialog composition with shadcn.",
  group: "ui",
  tags: ["shadcn", "accessibility", "dialog"],
  publishedAt: "2026-08-11",
},`;

const pageSnippet = `import type { Metadata } from "next";
import Link from "next/link";

import { DialogDemo } from "./dialog-demo";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dialog basics (template example)",
  description: "A shadcn dialog example with a small client-side component.",
};

export default function DialogBasicsPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto px-5 sm:px-8 py-12 sm:py-16 max-w-6xl">
        <Link href="/">Back to experiment index</Link>

        <Badge variant="secondary">UI & Design</Badge>
        <h1>Dialog basics (template example)</h1>
        <p>
          A compact shadcn dialog example that demonstrates an accessible,
          focused client-side interaction inside a server-rendered route.
        </p>

        <Link href="/admin/template">How this experiment was added</Link>

        <DialogDemo />
      </div>
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
      <div className="mx-auto px-5 sm:px-8 py-12 sm:py-16 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to experiment index
        </Link>

        <div className="mt-10 max-w-2xl">
          <Badge variant="secondary">Unlisted reference</Badge>
          <h1 className="mt-4 font-semibold text-4xl sm:text-5xl text-balance tracking-tight">
            Add an experiment or group
          </h1>
          <p className="mt-5 text-muted-foreground text-lg leading-8">
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

function CodeBlock({
  code,
  filename,
  language = "ts",
}: {
  code: string;
  filename?: string;
  language?: "path" | "ts";
}) {
  return (
    <div className="bg-muted/60 border border-border rounded-lg overflow-hidden">
      {filename ? (
        <div className="px-4 py-2 border-border border-b font-mono text-[11px] text-muted-foreground">
          {filename}
        </div>
      ) : null}
      <pre className="p-4 overflow-x-auto text-foreground text-xs leading-6">
        <code data-language={language}>{code}</code>
      </pre>
    </div>
  );
}
