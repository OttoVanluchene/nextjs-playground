"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown, Folder, Search, Tag } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [tagQuery, setTagQuery] = useState("");
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);

  const orderedGroups = useMemo(
    () => [...groups].sort((first, second) => first.order - second.order),
    [groups],
  );

  const groupCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const experiment of experiments) {
      counts.set(experiment.group, (counts.get(experiment.group) ?? 0) + 1);
    }

    return counts;
  }, [experiments]);

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

  const visibleTags = useMemo(() => {
    const normalizedTagQuery = tagQuery.trim().toLocaleLowerCase();

    return availableTags.filter((tag) =>
      tag.toLocaleLowerCase().includes(normalizedTagQuery),
    );
  }, [availableTags, tagQuery]);

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

  function selectGroup(groupSlug: string) {
    const nextTags = new Set(
      experiments
        .filter((experiment) => groupSlug === "all" || experiment.group === groupSlug)
        .flatMap((experiment) => [...experiment.tags]),
    );

    if (selectedTag !== "all" && !nextTags.has(selectedTag)) {
      setSelectedTag("all");
    }

    setSelectedGroup(groupSlug);
  }

  function selectTag(tag: string) {
    setSelectedTag(tag);
    setTagQuery("");
    setIsTagPopoverOpen(false);
  }

  return (
    <div>
      <div>
        <p className="font-mono font-medium text-muted-foreground text-xs uppercase tracking-[0.18em]">
          Experiment index
        </p>
        <h2 className="mt-2 font-semibold text-2xl tracking-tight">All experiments</h2>
      </div>

      <div className="mt-6">
        <p className="mb-2 font-mono font-medium text-[11px] text-muted-foreground uppercase tracking-[0.16em]">
          Browse groups
        </p>
        <div className="-mx-5 sm:-mx-8 px-5 sm:px-8 pb-1 overflow-x-auto">
          <div
            className="flex items-center gap-2 min-w-max"
            role="group"
            aria-label="Filter by group"
          >
            <Button
              type="button"
              size="sm"
              variant={selectedGroup === "all" ? "secondary" : "outline"}
              aria-pressed={selectedGroup === "all"}
              onClick={() => selectGroup("all")}
            >
              All groups
              <span className="bg-background/70 px-1.5 rounded-md font-mono text-[10px] text-muted-foreground">
                {experiments.length}
              </span>
            </Button>
            {orderedGroups.map((group) => {
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
                  onClick={() => selectGroup(group.slug)}
                >
                  {group.name}
                  <span className="bg-background/60 opacity-70 px-1.5 rounded-md font-mono text-[10px] text-current">
                    {groupCounts.get(group.slug) ?? 0}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-7 pt-5 border-border border-t">
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-end gap-4">
          <div>
            <p className="font-semibold text-base tracking-tight">Experiments</p>
            <p className="mt-0.5 text-muted-foreground text-sm" aria-live="polite">
              {filteredExperiments.length}{" "}
              {filteredExperiments.length === 1 ? "experiment" : "experiments"} shown
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:max-w-md">
            <label className="relative flex-1 min-w-0">
              <span className="sr-only">Search experiments</span>
              <Search
                className="top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search experiments…"
                className="pl-9 h-9"
              />
            </label>

            <Popover
              open={isTagPopoverOpen}
              onOpenChange={(open) => {
                setIsTagPopoverOpen(open);
                if (!open) {
                  setTagQuery("");
                }
              }}
            >
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    size="lg"
                    variant={activeTag === "all" ? "outline" : "secondary"}
                    className="max-w-44 h-9 shrink-0"
                  />
                }
              >
                <Tag aria-hidden="true" />
                <span className="truncate">
                  {activeTag === "all" ? "Tags" : activeTag}
                </span>
                {activeTag === "all" && (
                  <span className="bg-muted px-1.5 rounded-md font-mono text-[10px] text-muted-foreground">
                    {availableTags.length}
                  </span>
                )}
                <ChevronDown aria-hidden="true" />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="gap-3 p-3 w-[min(20rem,calc(100vw-2rem))]"
              >
                <PopoverHeader>
                  <PopoverTitle>Filter by tag</PopoverTitle>
                  <PopoverDescription>
                    Choose one tag from the selected group.
                  </PopoverDescription>
                </PopoverHeader>

                <label className="relative">
                  <span className="sr-only">Search tags</span>
                  <Search
                    className="top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    value={tagQuery}
                    onChange={(event) => setTagQuery(event.target.value)}
                    placeholder="Search tags…"
                    className="pl-9"
                  />
                </label>

                <div
                  className="space-y-1 pr-1 max-h-56 overflow-y-auto"
                  role="group"
                  aria-label="Available tags"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-between w-full"
                    aria-pressed={activeTag === "all"}
                    onClick={() => selectTag("all")}
                  >
                    All tags
                    {activeTag === "all" && <Check aria-hidden="true" />}
                  </Button>
                  {visibleTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="ghost"
                      className="justify-between w-full"
                      aria-pressed={activeTag === tag}
                      onClick={() => selectTag(tag)}
                    >
                      <span className="truncate">{tag}</span>
                      {activeTag === tag && <Check aria-hidden="true" />}
                    </Button>
                  ))}
                  {visibleTags.length === 0 && (
                    <p className="px-2 py-5 text-muted-foreground text-sm text-center">
                      No matching tags.
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {filteredExperiments.length > 0 ? (
          <ul className="flex flex-col gap-3 mt-4">
            {filteredExperiments.map((experiment) => {
              const href = getExperimentHref(experiment);
              const groupColors = getGroupColorClasses(experiment.groupInfo);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "group block bg-card hover:bg-muted/50 shadow-xs px-4 sm:px-5 py-4 border border-border hover:border-y-foreground/25 hover:border-r-foreground/25 border-l-[length:var(--radius-xl)] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors",
                      groupColors.cardAccent,
                    )}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <Badge
                            variant="outline"
                            className={cn("gap-1.5", groupColors.badge)}
                          >
                            <Folder className="size-3" aria-hidden="true" />
                            {experiment.groupInfo.name}
                          </Badge>
                          <h3 className="font-semibold text-base group-hover:underline group-hover:underline-offset-4 tracking-tight">
                            {experiment.title}
                          </h3>
                        </div>

                        <p className="mt-2 text-muted-foreground text-sm line-clamp-2 leading-6">
                          {experiment.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <time
                          dateTime={experiment.publishedAt}
                          className="hidden sm:block font-mono text-muted-foreground text-xs"
                        >
                          {formatExperimentDate(experiment.publishedAt)}
                        </time>
                        <span className="place-items-center grid bg-background border border-border group-hover:border-foreground/20 rounded-lg size-8 text-muted-foreground group-hover:text-foreground transition-colors">
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                          <span className="sr-only">Open experiment</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <time
                        dateTime={experiment.publishedAt}
                        className="sm:hidden mr-1 font-mono text-muted-foreground text-xs"
                      >
                        {formatExperimentDate(experiment.publishedAt)}
                      </time>
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
