import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { EventStatusBadge } from "@/components/event-status-badge";
import { cn, formatEventDate } from "@/lib/utils";
import type { Event } from "@/lib/types";

interface EventCardProps {
  event: Event;
  href: string;
}

export function EventCard({ event, href }: EventCardProps) {
  const capacityPercent =
    event.maxCapacity > 0 ? Math.round((event.confirmedCount / event.maxCapacity) * 100) : 0;
  const isFull = capacityPercent >= 100;

  return (
    <Link href={href} className="block">
      {/* 카드: border 없음, shadow 없음, 배경색으로만 구분 */}
      <div className="group h-full rounded-lg bg-muted p-5 transition-colors duration-200 hover:bg-accent">
        {/* 카드 상단: 제목 + 상태 배지 */}
        <div className="mb-4 flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-black dark:text-white">
            {event.title}
          </h3>
          <EventStatusBadge status={event.status} className="shrink-0" />
        </div>

        {/* 메타 정보 영역 */}
        <div className="space-y-2">
          {/* 날짜 */}
          <div className="flex items-center gap-2">
            <CalendarDays
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-sm text-muted-foreground">
              {formatEventDate(event.startDate)}
            </span>
          </div>

          {/* 장소 */}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="line-clamp-1 text-sm text-muted-foreground">{event.location}</span>
            </div>
          )}

          {/* 참여 인원 */}
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="flex-1 text-sm text-muted-foreground">
              {event.confirmedCount}/{event.maxCapacity}명
              {event.waitingCount > 0 && (
                <span className="ml-1.5 font-medium text-amber-600 dark:text-amber-400">
                  (대기 {event.waitingCount})
                </span>
              )}
            </span>
            {/* 퍼센트 표시 */}
            <span
              className={cn(
                "text-xs font-semibold tabular-nums",
                isFull ? "text-red-500" : "text-primary",
              )}
            >
              {capacityPercent}%
            </span>
          </div>
        </div>

        {/* 진행 바: primary 색상, 높이 h-1 */}
        <div
          className="mt-4 h-1 w-full overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={capacityPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`정원 대비 ${capacityPercent}% 차있습니다`}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isFull ? "bg-red-500" : capacityPercent >= 80 ? "bg-amber-500" : "bg-primary",
            )}
            style={{ width: `${Math.min(capacityPercent, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
