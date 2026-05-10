import { Card, CardContent } from "./card";
import { Skeleton } from "./skeleton";

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
