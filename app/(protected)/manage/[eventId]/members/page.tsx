import { notFound } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { DUMMY_EVENTS, DUMMY_MEMBERS } from "@/lib/fixtures";
import type { EventMember } from "@/lib/types";

function MemberTable({ members }: { members: EventMember[] }) {
  if (members.length === 0) {
    return <EmptyState title="해당하는 참여자가 없습니다" className="py-10" />;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>참여자</TableHead>
          <TableHead>신청일</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>메모</TableHead>
          <TableHead className="text-right">관리</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m) => (
          <TableRow key={m.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">{m.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{m.user.name}</p>
                  <p className="text-xs text-muted-foreground">{m.user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(m.appliedAt).toLocaleDateString("ko-KR")}
            </TableCell>
            <TableCell>
              <MemberStatusBadge status={m.status} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{m.note ?? "—"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                {m.status !== "confirmed" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    확정
                  </Button>
                )}
                {m.status !== "rejected" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs text-destructive">
                    거절
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default async function MembersPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = DUMMY_EVENTS.find((e) => e.id === eventId);
  if (!event) notFound();

  const members = DUMMY_MEMBERS[eventId] ?? [];
  const confirmed = members.filter((m) => m.status === "confirmed");
  const waiting = members.filter((m) => m.status === "waiting");
  const rejected = members.filter((m) => m.status === "rejected");

  return (
    <div className="space-y-6">
      <PageHeader
        title="참여자 관리"
        description={`${event.title} · 총 ${members.length}명`}
        action={
          <Button variant="outline" size="sm">
            CSV 내보내기
          </Button>
        }
      />

      <Tabs defaultValue="confirmed">
        <TabsList>
          <TabsTrigger value="confirmed">확정 ({confirmed.length})</TabsTrigger>
          <TabsTrigger value="waiting">대기 ({waiting.length})</TabsTrigger>
          <TabsTrigger value="rejected">거절 ({rejected.length})</TabsTrigger>
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
