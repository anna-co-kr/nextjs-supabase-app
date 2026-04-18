import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventStatusBadge } from "@/components/event-status-badge";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { formatEventDate } from "@/lib/utils";
import { DUMMY_EVENTS } from "@/lib/fixtures";

export default async function PublicEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = DUMMY_EVENTS.find((e) => e.shareToken === slug);
  if (!event) notFound();

  const isFull = event.confirmedCount >= event.maxCapacity;
  const isClosed = event.status === "closed" || event.status === "cancelled";

  return (
    <div className="flex min-h-screen flex-col">
      {/* 공개 헤더 */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Gather
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">로그인</Link>
          </Button>
          <Button size="sm" className="rounded-md bg-primary hover:bg-primary/90" asChild>
            <Link href="/auth/sign-up">시작하기</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-lg">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <EventStatusBadge status={event.status} className="shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground">주최: {event.host.name}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{event.description}</p>

              <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>
                    {formatEventDate(event.startDate, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>
                    {event.confirmedCount}/{event.maxCapacity}명 확정
                    {event.waitingCount > 0 && ` · 대기 ${event.waitingCount}명`}
                  </span>
                </div>
              </div>

              {isClosed ? (
                <Button className="w-full" disabled>
                  모집이 마감된 모임입니다
                </Button>
              ) : isFull ? (
                <div className="space-y-2">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href={`/events/${slug}/apply`}>대기자로 신청하기</Link>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    현재 정원이 꽉 찼습니다. 대기자로 등록하면 자리가 생길 때 자동으로 확정됩니다.
                  </p>
                </div>
              ) : (
                <Button className="w-full" asChild>
                  <Link href={`/events/${slug}/apply`}>참여 신청하기</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border bg-muted py-6 text-center text-xs text-muted-foreground">
        © 2025 Gather. All rights reserved.
      </footer>
    </div>
  );
}
