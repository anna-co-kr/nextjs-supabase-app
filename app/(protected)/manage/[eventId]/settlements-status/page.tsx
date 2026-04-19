import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStatusBadge } from "@/components/event-status-badge";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { CopyButton } from "@/components/copy-button";
import { createClient } from "@/lib/supabase/server";
import { getEventById } from "@/lib/supabase/events";
import { getMySettlementStatus } from "@/lib/supabase/settlements";

export default async function SettlementsStatusPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  // 인증 확인 — 비로그인 시 로그인 페이지로 리디렉션
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 이벤트 정보 조회
  const event = await getEventById(eventId);
  if (!event) notFound();

  // 본인 정산 현황 조회 — 확정 참여자가 아니면 notFound
  const myStatus = await getMySettlementStatus(eventId, user.id);
  if (!myStatus) notFound();

  const { payments, bankAccount, totalDue, allPaid } = myStatus;

  // 미납 금액 계산
  const paidAmount = payments.filter((p) => p.is_paid).reduce((sum, p) => sum + p.amount, 0);
  const unpaidAmount = totalDue - paidAmount;

  return (
    <div className="space-y-6">
      <PageHeader title="정산 현황" description={event.title} />

      {payments.length === 0 ? (
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
                <p className="text-2xl font-bold">{totalDue.toLocaleString()}원</p>
                <p className="text-xs text-muted-foreground">내 총 납부 금액</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <p
                  className={`text-2xl font-bold ${
                    allPaid
                      ? "text-green-600 dark:text-green-400"
                      : "text-orange-600 dark:text-orange-400"
                  }`}
                >
                  {unpaidAmount.toLocaleString()}원
                </p>
                <p className="text-xs text-muted-foreground">미납 금액</p>
              </CardContent>
            </Card>
          </div>

          {/* 계좌 정보 */}
          {bankAccount && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">입금 계좌</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{bankAccount.bank_name}</span>
                  <span className="ml-2 text-muted-foreground">{bankAccount.account_number}</span>
                  <span className="ml-2 text-muted-foreground">{bankAccount.account_holder}</span>
                </div>
                <CopyButton text={bankAccount.account_number} />
              </CardContent>
            </Card>
          )}

          {/* 항목별 납부 내역 */}
          <div className="space-y-3">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="flex items-center justify-between pt-5">
                  <div>
                    <p className="font-medium">{payment.settlement_item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {payment.amount.toLocaleString()}원
                    </p>
                  </div>
                  <PaymentStatusBadge status={payment.is_paid ? "paid" : "pending"} />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
