import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="flex min-h-[11.5rem] w-full items-center justify-center rounded-xl ring-1 ring-foreground/10"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Loading invoice</span>
    </div>
  );
}
