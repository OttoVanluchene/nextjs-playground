import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Component, ExternalLink, MousePointerClick } from "lucide-react";

import { DialogDemo } from "./dialog-demo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dialog basics (template example)",
  description: "A shadcn dialog example with a small client-side component.",
};

export default function DialogBasicsPage() {
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
          <Badge variant="secondary">UI &amp; Design</Badge>
          <h1 className="mt-4 font-semibold text-4xl sm:text-5xl text-balance tracking-tight">
            Dialog basics (template example)
          </h1>
          <p className="mt-5 text-muted-foreground text-lg leading-8">
            A compact shadcn dialog example that demonstrates an accessible, focused
            client-side interaction inside a server-rendered route.
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
    </main>
  );
}
