import type { Metadata } from "next";

import { LoadingSpinnerShell } from "./loading-spinner-shell";
import { getCatalogExperiment } from "@/lib/experiments";

const experiment = getCatalogExperiment("nextjs", "loading-spinner");

export const metadata: Metadata = {
  title: experiment?.title ?? "Suspense - loading.js with a spinner",
  description:
    experiment?.description ??
    "A slow invoice fetch shows a spinner while the page shell stays visible.",
};

export default function LoadingSpinnerLayout({
  children,
}: LayoutProps<"/experiments/nextjs/loading-spinner">) {
  return <LoadingSpinnerShell>{children}</LoadingSpinnerShell>;
}
