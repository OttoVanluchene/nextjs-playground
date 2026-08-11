import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ExperimentBackLinkProps = {
  className?: string;
};

export function ExperimentBackLink({ className }: ExperimentBackLinkProps) {
  return (
    <Link
      href="/"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "-ml-2.5 inline-flex w-fit text-muted-foreground",
        className,
      )}
    >
      <ArrowLeft data-icon="inline-start" aria-hidden="true" />
      All experiments
    </Link>
  );
}
