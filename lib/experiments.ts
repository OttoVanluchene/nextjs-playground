export type GroupColor =
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "cyan"
  | "orange"
  | "lime";

export type ExperimentGroup = {
  slug: string;
  name: string;
  description: string;
  order: number;
  color: GroupColor;
};

export const experimentGroups = [
  {
    slug: "nextjs",
    name: "Next.js",
    description: "App Router, rendering, routing, and framework fundamentals.",
    order: 1,
    color: "blue",
  },
  {
    slug: "ui",
    name: "UI & Design",
    description: "Components, layouts, motion, and styling experiments.",
    order: 2,
    color: "emerald",
  },
] as const satisfies readonly ExperimentGroup[];

export type ExperimentGroupSlug = (typeof experimentGroups)[number]["slug"];

export const DEFAULT_EXPERIMENT_AUTHOR = "Otto Vanluchene";

export type Experiment = {
  slug: string;
  title: string;
  description: string;
  group: ExperimentGroupSlug;
  tags: readonly string[];
  publishedAt: string;
  /** Defaults to {@link DEFAULT_EXPERIMENT_AUTHOR} when omitted. */
  author?: string;
};

export const experiments = [
  {
    slug: "dialog-basics",
    title: "Dialog basics (template example)",
    description:
      "A small shadcn dialog — server page, client dialog only where clicks happen.",
    group: "ui",
    tags: ["shadcn", "accessibility", "dialog"],
    publishedAt: "2026-08-11T10:00Z",
  },
  {
    slug: "usememo-basics",
    title: "useMemo basics",
    description: "Keep filtered lists from rebuilding on every client re-render.",
    group: "nextjs",
    tags: ["react", "performance", "client"],
    publishedAt: "2026-08-11T14:30Z",
  },
] as const satisfies readonly Experiment[];

export type CatalogExperiment = Omit<Experiment, "author"> & {
  groupInfo: ExperimentGroup;
  author: string;
};

const GROUP_COLOR_CLASSES = {
  blue: {
    badge:
      "border-blue-500/35 bg-blue-500/15 text-blue-700 dark:border-blue-400/35 dark:bg-blue-400/15 dark:text-blue-300",
    button:
      "border-blue-500/40 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 dark:border-blue-400/40 dark:bg-blue-400/10 dark:text-blue-300 dark:hover:bg-blue-400/20",
    buttonSelected:
      "border-blue-500/55 bg-blue-500/25 text-blue-800 hover:bg-blue-500/30 dark:border-blue-400/55 dark:bg-blue-400/25 dark:text-blue-200 dark:hover:bg-blue-400/30",
  },
  emerald: {
    badge:
      "border-emerald-500/35 bg-emerald-500/15 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-400/15 dark:text-emerald-300",
    button:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:bg-emerald-400/20",
    buttonSelected:
      "border-emerald-500/55 bg-emerald-500/25 text-emerald-800 hover:bg-emerald-500/30 dark:border-emerald-400/55 dark:bg-emerald-400/25 dark:text-emerald-200 dark:hover:bg-emerald-400/30",
  },
  amber: {
    badge:
      "border-amber-500/35 bg-amber-500/15 text-amber-800 dark:border-amber-400/35 dark:bg-amber-400/15 dark:text-amber-300",
    button:
      "border-amber-500/40 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20",
    buttonSelected:
      "border-amber-500/55 bg-amber-500/25 text-amber-900 hover:bg-amber-500/30 dark:border-amber-400/55 dark:bg-amber-400/25 dark:text-amber-200 dark:hover:bg-amber-400/30",
  },
  rose: {
    badge:
      "border-rose-500/35 bg-rose-500/15 text-rose-700 dark:border-rose-400/35 dark:bg-rose-400/15 dark:text-rose-300",
    button:
      "border-rose-500/40 bg-rose-500/10 text-rose-700 hover:bg-rose-500/20 dark:border-rose-400/40 dark:bg-rose-400/10 dark:text-rose-300 dark:hover:bg-rose-400/20",
    buttonSelected:
      "border-rose-500/55 bg-rose-500/25 text-rose-800 hover:bg-rose-500/30 dark:border-rose-400/55 dark:bg-rose-400/25 dark:text-rose-200 dark:hover:bg-rose-400/30",
  },
  violet: {
    badge:
      "border-violet-500/35 bg-violet-500/15 text-violet-700 dark:border-violet-400/35 dark:bg-violet-400/15 dark:text-violet-300",
    button:
      "border-violet-500/40 bg-violet-500/10 text-violet-700 hover:bg-violet-500/20 dark:border-violet-400/40 dark:bg-violet-400/10 dark:text-violet-300 dark:hover:bg-violet-400/20",
    buttonSelected:
      "border-violet-500/55 bg-violet-500/25 text-violet-800 hover:bg-violet-500/30 dark:border-violet-400/55 dark:bg-violet-400/25 dark:text-violet-200 dark:hover:bg-violet-400/30",
  },
  cyan: {
    badge:
      "border-cyan-500/35 bg-cyan-500/15 text-cyan-800 dark:border-cyan-400/35 dark:bg-cyan-400/15 dark:text-cyan-300",
    button:
      "border-cyan-500/40 bg-cyan-500/10 text-cyan-800 hover:bg-cyan-500/20 dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-300 dark:hover:bg-cyan-400/20",
    buttonSelected:
      "border-cyan-500/55 bg-cyan-500/25 text-cyan-900 hover:bg-cyan-500/30 dark:border-cyan-400/55 dark:bg-cyan-400/25 dark:text-cyan-200 dark:hover:bg-cyan-400/30",
  },
  orange: {
    badge:
      "border-orange-500/35 bg-orange-500/15 text-orange-800 dark:border-orange-400/35 dark:bg-orange-400/15 dark:text-orange-300",
    button:
      "border-orange-500/40 bg-orange-500/10 text-orange-800 hover:bg-orange-500/20 dark:border-orange-400/40 dark:bg-orange-400/10 dark:text-orange-300 dark:hover:bg-orange-400/20",
    buttonSelected:
      "border-orange-500/55 bg-orange-500/25 text-orange-900 hover:bg-orange-500/30 dark:border-orange-400/55 dark:bg-orange-400/25 dark:text-orange-200 dark:hover:bg-orange-400/30",
  },
  lime: {
    badge:
      "border-lime-500/35 bg-lime-500/15 text-lime-800 dark:border-lime-400/35 dark:bg-lime-400/15 dark:text-lime-300",
    button:
      "border-lime-500/40 bg-lime-500/10 text-lime-800 hover:bg-lime-500/20 dark:border-lime-400/40 dark:bg-lime-400/10 dark:text-lime-300 dark:hover:bg-lime-400/20",
    buttonSelected:
      "border-lime-500/55 bg-lime-500/25 text-lime-900 hover:bg-lime-500/30 dark:border-lime-400/55 dark:bg-lime-400/25 dark:text-lime-200 dark:hover:bg-lime-400/30",
  },
} as const satisfies Record<
  GroupColor,
  {
    badge: string;
    button: string;
    buttonSelected: string;
  }
