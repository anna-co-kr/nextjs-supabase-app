import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/event-card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { DUMMY_EVENTS, CURRENT_USER } from "@/lib/fixtures";

export default function DashboardPage() {
  const hostingEvents = DUMMY_EVENTS.filter((e) => e.host.id === CURRENT_USER.id);
  const participatingEvents = DUMMY_EVENTS.filter((e) => e.host.id !== CURRENT_USER.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description="내가 주최하거나 참여 중인 모임 목록입니다"
        action={
          <Button asChild>
            <Link href="/events/new">
              <Plus className="mr-2 h-4 w-4" />새 모임 만들기
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="hosting">
        <TabsList>
          <TabsTrigger value="hosting">
            주최 중인 모임
            {hostingEvents.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium">
                {hostingEvents.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="participating">
            참여 중인 모임
            {participatingEvents.length > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium">
                {participatingEvents.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hosting" className="mt-4">
          {hostingEvents.length === 0 ? (
            <EmptyState
              title="아직 주최한 모임이 없습니다"
              description="새 모임을 만들어 참여자를 초대해보세요"
              action={
                <Button asChild>
                  <Link href="/events/new">
                    <Plus className="mr-2 h-4 w-4" />새 모임 만들기
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hostingEvents.map((event) => (
                <EventCard key={event.id} event={event} href={`/manage/${event.id}`} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="participating" className="mt-4">
          {participatingEvents.length === 0 ? (
            <EmptyState
              title="참여 중인 모임이 없습니다"
              description="초대 링크를 통해 모임에 참여해보세요"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {participatingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  href={`/manage/${event.id}/announcements-list`}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
