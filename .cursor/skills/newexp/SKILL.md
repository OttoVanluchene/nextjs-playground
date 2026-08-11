---
name: newexp
description: >-
  Create and register a new Next.js Playground experiment: route, client demo,
  How-to-build section, group setup, and catalog entry in lib/experiments.ts.
  Use when adding a new experiment, scaffolding an experiment route, registering
  in the catalog, or finishing an unfinished experiment.
---

# New experiment (newexp)

Human reference UI: `/admin/template`. Working example: `/experiments/ui/dialog-basics`.

Copy this checklist and track progress:

```
Progress:
- [ ] Group exists (or added)
- [ ] Route created
- [ ] How-to-build section done
- [ ] Registered in lib/experiments.ts
- [ ] Finish checklist passed
```

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

Classes for badges and filter buttons come from `getGroupColorClasses(group)`. Reordering groups must not change colors — the token owns that.

## Experiments

### 1. Create the route

```text
app/experiments/{group}/{slug}/page.tsx
```

`group` and `slug` must match the registry entry you will add.

- Prefer a Server Component page.
- Put interactivity in a colocated `"use client"` file (see `dialog-demo.tsx`).
- Prefer pulling title/description/group badge from the registry via `getCatalogExperiment(group, slug)` and `getGroupColorClasses`, so catalog and page stay in sync.
- **Intro / subtitle:** keep the opening paragraph under the title plain and concrete. Say what the experiment does in everyday language (1–3 short sentences). No jargon stacks, no “demonstrates an accessible focused client-side interaction” style. Detail belongs in theory cards and the How-to-build section.
- Include a **How to build it** section with real `CodeBlock` snippets (commands + key files). Demo + theory alone is not enough — use `components/code-block.tsx`.
- Put that section in `ExperimentBuildSection` — a full-bleed grey band (light grey in light mode, dark grey in dark mode) that separates implementation from the theory/demo content above.
- Write for a learner: after each code block, explain what the code does and **why** those choices were made (boundaries, APIs, a11y, file layout). Assume the reader wants to understand the code fully, not just copy it.
- **Highlight the takeaways:** In How-to-build, make the important bits easy to spot.
  - Code: pass `highlightLines={[…]}` (1-based) on `CodeBlock` for the lines that teach the lesson.
  - Prose: wrap the key phrase in `BuildHighlight` from `components/build-highlight.tsx` (amber mark). Do not highlight whole paragraphs — only the idea the reader should remember from that step.

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
  description:
    "A small shadcn dialog — server page, client dialog only where clicks happen.",
  group: "ui",
  tags: ["shadcn", "accessibility", "dialog"],
  publishedAt: "2026-08-11T14:30Z", // ISO UTC to minute; catalog shows date only
  // author optional — defaults to Otto Vanluchene
},
```

Rules:

- One catalog entry per experiment (the entry route only).
- `group` must already exist in `experimentGroups`.
- Registry `description` and the page intro paragraph should stay short and plain (same bar as the subtitle rule above).
- Leave unfinished routes unregistered — they stay off the index.
- The registry validates duplicate group slugs, unknown groups, and duplicate paths on import/build.

### 4. Finish checklist

- [ ] Route works at `/experiments/{group}/{slug}`
- [ ] Registry entry exists (entry page only for multi-page flows)
- [ ] Group badge uses `getGroupColorClasses` when showing group on the page
- [ ] Page includes a **How to build it** section in `ExperimentBuildSection` (full-bleed grey band) with code blocks
- [ ] Each build step explains what/why for a learner (not just bare snippets)
- [ ] Key lines use `CodeBlock` `highlightLines`; key phrases use `BuildHighlight`
- [ ] Verification from `AGENTS.md`: `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build` all pass
