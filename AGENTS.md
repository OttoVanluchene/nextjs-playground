<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Next.js Playground — agent guide

Personal learning lab for small, finished Next.js experiments. The home page is a searchable catalog built from a typed registry in `lib/experiments.ts` — not JSON, not filesystem discovery.

To create or finish an experiment, use the **newexp** skill (`.cursor/skills/newexp`).

## Stack & commands

- Next.js App Router + TypeScript + Tailwind + shadcn/ui
- Package manager: `pnpm`
- `pnpm dev` — local server
- `pnpm lint` / `pnpm build` — required before calling an experiment done

Human reference UI: `/admin/template`. Working example: `/experiments/ui/dialog-basics`.

## Project layout

| Path                                | Role                                                          |
| ----------------------------------- | ------------------------------------------------------------- |
| `lib/experiments.ts`                | Source of truth: groups, experiments, colors, catalog helpers |
| `components/experiment-catalog.tsx` | Client catalog (search + filters)                             |
| `app/page.tsx`                      | Home — loads registry, passes props to catalog                |
| `app/experiments/{group}/{slug}/`   | Experiment routes                                             |
| `app/admin/template/`               | How-to page for adding experiments                            |

## Architecture

- **Registry-driven catalog:** `lib/experiments.ts` owns groups and experiment metadata. Routes live under `app/experiments/{group}/{slug}/`; only registered entry pages appear on the home index.
- **Home → catalog:** the server page loads the full metadata list and passes it to `ExperimentCatalog`. Filtering (search, group, tag) is client state in that component — not URL-driven.
- **Scale:** at ~100 experiments, shipping the full metadata array to the client is intentional and fine.
- **Group colors:** each group has a stable `color` token (`blue` | `emerald` | `amber` | `rose` | `violet` | `cyan` | `orange` | `lime`). Badge/filter classes come from `getGroupColorClasses(group)` — do not derive color from `order`.
