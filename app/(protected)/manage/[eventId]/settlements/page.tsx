import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { PaymentStatusBadge } from "@/components/event-status-badge";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { DUMMY_EVENTS, DUMMY_SETTLEMENTS } from "@/lib/fixtures";
import type { SplitType } from "@/lib/types";

const SPLIT_TYPE_LABEL: Record<SplitType, string> = {
  equal: "균등 분할",
  individual: "개별 지정",
  ratio: "비율 분담",
};

export default async function SettlementsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = DUMMY_EVENTS.find((e) => e.id === eventId);
  if (!event) notFound();

  const settlement = DUMMY_SETTLEMENTS[eventId];

  return (
    <div className="space-y-6">
      <PageHeader
        title="정산 관리"
        description={`${event.title}`}
        action={<Button size="sm">항목 추가</Button>}
      />

      {/* 계좌 정보 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">입금 계좌</CardTitle>
            <Button variant="outline" size="sm">
              {settlement?.bankAccount ? "수정" : "등록"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {settlement?.bankAccount ? (
            // 모바일: 세로 배치 / sm 이상: 가로 배치
            <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-4">
              <span className="font-medium">{settlement.bankAccount.bankName}</span>
              <code className="rounded bg-muted px-2 py-0.5">
                {settlement.bankAccount.accountNumber}
              </code>
              <span className="text-muted-foreground">{settlement.bankAccount.accountHolder}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">등록된 계좌가 없습니다</p>
          )}
        </CardContent>
      </Card>

      {/* 정산 요약 */}
      {settlement && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">{settlement.totalAmount.toLocaleString()}원</p>
              <p className="text-xs text-muted-foreground">총 정산 금액</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {settlement.paidCount}명
              </p>
              <p className="text-xs text-muted-foreground">납부 완료</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {settlement.unpaidCount}명
              </p>
              <p className="text-xs text-muted-foreground">미납</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />

      {/* 정산 항목 */}
      {!settlement || settlement.items.length === 0 ? (
        <EmptyState
          title="등록된 정산 항목이 없습니다"
          description="비용 항목을 추가해주세요"
          action={<Button size="sm">항목 추가</Button>}
        />
      ) : (
        <div className="space-y-4">
          {settlement.items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {item.totalAmount.toLocaleString()}원 · {SPLIT_TYPE_LABEL[item.splitType]}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    수정
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* 모바일 결제 목록 — sm 이상에서 숨김 */}
                <div className="flex flex-col gap-2 sm:hidden">
                  {item.payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      {/* 왼쪽: 이름과 금액 */}
                      <div>
                        <p className="text-sm font-medium">{p.member.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {p.amount.toLocaleString()}원
                        </p>
                      </div>
                      {/* 오른쪽: 상태 뱃지와 확인/취소 버튼 */}
                      <div className="flex items-center gap-2">
                        <PaymentStatusBadge status={p.status} />
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          {p.status === "paid" ? "취소" : "확인"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 데스크톱 테이블 — sm 미만에서 숨김 */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>참여자</TableHead>
                        <TableHead className="text-right">금액</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead className="text-right">납부 확인</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item.payments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-sm">{p.member.user.name}</TableCell>
                          <TableCell className="text-right text-sm">
                            {p.amount.toLocaleString()}원
                          </TableCell>
                          <TableCell>
                            <PaymentStatusBadge status={p.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              {p.status === "paid" ? "취소" : "확인"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
