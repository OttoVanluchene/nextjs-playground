import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, GitBranch, GitPullRequestArrow, Sparkles } from "lucide-react";

import { CodeBlock } from "@/components/code-block";
import { ExperimentBackLink } from "@/components/experiment-back-link";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_EXPERIMENT_AUTHOR } from "@/lib/experiments";

export const metadata: Metadata = {
  title: "How to add an experiment",
  description: "Clone the playground, use the newexp skill, then commit and open a PR.",
};

const cloneSnippet = `git clone https://github.com/OttoVanluchene/nextjs-playground.git
cd nextjs-playground
pnpm install
pnpm dev`;

export default function HowToAddPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto px-5 sm:px-8 pt-3 sm:pt-4 pb-12 sm:pb-16 max-w-6xl">
        <ExperimentBackLink />

        <div className="mt-6 max-w-2xl">
          <h1 className="font-semibold text-4xl sm:text-5xl text-balance tracking-tight">
            How to add an experiment
          </h1>
          <p className="mt-4 text-muted-foreground text-lg leading-8">
            Short path: clone the repo, ask Cursor to run the{" "}
            <Badge variant="outline" className="font-mono text-xs align-middle">
              newexp
            </Badge>{" "}
            skill, then commit and open a pull request. The skill scaffolds the route,
            How-to-build section, and catalog entry.
          </p>
        </div>

        <ol className="space-y-8 mt-10 max-w-2xl">
          <li className="space-y-3">
            <div className="flex items-center gap-2">
              <GitBranch className="size-4 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-semibold text-xl tracking-tight">1. Clone the repo</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              Get a local copy, install dependencies, and start the dev server.
            </p>
            <CodeBlock filename="terminal" code={cloneSnippet} language="bash" />
          </li>

          <li className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-semibold text-xl tracking-tight">
                2. Use the <span className="font-mono text-lg">newexp</span> skill
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              In Cursor, ask the agent to use the{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                newexp
              </code>{" "}
              skill (lives at{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                .cursor/skills/newexp
              </code>
              ). Example prompt:
            </p>
            <CodeBlock
              filename="ask Cursor"
              code={`/newexp about useMemo - author: Otto Vanluchene`}
              language="text"
            />
          </li>

          <li className="space-y-3">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-semibold text-xl tracking-tight">
                3. What you can pass along
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              Give the agent at least a title, a short plain description, and a slug idea.
              These fields are optional or choosable when you ask:
            </p>
            <ul className="space-y-3 text-muted-foreground text-sm leading-6">
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  group
                </code>{" "}
                — existing slug such as{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  nextjs
                </code>{" "}
                or{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  ui
                </code>
                , or ask for a new group.
              </li>
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  tags
                </code>{" "}
                — short strings for catalog filters (e.g.{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  shadcn
                </code>
                ,{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  performance
                </code>
                ).
              </li>
              <li>
                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                  author
                </code>{" "}
                — optional; defaults to {DEFAULT_EXPERIMENT_AUTHOR} when omitted.
              </li>
            </ul>
          </li>

          <li className="space-y-3">
            <div className="flex items-center gap-2">
              <GitPullRequestArrow
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <h2 className="font-semibold text-xl tracking-tight">
                4. Commit and open a PR
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              When the experiment looks good and{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                pnpm lint
              </code>{" "}
              /{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-xs">
                pnpm build
              </code>{" "}
              pass, commit on a branch and open a pull request against the main repo. You
              can ask Cursor to do that too.
            </p>
            <CodeBlock
              filename="ask Cursor"
              code={`Commit these changes and open a PR to add the experiment.`}
              language="text"
            />
          </li>
        </ol>

        <p className="mt-10 max-w-2xl text-muted-foreground text-sm leading-6">
          Prefer the full manual checklist? See{" "}
          <Link
            href="/admin/template"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            /admin/template
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
