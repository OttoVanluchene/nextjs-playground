<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Next.js Playground — agent guide

Personal learning lab for small, finished Next.js experiments. The home page is a searchable catalog built from a typed registry in `lib/experiments.ts` — not JSON, not filesystem discovery.

## Stack & commands

- Next.js App Router + TypeScript + Tailwind + shadcn/ui
- Package manager: `pnpm`
- `pnpm dev` — local server
- `pnpm lint` / `pnpm build` — required before calling an experiment done

Human reference UI: `/admin/template`. Working example: `/experiments/ui/dialog-basics`.

## Project layout that matters

| Path                                | Role                                                          |
| ----------------------------------- | ------------------------------------------------------------- |
| `lib/experiments.ts`                | Source of truth: groups, experiments, colors, catalog helpers |
| `components/experiment-catalog.tsx` | Client catalog (search + filters)                             |
| `app/page.tsx`                      | Home — loads registry, passes props to catalog                |
| `app/experiments/{group}/{slug}/`   | Experiment routes                                             |
| `app/admin/template/`               | How-to page for adding experiments                            |

## Groups

Add a group only when you need a new category. Edit `experimentGroups` in `lib/experiments.ts`:

```ts
{
  slug: "ui",           // URL segment: /experiments/ui/...
  name: "UI & Design",  // shown in filters + badges
  description: "...",
  order: 2,             // catalog filter order only
  color: "emerald",     // stable token — do not derive from order
},
```

`color` must be one of: `blue` | `emerald` | `amber` | `rose` | `violet` | `cyan` | `orange` | `lime`.

Classes for badges, card accents, and filter buttons come from `getGroupColorClasses(group)`. Reordering groups must not change colors — the token owns that.

## Experiments

### 1. Create the route

```text
app/experiments/{group}/{slug}/page.tsx
```

`group` and `slug` must match the registry entry you will add.

- Prefer a Server Component page.
- Put interactivity in a colocated `"use client"` file (see `dialog-demo.tsx`).
- Prefer pulling title/description/group badge from the registry via `getCatalogExperiment(group, slug)` and `getGroupColorClasses`, so catalog and page stay in sync.

### 2. Multi-page experiments

An experiment may contain nested routes, layouts, or helper pages under its folder:

```text
app/experiments/ui/checkout-flow/page.tsx          ← entry (register this)
app/experiments/ui/checkout-flow/review/page.tsx   ← internal step (do not register)
app/experiments/ui/checkout-flow/confirm/page.tsx  ← internal step (do not register)
```

**Only register the entry page** in `experiments`. The catalog links to that one URL (`/experiments/{group}/{slug}`). Internal pages are reached from within the experiment, not from the home index.

### 3. Register when ready

Add one entry to `experiments` in `lib/experiments.ts`:

```ts
{
  slug: "dialog-basics",
  title: "Dialog basics (template example)",
  description: "A focused example of accessible dialog composition with shadcn.",
  group: "ui",
  tags: ["shadcn", "accessibility", "dialog"],
  publishedAt: "2026-08-11", // YYYY-MM-DD, UTC date for sorting
},
```

Rules:

- One catalog entry per experiment (the entry route only).
- `group` must already exist in `experimentGroups`.
- Leave unfinished routes unregistered — they stay off the index.
- The registry validates duplicate group slugs, unknown groups, and duplicate paths on import/build.

### 4. Finish checklist

- [ ] Route works at `/experiments/{group}/{slug}`
- [ ] Registry entry exists (entry page only for multi-page flows)
- [ ] Group badge uses `getGroupColorClasses` when showing group on the page
- [ ] `pnpm lint` and `pnpm build` pass

## Catalog behavior (do not reinvent)

- Home server-loads the full metadata list and passes it to `ExperimentCatalog`.
- Filtering (search, group, tag) is client state in that component — not URL-driven.
- At the scale of this lab (~100 experiments), shipping the full metadata array to the client is intentional and fine.
