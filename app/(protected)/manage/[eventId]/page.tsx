import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, Megaphone, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EventStatusBadge } from "@/components/event-status-badge";
import { PageHeader } from "@/components/page-header";
import { CopyButton } from "@/components/copy-button";
import { getEventById } from "@/lib/supabase/events";
import { mapEventRowToView } from "@/lib/mappers/event";

export default async function EventManagePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const row = await getEventById(eventId);
  if (!row) notFound();

  const event = mapEventRowToView(row);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/events/${event.shareToken}`;

  const navItems = [
    {
      href: `/manage/${eventId}/members`,
      icon: Users,
      label: "참여자 관리",
      count: event.confirmedCount + event.waitingCount,
    },
    { href: `/manage/${eventId}/announcements`, icon: Megaphone, label: "공지 관리" },
    { href: `/manage/${eventId}/settlements`, icon: Receipt, label: "정산 관리" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={event.title}
        description="모임을 관리하세요"
        action={<EventStatusBadge status={event.status} />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{event.confirmedCount}</p>
            <p className="text-sm text-muted-foreground">확정 참여자</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p
              className="text-3xl font-bold text-amber-600 dark:text-amber-400"
              aria-label={`대기자 ${event.waitingCount}명`}
            >
              {event.waitingCount}
            </p>
            <p className="text-sm text-muted-foreground">대기자</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{event.maxCapacity}</p>
            <p className="text-sm text-muted-foreground">최대 인원</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">참여 링크 공유</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="flex-1 break-all rounded bg-muted px-3 py-2 text-sm sm:min-w-0 sm:truncate sm:break-normal">
            {shareUrl}
          </code>
          <CopyButton text={shareUrl} className="sm:shrink-0" />
        </CardContent>
      </Card>

      <Separator />

      <div className="grid gap-3 sm:grid-cols-3">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 pt-6">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{item.label}</p>
                  {item.count !== undefined && (
                    <p className="text-sm text-muted-foreground">{item.count}명</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