>;

export type GroupColorClasses = (typeof GROUP_COLOR_CLASSES)[GroupColor];

export function getGroupColorClasses(
  group: Pick<ExperimentGroup, "color">,
): GroupColorClasses {
  return GROUP_COLOR_CLASSES[group.color];
}

export function getExperimentHref({ group, slug }: Pick<Experiment, "group" | "slug">) {
  return `/experiments/${group}/${slug}`;
}

export function formatExperimentDate(publishedAt: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(publishedAt));
}

function validateCatalog() {
  const groupSlugs = experimentGroups.map((group) => group.slug);
  const duplicateGroup = groupSlugs.find(
    (slug, index) => groupSlugs.indexOf(slug) !== index,
  );

  if (duplicateGroup) {
    throw new Error(`Duplicate experiment group slug: ${duplicateGroup}`);
  }

  const knownGroups = new Set(groupSlugs);
  for (const experiment of experiments) {
    if (!knownGroups.has(experiment.group)) {
      throw new Error(
        `Experiment \"${experiment.slug}\" references an unknown group: ${experiment.group}`,
      );
    }
  }

  const paths = experiments.map(getExperimentHref);
  const duplicatePath = paths.find((path, index) => paths.indexOf(path) !== index);

  if (duplicatePath) {
    throw new Error(`Duplicate experiment path: ${duplicatePath}`);
  }
}

validateCatalog();

function resolveExperimentAuthor(experiment: Experiment): string {
  // `as const satisfies` omits unused optional keys from the literal type;
  // widen to Experiment so optional `author` is readable.
  return experiment.author ?? DEFAULT_EXPERIMENT_AUTHOR;
}

export function getCatalogExperiments(): CatalogExperiment[] {
  const groupsBySlug = new Map(experimentGroups.map((group) => [group.slug, group]));

  return [...experiments]
    .sort((first, second) => second.publishedAt.localeCompare(first.publishedAt))
    .map((experiment) => ({
      ...experiment,
      author: resolveExperimentAuthor(experiment),
      groupInfo: groupsBySlug.get(experiment.group)!,
    }));
}

export function getCatalogExperiment(
  group: string,
  slug: string,
): CatalogExperiment | undefined {
  return getCatalogExperiments().find(
    (experiment) => experiment.group === group && experiment.slug === slug,
  );
}
