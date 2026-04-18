import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Link href={href}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base">{event.title}</CardTitle>
            <EventStatusBadge status={event.status} className="shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            <span>{formatEventDate(event.startDate)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>
                {event.confirmedCount}/{event.maxCapacity}명
                {event.waitingCount > 0 && (
                  <span className="ml-1 text-yellow-600 dark:text-yellow-400">
                    (대기 {event.waitingCount})
                  </span>
                )}
              </span>
            </div>
            <span className="text-xs">{capacityPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isFull ? "bg-destructive" : "bg-primary",
              )}
              style={{ width: `${Math.min(capacityPercent, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
