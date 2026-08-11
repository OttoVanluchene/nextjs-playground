"use client";

import Link from "next/link";
import { Folder, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type CatalogExperiment,
  type ExperimentGroup,
  formatExperimentDate,
  getExperimentHref,
  getGroupColorClasses,
} from "@/lib/experiments";
import { cn } from "@/lib/utils";

type ExperimentCatalogProps = {
  experiments: readonly CatalogExperiment[];
  groups: readonly ExperimentGroup[];
};

export function ExperimentCatalog({ experiments, groups }: ExperimentCatalogProps) {
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const availableTags = useMemo(() => {
    const tags = new Set<string>();

    for (const experiment of experiments) {
      if (selectedGroup !== "all" && experiment.group !== selectedGroup) {
        continue;
      }

      for (const tag of experiment.tags) {
        tags.add(tag);
      }
    }

    return [...tags].sort((first, second) => first.localeCompare(second));
  }, [experiments, selectedGroup]);

  const activeTag =
    selectedTag === "all" || availableTags.includes(selectedTag) ? selectedTag : "all";

  const filteredExperiments = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return experiments.filter((experiment) => {
      const matchesGroup = selectedGroup === "all" || experiment.group === selectedGroup;
      const matchesTag = activeTag === "all" || experiment.tags.includes(activeTag);
      const searchableText = [
        experiment.title,
        experiment.description,
        experiment.groupInfo.name,
        ...experiment.tags,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return matchesGroup && matchesTag && searchableText.includes(normalizedQuery);
    });
  }, [activeTag, experiments, query, selectedGroup]);

  return (
    <div>
      <div className="flex md:flex-row flex-col justify-between md:items-end gap-6">
        <div>
          <p className="font-mono font-medium text-muted-foreground text-xs uppercase tracking-[0.18em]">
            Experiment index
          </p>
          <h2 className="mt-2 font-semibold text-2xl tracking-tight">
            Ready to inspect and reuse
          </h2>
        </div>
        <label className="block relative w-full md:max-w-sm">
          <span className="sr-only">Search experiments</span>
          <Search
            className="top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search experiments, tags, groups…"
            className="pl-9"
          />
        </label>
      </div>

      <div
        className="bg-muted/25 mt-6 p-3 sm:p-4 border border-border rounded-xl"
        role="group"
        aria-label="Filter by group"
      >
        <p className="mb-3 font-mono font-medium text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
          Learning groups
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={selectedGroup === "all" ? "secondary" : "outline"}
            aria-pressed={selectedGroup === "all"}
            onClick={() => setSelectedGroup("all")}
          >
            All groups
          </Button>
          {[...groups]
            .sort((first, second) => first.order - second.order)
            .map((group) => {
              const colors = getGroupColorClasses(group);
              const isSelected = selectedGroup === group.slug;

              return (
                <Button
                  key={group.slug}
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-pressed={isSelected}
                  className={cn(isSelected ? colors.buttonSelected : colors.button)}
                  onClick={() => setSelectedGroup(group.slug)}
                >
                  {group.name}
                </Button>
              );
            })}
        </div>
      </div>

      <div
        className="bg-muted/25 mt-3 p-3 sm:p-4 border border-border rounded-xl"
        role="group"
        aria-label="Filter by tag"
      >
        <p className="mb-3 font-mono font-medium text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
          Tags
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeTag === "all" ? "secondary" : "outline"}
            aria-pressed={activeTag === "all"}
            onClick={() => setSelectedTag("all")}
          >
            All tags
          </Button>
          {availableTags.map((tag) => (
            <Button
              key={tag}
              type="button"
              size="sm"
              variant={activeTag === tag ? "secondary" : "outline"}
              aria-pressed={activeTag === tag}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-border border-t">
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {filteredExperiments.length}{" "}
          {filteredExperiments.length === 1 ? "experiment" : "experiments"} shown
        </p>

        {filteredExperiments.length > 0 ? (
          <ul className="flex flex-col gap-2 mt-4">
            {filteredExperiments.map((experiment) => {
              const href = getExperimentHref(experiment);
              const groupColors = getGroupColorClasses(experiment.groupInfo);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="group block bg-card hover:bg-accent/40 px-4 sm:px-5 py-3 border border-border hover:border-foreground/20 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Badge
                          variant="outline"
                          className={cn("gap-1.5", groupColors.badge)}
                        >
                          <Folder className="size-3" aria-hidden="true" />
                          {experiment.groupInfo.name}
                        </Badge>
                        <h3 className="font-semibold text-base group-hover:underline group-hover:underline-offset-4 truncate tracking-tight">
                          {experiment.title}
                        </h3>
                      </div>
                      <time
                        dateTime={experiment.publishedAt}
                        className="font-mono text-muted-foreground text-xs shrink-0"
                      >
                        {formatExperimentDate(experiment.publishedAt)}
                      </time>
                    </div>

                    <p className="mt-1.5 text-muted-foreground text-sm line-clamp-2 leading-6">
                      {experiment.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {experiment.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="font-normal text-muted-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="bg-muted/30 mt-4 px-6 py-12 border border-border border-dashed rounded-xl text-center">
            <p className="font-medium">No matching experiments yet.</p>
            <p className="mt-2 text-muted-foreground text-sm">
              Try a different search or clear the selected group or tag.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
