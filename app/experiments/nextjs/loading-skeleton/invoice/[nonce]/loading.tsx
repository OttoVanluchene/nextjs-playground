import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card className="w-full" aria-busy="true" aria-live="polite">
      <CardHeader className="border-b">
        <div className="flex justify-between items-start gap-3">
          <Skeleton className="w-36 h-5" />
          <Skeleton className="rounded-full w-14 h-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-(--card-spacing)">
        <div className="flex justify-between items-center gap-4">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-28 h-4" />
        </div>
        <div className="flex justify-between items-center gap-4">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-20 h-5" />
        </div>
        <div className="flex justify-between items-center gap-4">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-24 h-4" />
        </div>
      </CardContent>
      <span className="sr-only">Loading invoice</span>
    </Card>
  );
}
