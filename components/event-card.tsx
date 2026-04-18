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
      {/* Apple 스타일 카드: border 없음, shadow 없음, 배경색으로만 구분 */}
      <div className="group h-full rounded-2xl bg-[#f5f5f7] p-5 transition-colors duration-200 hover:bg-[#ebebf0] dark:bg-[#1c1c1e] dark:hover:bg-[#2c2c2e]">
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
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#6e6e73]" aria-hidden="true" />
            <span className="text-sm text-[#6e6e73]">{formatEventDate(event.startDate)}</span>
          </div>

          {/* 장소 */}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#6e6e73]" aria-hidden="true" />
              <span className="line-clamp-1 text-sm text-[#6e6e73]">{event.location}</span>
            </div>
          )}

          {/* 참여 인원 */}
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0 text-[#6e6e73]" aria-hidden="true" />
            <span className="flex-1 text-sm text-[#6e6e73]">
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
                isFull ? "text-red-500" : "text-[#0071e3]",
              )}
            >
              {capacityPercent}%
            </span>
          </div>
        </div>

        {/* Apple 스타일 progress bar: Apple blue, 높이 h-1 */}
        <div
          className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[#d2d2d7] dark:bg-[#3a3a3c]"
          role="progressbar"
          aria-valuenow={capacityPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`정원 대비 ${capacityPercent}% 차있습니다`}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isFull ? "bg-red-500" : capacityPercent >= 80 ? "bg-amber-500" : "bg-[#0071e3]",
            )}
            style={{ width: `${Math.min(capacityPercent, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
