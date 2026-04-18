import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    /* 스켈레톤: EventCard와 동일한 bg-muted 배경으로 통일 */
    <div className="space-y-3 rounded-lg bg-muted p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-14" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/5" />
      <div className="space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-1.5 w-full" />
      </div>
    </div>
  );
}

export function EventListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 테이블 행 스켈레톤 — 반드시 <tbody> 또는 <table> 내부에서 사용
 * @example
 * <table><tbody><TableRowSkeleton cols={5} /></tbody></table>
 */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
