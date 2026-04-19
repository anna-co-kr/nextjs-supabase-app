import { notFound } from "next/navigation";
import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ReactionButton, AddReactionButton } from "@/components/announcement-reaction-button";
import { CommentSection } from "@/components/comment-form";
import { createClient } from "@/lib/supabase/server";
import { getEventById } from "@/lib/supabase/events";
import { getAnnouncementsByEventId } from "@/lib/supabase/announcements";

export default async function AnnouncementsListPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  // 현재 로그인 사용자 조회 (DeleteCommentButton 권한 체크용)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 실제 DB에서 이벤트와 공지 데이터 조회
  const [event, announcements] = await Promise.all([
    getEventById(eventId),
    getAnnouncementsByEventId(eventId),
  ]);

  if (!event) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="공지 목록" description={event.title} />

      {announcements.length === 0 ? (
        <EmptyState
          title="아직 공지가 없습니다"
          description="주최자가 공지를 작성하면 여기에 표시됩니다"
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const authorName = a.author.full_name ?? a.author.email ?? "알 수 없음";
            return (
              <Card key={a.id} className={a.is_pinned ? "border-primary/40 bg-primary/5" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-2">
                    {a.is_pinned && <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold">{a.title}</CardTitle>
                        {a.is_pinned && (
                          <Badge variant="outline" className="text-xs">
                            고정
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-[10px]">
                            {authorName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">
                          {authorName} ·{" "}
                          {a.created_at ? new Date(a.created_at).toLocaleDateString("ko-KR") : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="whitespace-pre-line text-sm text-muted-foreground">{a.body}</p>

                  {/* 리액션 목록 + 추가 버튼 */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {a.reactions.map((r) => (
                      <ReactionButton
                        key={r.emoji}
                        announcementId={a.id}
                        emoji={r.emoji}
                        count={r.count}
                        reactedByMe={r.reactedByMe}
                      />
                    ))}
                    <AddReactionButton announcementId={a.id} />
                  </div>

                  {/* 댓글 목록 + 작성 폼 */}
                  <CommentSection
                    announcementId={a.id}
                    comments={a.comments}
                    currentUserId={user?.id}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
