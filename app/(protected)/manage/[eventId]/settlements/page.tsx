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
import { SettlementItemForm } from "@/components/settlement-item-form";
import { BankAccountForm } from "@/components/bank-account-form";
import { getEventById } from "@/lib/supabase/events";
import {
  getSettlementsByEventId,
  getConfirmedMembers,
  getBankAccount,
} from "@/lib/supabase/settlements";
import { deleteSettlementItem } from "@/lib/actions/settlement";
import { PaymentToggleButton } from "@/components/payment-toggle-button";
import { SendReminderButton } from "@/components/send-reminder-button";
import { SPLIT_TYPE_LABEL } from "@/lib/utils/settlement";

export default async function SettlementsPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  // 이벤트 정보 조회 (권한 검사 포함)
  const event = await getEventById(eventId);
  if (!event) notFound();

  // 정산 항목, 확정 멤버, 계좌 정보 병렬 조회
  const [settlementItems, confirmedMembers, bankAccount] = await Promise.all([
    getSettlementsByEventId(eventId),
    getConfirmedMembers(eventId),
    getBankAccount(eventId),
  ]);

  // 요약 집계 계산
  const totalAmount = settlementItems.reduce((sum, item) => sum + item.total_amount, 0);
  const allPayments = settlementItems.flatMap((item) => item.payments);
  const paidCount = allPayments.filter((p) => p.is_paid).length;
  const unpaidCount = allPayments.filter((p) => !p.is_paid).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="정산 관리"
        description={event.title}
        action={
          <div className="flex items-center gap-2">
            <SendReminderButton eventId={eventId} />
            <SettlementItemForm eventId={eventId} confirmedMembers={confirmedMembers} />
          </div>
        }
      />

      {/* 입금 계좌 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">입금 계좌</CardTitle>
            <BankAccountForm eventId={eventId} existingAccount={bankAccount} />
          </div>
        </CardHeader>
        <CardContent>
          {bankAccount ? (
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">은행명</span>{" "}
                <span className="font-medium">{bankAccount.bank_name}</span>
              </p>
              <p>
                <span className="text-muted-foreground">계좌번호</span>{" "}
                <span className="font-medium">{bankAccount.account_number}</span>
              </p>
              <p>
                <span className="text-muted-foreground">예금주</span>{" "}
                <span className="font-medium">{bankAccount.account_holder}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">등록된 계좌가 없습니다</p>
          )}
        </CardContent>
      </Card>

      {/* 정산 요약 — 항목이 있을 때만 표시 */}
      {settlementItems.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">{totalAmount.toLocaleString()}원</p>
              <p className="text-xs text-muted-foreground">총 정산 금액</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{paidCount}명</p>
              <p className="text-xs text-muted-foreground">납부 완료</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {unpaidCount}명
              </p>
              <p className="text-xs text-muted-foreground">미납</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator />

      {/* 정산 항목 목록 */}
      {settlementItems.length === 0 ? (
        <EmptyState
          title="등록된 정산 항목이 없습니다"
          description="비용 항목을 추가해주세요"
          action={<SettlementItemForm eventId={eventId} confirmedMembers={confirmedMembers} />}
        />
      ) : (
        <div className="space-y-4">
          {settlementItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {item.total_amount.toLocaleString()}원 · {SPLIT_TYPE_LABEL[item.split_type]}
                    </p>
                  </div>
                  {/* 삭제 버튼 — Server Action 바인딩 */}
                  <form
                    action={async () => {
                      "use server";
                      await deleteSettlementItem(item.id, eventId);
                    }}
                  >
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive"
                    >
                      삭제
                    </Button>
                  </form>
                </div>
              </CardHeader>

              <CardContent>
                {item.payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">결제 정보가 없습니다</p>
                ) : (
                  <>
                    {/* 모바일 결제 목록 */}
                    <div className="flex flex-col gap-2 sm:hidden">
                      {item.payments.map((payment) => {
                        const memberName =
                          payment.member.profile.full_name ??
                          payment.member.profile.email ??
                          "알 수 없음";
                        return (
                          <div key={payment.id} className="flex items-center justify-between">
                            {/* 왼쪽: 이름과 금액 */}
                            <div>
                              <p className="text-sm font-medium">{memberName}</p>
                              <p className="text-sm text-muted-foreground">
                                {payment.amount.toLocaleString()}원
                                {payment.ratio !== null && (
                                  <span className="ml-1 text-xs">({payment.ratio}%)</span>
                                )}
                              </p>
                            </div>
                            {/* 오른쪽: 상태 뱃지와 납부 확인 버튼 */}
                            <div className="flex items-center gap-2">
                              <PaymentStatusBadge status={payment.is_paid ? "paid" : "pending"} />
                              <PaymentToggleButton
                                paymentId={payment.id}
                                isPaid={payment.is_paid}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 데스크톱 테이블 */}
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
                          {item.payments.map((payment) => {
                            const memberName =
                              payment.member.profile.full_name ??
                              payment.member.profile.email ??
                              "알 수 없음";
                            return (
                              <TableRow key={payment.id}>
                                <TableCell className="text-sm">{memberName}</TableCell>
                                <TableCell className="text-right text-sm">
                                  {payment.amount.toLocaleString()}원
                                  {payment.ratio !== null && (
                                    <span className="ml-1 text-xs text-muted-foreground">
                                      ({payment.ratio}%)
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <PaymentStatusBadge
                                    status={payment.is_paid ? "paid" : "pending"}
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  <PaymentToggleButton
                                    paymentId={payment.id}
                                    isPaid={payment.is_paid}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
