"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function ReloadButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      size="sm"
      onClick={() => {
        router.replace(`/experiments/nextjs/loading-skeleton/invoice/${Date.now()}`, {
          scroll: false,
        });
      }}
    >
      <RefreshCw aria-hidden="true" />
      Rerun demo
    </Button>
  );
}
