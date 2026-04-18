import { notFound } from "next/navigation";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatusBadge } from "@/components/event-status-badge";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { DUMMY_EVENTS, DUMMY_SETTLEMENTS, CURRENT_USER } from "@/lib/fixtures";

export default async function SettlementsStatusPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = DUMMY_EVENTS.find((e) => e.id === eventId);
  if (!event) notFound();

  const settlement = DUMMY_SETTLEMENTS[eventId];
  const myPayments =
    settlement?.items.flatMap((item) =>
      item.payments
        .filter((p) => p.member.user.id === CURRENT_USER.id)
        .map((p) => ({ item, payment: p })),
    ) ?? [];

  const totalMyAmount = myPayments.reduce((sum, { payment }) => sum + payment.amount, 0);
  const paidAmount = myPayments
    .filter(({ payment }) => payment.status === "paid")
    .reduce((sum, { payment }) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="정산 현황" description={event.title} />

      {!settlement || myPayments.length === 0 ? (
        <EmptyState
          title="정산 항목이 없습니다"
          description="주최자가 정산을 등록하면 여기에 표시됩니다"
        />
      ) : (
        <>
          {/* 내 납부 요약 */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="pt-5 text-center">
                <p className="text-2xl font-bold">{totalMyAmount.toLocaleString()}원</p>
                <p className="text-xs text-muted-foreground">내 총 납부 금액</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {(totalMyAmount - paidAmount).toLocaleString()}원
                </p>
                <p className="text-xs text-muted-foreground">미납 금액</p>
              </CardContent>
            </Card>
          </div>

          {/* 계좌 정보 */}
          {settlement.bankAccount && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">입금 계좌</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{settlement.bankAccount.bankName}</span>
                  <span className="ml-2 text-muted-foreground">
                    {settlement.bankAccount.accountNumber}
                  </span>
                  <span className="ml-2 text-muted-foreground">
                    {settlement.bankAccount.accountHolder}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  복사
                </Button>
              </CardContent>
            </Card>
          )}

          {/* 항목별 내역 */}
          <div className="space-y-3">
            {myPayments.map(({ item, payment }) => (
              <Card key={payment.id}>
                <CardContent className="flex items-center justify-between pt-5">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.amount.toLocaleString()}원
                    </p>
                  </div>
                  <PaymentStatusBadge status={payment.status} />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
