import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventStatusBadge } from "@/components/event-status-badge";
import { cn, formatEventDate } from "@/lib/utils";
import type { Event, EventType } from "@/lib/types";

interface EventCardProps {
  event: Event;
  href: string;
}

// 이벤트 타입별 상단 액센트 바 그라디언트 매핑
const TYPE_ACCENT: Record<EventType, string> = {
  one_time: "from-violet-500 to-indigo-500",
  recurring: "from-blue-500 to-cyan-500",
};

export function EventCard({ event, href }: EventCardProps) {
  const capacityPercent =
    event.maxCapacity > 0 ? Math.round((event.confirmedCount / event.maxCapacity) * 100) : 0;
  const isFull = capacityPercent >= 100;

  // 상단 액센트 바 그라디언트 클래스 결정
  const accentGradient = TYPE_ACCENT[event.type] ?? "from-violet-500 to-indigo-500";

  return (
    <Link href={href} className="block">
      {/* hover 시 위로 살짝 올라오는 lift 효과 */}
      <Card className="group h-full overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        {/* 이벤트 타입별 컬러 액센트 바 */}
        <div className={cn("h-1 w-full bg-gradient-to-r", accentGradient)} aria-hidden="true" />

        <CardHeader className="pb-3 pt-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base font-semibold leading-snug">
              {event.title}
            </CardTitle>
            <EventStatusBadge status={event.status} className="shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {/* 날짜 메타 정보 */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span>{formatEventDate(event.startDate)}</span>
          </div>

          {/* 장소 메타 정보 */}
          {event.location && (
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}

          {/* 참여 인원 + 퍼센트 */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="flex-1">
              {event.confirmedCount}/{event.maxCapacity}명
              {event.waitingCount > 0 && (
                <span className="ml-1.5 font-medium text-amber-600 dark:text-amber-400">
                  (대기 {event.waitingCount})
                </span>
              )}
            </span>
            <span
              className={cn(
                "text-xs font-semibold tabular-nums",
                isFull ? "text-destructive" : "text-primary",
              )}
            >
              {capacityPercent}%
            </span>
          </div>

          {/* 세련된 progress bar — gradient fill */}
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={capacityPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`정원 대비 ${capacityPercent}% 차있습니다`}
          >
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                isFull
                  ? "from-red-400 to-destructive"
                  : capacityPercent >= 80
                    ? "from-amber-400 to-orange-500"
                    : "from-violet-400 to-indigo-500",
              )}
              style={{ width: `${Math.min(capacityPercent, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
