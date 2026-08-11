# Next.js Playground

A personal learning lab for small, finished Next.js experiments. The home page is a searchable index generated from a typed registry.

## Run it

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The standard scaffold commands remain available:

```bash
pnpm lint
pnpm build
pnpm start
```

## Add a finished experiment

1. Create an App Router page at `app/experiments/{group}/{slug}/page.tsx`.
2. Add one matching entry to `experiments` in `lib/experiments.ts`.
3. If it needs browser state, events, or browser APIs, keep that code in a small colocated component starting with `"use client"`.
4. Run `pnpm lint` and `pnpm build`.

The registry validates duplicate group slugs and generated experiment paths during imports and builds. Routes that are still unfinished can exist without being registered; they remain hidden from the index until they are ready.

## Included example

`/experiments/ui/dialog-basics` is a template-style shadcn dialog experiment. Use it as the reference for a small, finished catalog entry.
