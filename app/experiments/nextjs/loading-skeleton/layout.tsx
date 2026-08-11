import type { Metadata } from "next";

import { LoadingSkeletonShell } from "./loading-skeleton-shell";
import { getCatalogExperiment } from "@/lib/experiments";

const experiment = getCatalogExperiment("nextjs", "loading-skeleton");

export const metadata: Metadata = {
  title: experiment?.title ?? "Suspense - loading.js with a skeleton",
  description:
    experiment?.description ??
    "Same delayed invoice, but loading.tsx mirrors the card shape.",
};

export default function LoadingSkeletonLayout({
  children,
}: LayoutProps<"/experiments/nextjs/loading-skeleton">) {
  return <LoadingSkeletonShell>{children}</LoadingSkeletonShell>;
}
