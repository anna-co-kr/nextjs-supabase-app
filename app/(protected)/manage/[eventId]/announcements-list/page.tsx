import { notFound } from "next/navigation";
import { Pin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { DUMMY_EVENTS, DUMMY_ANNOUNCEMENTS } from "@/lib/fixtures";

export default async function AnnouncementsListPage({
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
      <PageHeader title="공지 목록" description={event.title} />

      {sorted.length === 0 ? (
        <EmptyState
          title="아직 공지가 없습니다"
          description="주최자가 공지를 작성하면 여기에 표시됩니다"
        />
      ) : (
        <div className="space-y-3">
          {sorted.map((a) => (
            <Card key={a.id} className={a.isPinned ? "border-primary/40 bg-primary/5" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-2">
                  {a.isPinned && <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm font-semibold">{a.title}</CardTitle>
                      {a.isPinned && (
                        <Badge variant="outline" className="text-xs">
                          고정
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-4 w-4">
                        <AvatarFallback className="text-[10px]">{a.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {a.author.name} · {new Date(a.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="whitespace-pre-line text-sm text-muted-foreground">{a.content}</p>

                {/* 리액션 */}
                {a.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {a.reactions.map((r) => (
                      <span
                        key={r.emoji}
                        title="Phase 3에서 리액션 기능이 추가됩니다"
                        className={cn(
                          "flex cursor-default items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
                          r.reactedByMe
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border bg-muted",
                        )}
                      >
                        {r.emoji} {r.count}
                      </span>
                    ))}
                  </div>
                )}

                {/* 댓글 */}
                {a.comments.length > 0 && (
                  <div className="space-y-2 border-t border-border pt-3">
                    {a.comments.map((c) => (
                      <div key={c.id} className="flex gap-2">
                        <Avatar className="mt-0.5 h-6 w-6 shrink-0">
                          <AvatarFallback className="text-[10px]">
                            {c.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-medium">{c.author.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <span
                  title="Phase 3에서 댓글 기능이 추가됩니다"
                  className="flex cursor-default items-center gap-1 text-xs text-muted-foreground"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  댓글 달기
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
