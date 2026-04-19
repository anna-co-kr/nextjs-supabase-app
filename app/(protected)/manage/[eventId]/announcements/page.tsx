import { notFound } from "next/navigation";
import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { AnnouncementCreateDialog, AnnouncementEditDialog } from "@/components/announcement-form";
import { DeleteAnnouncementButton, TogglePinButton } from "@/components/announcement-actions";
import { getEventById } from "@/lib/supabase/events";
import { getAnnouncementsByEventId } from "@/lib/supabase/announcements";

export default async function AnnouncementsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  // 실제 DB에서 이벤트와 공지 데이터 조회
  const [event, announcements] = await Promise.all([
    getEventById(eventId),
    getAnnouncementsByEventId(eventId),
  ]);

  if (!event) notFound();

  const createButton = <AnnouncementCreateDialog eventId={eventId} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="공지 관리"
        description={`${event.title} · 공지 ${announcements.length}개`}
        action={createButton}
      />

      {announcements.length === 0 ? (
        <EmptyState
          title="아직 공지가 없습니다"
          description="모임 참여자들에게 첫 공지를 작성해보세요"
          action={<AnnouncementCreateDialog eventId={eventId} />}
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id} className={a.is_pinned ? "border-primary/40 bg-primary/5" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {a.is_pinned && <Pin className="h-3.5 w-3.5 shrink-0 text-primary" />}
                    <CardTitle className="text-sm font-semibold">{a.title}</CardTitle>
                    {a.is_pinned && (
                      <Badge variant="outline" className="text-xs">
                        고정
                      </Badge>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {/* 고정/해제 버튼 */}
                    <TogglePinButton id={a.id} isPinned={a.is_pinned} />
                    {/* 수정 버튼 (다이얼로그) */}
                    <AnnouncementEditDialog
                      announcement={a}
                      trigger={
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          수정
                        </Button>
                      }
                    />
                    {/* 삭제 버튼 */}
                    <DeleteAnnouncementButton id={a.id} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
                  {a.body}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>
                    {a.created_at ? new Date(a.created_at).toLocaleDateString("ko-KR") : ""}
                  </span>
                  <span>댓글 {a.comments.length}개</span>
                  <span>리액션 {a.reactions.reduce((sum, r) => sum + r.count, 0)}개</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
