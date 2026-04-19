import { notFound } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberStatusBadge } from "@/components/event-status-badge";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberActions } from "./member-actions";
import { getMembersByEventId, type MemberWithProfile } from "@/lib/supabase/members";
import { getEventById } from "@/lib/supabase/events";

interface MemberTableProps {
  members: MemberWithProfile[];
}

/**
 * 멤버 목록 테이블/카드 컴포넌트
 * 모바일: 카드 레이아웃, 데스크톱: 테이블 레이아웃
 */
function MemberTable({ members }: MemberTableProps) {
  if (members.length === 0) {
    return <EmptyState title="해당하는 참여자가 없습니다" className="py-10" />;
  }

  return (
    <>
      {/* 모바일 카드 목록 — sm 이상에서 숨김 */}
      <div className="flex flex-col gap-3 sm:hidden">
        {members.map((m) => {
          const displayName = m.profile.full_name ?? m.profile.email;
          const initials = displayName[0]?.toUpperCase() ?? "?";

          return (
            <Card key={m.id}>
              <CardContent className="flex flex-col gap-3 p-4">
                {/* 참여자 정보 */}
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{m.profile.email}</p>
                  </div>
                </div>

                {/* 신청일 및 상태 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.applied_at).toLocaleDateString("ko-KR")} 신청
                  </span>
                  <MemberStatusBadge status={m.status} />
                </div>

                {/* 메모 (있는 경우에만 표시) */}
                {m.note && <p className="text-xs text-muted-foreground">{m.note}</p>}

                {/* 관리 버튼 */}
                <div className="pt-1">
                  <MemberActions memberId={m.id} currentStatus={m.status} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 데스크톱 테이블 — sm 미만에서 숨김 */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">참여자</TableHead>
              <TableHead scope="col">신청일</TableHead>
              <TableHead scope="col">상태</TableHead>
              <TableHead scope="col">메모</TableHead>
              <TableHead scope="col" className="text-right">
                관리
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => {
              const displayName = m.profile.full_name ?? m.profile.email;
              const initials = displayName[0]?.toUpperCase() ?? "?";

              return (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{m.profile.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(m.applied_at).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell>
                    <MemberStatusBadge status={m.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{m.note ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <MemberActions memberId={m.id} currentStatus={m.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default async function MembersPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;

  // 이벤트 존재 여부 및 주최자 확인
  const event = await getEventById(eventId);
  if (!event) notFound();

  // 전체 멤버 목록 조회 (프로필 포함)
  const members = await getMembersByEventId(eventId);

  const confirmed = members.filter((m) => m.status === "confirmed");
  const waiting = members.filter((m) => m.status === "waiting");
  const rejected = members.filter((m) => m.status === "rejected");

  return (
    <div className="space-y-6">
      <PageHeader
        title="참여자 관리"
        description={`${event.title} · 총 ${members.length}명`}
        action={
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/events/${eventId}/members/export`} download>
              <Download className="mr-2 h-4 w-4" />
              CSV 내보내기
            </a>
          </Button>
        }
      />

      <Tabs defaultValue="confirmed">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="confirmed" className="flex-1 sm:flex-none">
            확정 ({confirmed.length})
          </TabsTrigger>
          <TabsTrigger value="waiting" className="flex-1 sm:flex-none">
            대기 ({waiting.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1 sm:flex-none">
            거절 ({rejected.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="confirmed">
          <MemberTable members={confirmed} />
        </TabsContent>
        <TabsContent value="waiting">
          <MemberTable members={waiting} />
        </TabsContent>
        <TabsContent value="rejected">
          <MemberTable members={rejected} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
