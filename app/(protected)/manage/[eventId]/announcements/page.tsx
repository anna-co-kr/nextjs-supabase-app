import { notFound } from "next/navigation";
import { Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { DUMMY_EVENTS, DUMMY_ANNOUNCEMENTS } from "@/lib/fixtures";

export default async function AnnouncementsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = DUMMY_EVENTS.find((e) => e.id === eventId);
  if (!event) notFound();

  const announcements = DUMMY_ANNOUNCEMENTS[eventId] ?? [];
  const sorted = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="공지 관리"
        description={`${event.title} · 공지 ${announcements.length}개`}
        action={<Button size="sm">공지 작성</Button>}
      />

      {sorted.length === 0 ? (
        <EmptyState
          title="아직 공지가 없습니다"
          description="모임 참여자들에게 첫 공지를 작성해보세요"
          action={<Button size="sm">공지 작성</Button>}
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((a) => (
            <Card key={a.id} className={a.isPinned ? "border-primary/40 bg-primary/5" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {a.isPinned && <Pin className="h-3.5 w-3.5 shrink-0 text-primary" />}
                    <CardTitle className="text-sm font-semibold">{a.title}</CardTitle>
                    {a.isPinned && (
                      <Badge variant="outline" className="text-xs">
                        고정
                      </Badge>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-destructive hover:text-destructive"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
                  {a.content}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{new Date(a.createdAt).toLocaleDateString("ko-KR")}</span>
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
