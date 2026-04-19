"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  settlementItemBaseSchema,
  settlementItemUpdateSchema,
  bankAccountSchema,
  type SettlementItemCreateInput,
  type SettlementItemUpdateInput,
  type BankAccountInput,
} from "@/lib/schemas/settlement";
import { calculatePayments } from "@/lib/utils/settlement";
import { getConfirmedMembers, getBankAccount } from "@/lib/supabase/settlements";
import { sendUnpaidReminderEmail } from "@/lib/email/resend";
import type { ActionResult } from "@/lib/types/api";
import type { Tables } from "@/types/database.types";

// ---------------------------------------------------------------------------
// 내부 헬퍼 — 이벤트 host_id 조회
// ---------------------------------------------------------------------------
async function getEventHostId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventId: string,
): Promise<string | null> {
  const { data } = await supabase.from("events").select("host_id").eq("id", eventId).single();
  return data?.host_id ?? null;
}

// ---------------------------------------------------------------------------
// 정산 항목 생성 — 주최자만 가능
// ---------------------------------------------------------------------------
export async function createSettlementItem(
  input: SettlementItemCreateInput,
): Promise<ActionResult<Tables<"settlement_items">>> {
  // 1. Zod 검증
  const parsed = settlementItemBaseSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다",
      code: "VALIDATION",
    };
  }

  // 2. 인증 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 3. 주최자 권한 확인
  const hostId = await getEventHostId(supabase, parsed.data.eventId);
  if (!hostId) return { success: false, error: "이벤트를 찾을 수 없습니다", code: "NOT_FOUND" };
  if (hostId !== user.id)
    return { success: false, error: "주최자만 정산 항목을 추가할 수 있습니다", code: "FORBIDDEN" };

  // 4. 확정 멤버 조회
  const confirmedMembers = await getConfirmedMembers(parsed.data.eventId);
  if (confirmedMembers.length === 0) {
    return {
      success: false,
      error: "확정된 참여자가 없어 정산 항목을 생성할 수 없습니다",
      code: "VALIDATION",
    };
  }

  const memberIds = confirmedMembers.map((m) => m.id);

  // 5. 정산 항목 삽입
  const { data: item, error: itemError } = await supabase
    .from("settlement_items")
    .insert({
      event_id: parsed.data.eventId,
      name: parsed.data.name,
      total_amount: parsed.data.total_amount,
      split_type: parsed.data.split_type,
    })
    .select()
    .single();

  if (itemError || !item) {
    return { success: false, error: "정산 항목 생성에 실패했습니다", code: "INTERNAL" };
  }

  // 6. 분담 금액 계산
  const payments = buildCalculatedPayments(parsed.data, memberIds);

  // 7. settlement_payments 일괄 삽입
  const paymentRows = payments.map((p) => ({
    settlement_item_id: item.id,
    event_member_id: p.eventMemberId,
    amount: p.amount,
    ratio: p.ratio ?? null,
    is_paid: false,
  }));

  const { error: paymentsError } = await supabase.from("settlement_payments").insert(paymentRows);

  if (paymentsError) {
    // 항목 롤백 (payments 삽입 실패 시 item도 삭제)
    await supabase.from("settlement_items").delete().eq("id", item.id);
    return { success: false, error: "결제 정보 생성에 실패했습니다", code: "INTERNAL" };
  }

  // 8. 캐시 무효화
  revalidatePath(`/(protected)/manage/${parsed.data.eventId}/settlements`);

  return { success: true, data: item };
}

// ---------------------------------------------------------------------------
// 정산 항목 수정 — 주최자만 가능
// ---------------------------------------------------------------------------
export async function updateSettlementItem(
  input: SettlementItemUpdateInput,
): Promise<ActionResult<Tables<"settlement_items">>> {
  // 1. Zod 검증
  const parsed = settlementItemUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다",
      code: "VALIDATION",
    };
  }

  // 2. 인증 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 3. 기존 항목에서 event_id 조회
  const { data: existing } = await supabase
    .from("settlement_items")
    .select("event_id")
    .eq("id", parsed.data.id)
    .single();

  if (!existing)
    return { success: false, error: "정산 항목을 찾을 수 없습니다", code: "NOT_FOUND" };

  // 4. 주최자 권한 확인
  const hostId = await getEventHostId(supabase, existing.event_id);
  if (hostId !== user.id)
    return { success: false, error: "주최자만 정산 항목을 수정할 수 있습니다", code: "FORBIDDEN" };

  // 5. 확정 멤버 조회
  const confirmedMembers = await getConfirmedMembers(existing.event_id);
  const memberIds = confirmedMembers.map((m) => m.id);

  // 6. 항목 업데이트
  const { data: item, error: itemError } = await supabase
    .from("settlement_items")
    .update({
      name: parsed.data.name,
      total_amount: parsed.data.total_amount,
      split_type: parsed.data.split_type,
    })
    .eq("id", parsed.data.id)
    .select()
    .single();

  if (itemError || !item) {
    return { success: false, error: "정산 항목 수정에 실패했습니다", code: "INTERNAL" };
  }

  // 7. 기존 결제 정보 삭제 후 재계산
  await supabase.from("settlement_payments").delete().eq("settlement_item_id", parsed.data.id);

  // 8. 분담 금액 재계산
  const payments = buildCalculatedPayments(parsed.data, memberIds);

  // 9. 결제 정보 재삽입
  if (payments.length > 0) {
    const paymentRows = payments.map((p) => ({
      settlement_item_id: parsed.data.id,
      event_member_id: p.eventMemberId,
      amount: p.amount,
      ratio: p.ratio ?? null,
      is_paid: false,
    }));

    const { error: paymentsError } = await supabase.from("settlement_payments").insert(paymentRows);

    if (paymentsError) {
      return { success: false, error: "결제 정보 업데이트에 실패했습니다", code: "INTERNAL" };
    }
  }

  // 10. 캐시 무효화
  revalidatePath(`/(protected)/manage/${existing.event_id}/settlements`);

  return { success: true, data: item };
}

// ---------------------------------------------------------------------------
// 정산 항목 삭제 — 주최자만 가능 (cascade로 payments도 삭제됨)
// ---------------------------------------------------------------------------
export async function deleteSettlementItem(
  itemId: string,
  eventId: string,
): Promise<ActionResult<{ id: string }>> {
  // 인증 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 주최자 권한 확인
  const hostId = await getEventHostId(supabase, eventId);
  if (!hostId) return { success: false, error: "이벤트를 찾을 수 없습니다", code: "NOT_FOUND" };
  if (hostId !== user.id)
    return { success: false, error: "주최자만 정산 항목을 삭제할 수 있습니다", code: "FORBIDDEN" };

  // 항목 삭제 (DB cascade로 settlement_payments도 함께 삭제)
  const { error } = await supabase.from("settlement_items").delete().eq("id", itemId);

  if (error) return { success: false, error: "정산 항목 삭제에 실패했습니다", code: "INTERNAL" };

  revalidatePath(`/(protected)/manage/${eventId}/settlements`);

  return { success: true, data: { id: itemId } };
}

// ---------------------------------------------------------------------------
// 입금 계좌 등록/수정 — 주최자만 가능 (UNIQUE 제약 없으므로 기존 레코드 분기 처리)
// ---------------------------------------------------------------------------
export async function upsertBankAccount(
  eventId: string,
  input: BankAccountInput,
): Promise<ActionResult<Tables<"host_bank_accounts">>> {
  // 1. Zod 검증
  const parsed = bankAccountSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다",
      code: "VALIDATION",
    };
  }

  // 2. 인증 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 3. 주최자 권한 확인
  const hostId = await getEventHostId(supabase, eventId);
  if (!hostId) return { success: false, error: "이벤트를 찾을 수 없습니다", code: "NOT_FOUND" };
  if (hostId !== user.id)
    return { success: false, error: "주최자만 계좌를 등록할 수 있습니다", code: "FORBIDDEN" };

  // 4. 기존 계좌 조회 후 insert / update 분기
  const existing = await getBankAccount(eventId);

  let data: Tables<"host_bank_accounts"> | null = null;
  let error: { message: string } | null = null;

  if (existing) {
    // 기존 레코드 수정
    const result = await supabase
      .from("host_bank_accounts")
      .update({
        bank_name: parsed.data.bank_name,
        account_number: parsed.data.account_number,
        account_holder: parsed.data.account_holder,
      })
      .eq("id", existing.id)
      .select()
      .single();
    data = result.data;
    error = result.error;
  } else {
    // 신규 계좌 등록
    const result = await supabase
      .from("host_bank_accounts")
      .insert({
        event_id: eventId,
        host_id: user.id,
        bank_name: parsed.data.bank_name,
        account_number: parsed.data.account_number,
        account_holder: parsed.data.account_holder,
      })
      .select()
      .single();
    data = result.data;
    error = result.error;
  }

  if (error || !data) {
    return { success: false, error: "계좌 저장에 실패했습니다", code: "INTERNAL" };
  }

  // 5. 캐시 무효화
  revalidatePath(`/(protected)/manage/${eventId}/settlements`);

  return { success: true, data };
}

// ---------------------------------------------------------------------------
// 납부 상태 토글 — 주최자만 가능
// ---------------------------------------------------------------------------
export async function togglePaymentStatus(
  paymentId: string,
  isPaid: boolean,
): Promise<ActionResult<Tables<"settlement_payments">>> {
  // 1. 인증 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 2. payment 조회 → settlement_item_id → event_id 체인
  const { data: payment } = await supabase
    .from("settlement_payments")
    .select("id, settlement_item_id")
    .eq("id", paymentId)
    .single();

  if (!payment) return { success: false, error: "결제 정보를 찾을 수 없습니다", code: "NOT_FOUND" };

  // 3. settlement_items → event_id 조회
  const { data: item } = await supabase
    .from("settlement_items")
    .select("event_id")
    .eq("id", payment.settlement_item_id)
    .single();

  if (!item) return { success: false, error: "정산 항목을 찾을 수 없습니다", code: "NOT_FOUND" };

  // 4. 주최자 권한 확인
  const hostId = await getEventHostId(supabase, item.event_id);
  if (!hostId) return { success: false, error: "이벤트를 찾을 수 없습니다", code: "NOT_FOUND" };
  if (hostId !== user.id)
    return { success: false, error: "주최자만 납부 상태를 변경할 수 있습니다", code: "FORBIDDEN" };

  // 5. is_paid 업데이트 (납부 시 paid_at 기록, 취소 시 null)
  const { data: updated, error: updateError } = await supabase
    .from("settlement_payments")
    .update({
      is_paid: isPaid,
      paid_at: isPaid ? new Date().toISOString() : null,
    })
    .eq("id", paymentId)
    .select()
    .single();

  if (updateError || !updated) {
    return { success: false, error: "납부 상태 변경에 실패했습니다", code: "INTERNAL" };
  }

  // 6. 캐시 무효화
  revalidatePath(`/(protected)/manage/${item.event_id}/settlements`);

  return { success: true, data: updated };
}

// ---------------------------------------------------------------------------
// 미납자 리마인더 발송 — 주최자만 가능, 24시간 쿨다운 적용
// ---------------------------------------------------------------------------
export async function sendUnpaidReminders(
  eventId: string,
): Promise<ActionResult<{ sent: number; skipped: number }>> {
  // 1. 인증 확인
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 2. 주최자 권한 확인
  const hostId = await getEventHostId(supabase, eventId);
  if (!hostId) return { success: false, error: "이벤트를 찾을 수 없습니다", code: "NOT_FOUND" };
  if (hostId !== user.id)
    return { success: false, error: "주최자만 리마인더를 발송할 수 있습니다", code: "FORBIDDEN" };

  // 3. 이벤트 정보 조회 (이메일 템플릿용)
  const { data: event } = await supabase
    .from("events")
    .select("id, title, starts_at, share_token")
    .eq("id", eventId)
    .single();
  if (!event) return { success: false, error: "이벤트를 찾을 수 없습니다", code: "NOT_FOUND" };

  // 4. 계좌 정보 조회
  const bankAccount = await getBankAccount(eventId);

  // 5. 해당 이벤트의 정산 항목 ID 목록 조회
  const { data: settlementItems } = await supabase
    .from("settlement_items")
    .select("id")
    .eq("event_id", eventId);

  if (!settlementItems || settlementItems.length === 0) {
    return { success: true, data: { sent: 0, skipped: 0 } };
  }

  const itemIds = settlementItems.map((i) => i.id);

  // 6. 미납 결제 목록 조회 — event_members까지 조인 (user_id, member id 필요)
  const { data: unpaidPayments } = await supabase
    .from("settlement_payments")
    .select("id, amount, event_member_id, event_members!inner(id, user_id)")
    .eq("is_paid", false)
    .in("settlement_item_id", itemIds);

  if (!unpaidPayments || unpaidPayments.length === 0) {
    return { success: true, data: { sent: 0, skipped: 0 } };
  }

  // 7. 멤버별 미납 총액 집계 (같은 멤버가 여러 항목 미납인 경우 합산)
  type MemberUnpaid = {
    memberId: string;
    userId: string;
    totalAmount: number;
  };

  const memberMap = new Map<string, MemberUnpaid>();
  for (const payment of unpaidPayments) {
    const member = payment.event_members;
    // Supabase join 결과는 단일 객체 또는 배열일 수 있음 — 안전하게 처리
    const memberData = Array.isArray(member) ? member[0] : member;
    if (!memberData) continue;

    const existing = memberMap.get(memberData.id);
    if (existing) {
      existing.totalAmount += payment.amount;
    } else {
      memberMap.set(memberData.id, {
        memberId: memberData.id,
        userId: memberData.user_id,
        totalAmount: payment.amount,
      });
    }
  }

  // 8. 미납 멤버의 이메일 일괄 조회
  const userIds = [...memberMap.values()].map((m) => m.userId);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  // 9. 24시간 쿨다운 체크 — 최근 발송 이력 조회
  const memberIds = [...memberMap.keys()];
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentLogs } = await supabase
    .from("reminder_logs")
    .select("member_id")
    .eq("event_id", eventId)
    .eq("reminder_type", "unpaid_reminder")
    .in("member_id", memberIds)
    .gte("sent_at", cutoff);

  const cooledDownMemberIds = new Set((recentLogs ?? []).map((l) => l.member_id));

  // 10. 발송 실행
  let sent = 0;
  let skipped = 0;

  for (const [memberId, unpaid] of memberMap.entries()) {
    // 쿨다운 중인 멤버는 건너뜀
    if (cooledDownMemberIds.has(memberId)) {
      skipped++;
      continue;
    }

    const profile = profileMap.get(unpaid.userId);
    if (!profile?.email) {
      skipped++;
      continue;
    }

    // 이메일 발송
    const success = await sendUnpaidReminderEmail(
      profile.email,
      {
        title: event.title,
        startsAt: event.starts_at,
        shareToken: event.share_token,
      },
      unpaid.totalAmount,
      bankAccount
        ? {
            bank_name: bankAccount.bank_name,
            account_number: bankAccount.account_number,
            account_holder: bankAccount.account_holder,
          }
        : null,
    );

    if (success) {
      // 발송 이력 기록
      await supabase.from("reminder_logs").insert({
        event_id: eventId,
        user_id: unpaid.userId,
        member_id: memberId,
        reminder_type: "unpaid_reminder",
      });
      sent++;
    } else {
      skipped++;
    }
  }

  // 11. 캐시 무효화
  revalidatePath(`/(protected)/manage/${eventId}/settlements`);

  return { success: true, data: { sent, skipped } };
}

// ---------------------------------------------------------------------------
// 내부 헬퍼 — 입력 타입에서 calculatePayments 호출 인자 구성
// ---------------------------------------------------------------------------
function buildCalculatedPayments(
  data: SettlementItemCreateInput | SettlementItemUpdateInput,
  memberIds: string[],
): ReturnType<typeof calculatePayments> {
  if (data.split_type === "equal") {
    return calculatePayments(data.total_amount, memberIds, { splitType: "equal" });
  }

  if (data.split_type === "individual" && data.individual_amounts) {
    // individual_amounts를 memberIds 순서에 맞게 재매핑
    const amountMap = new Map(data.individual_amounts.map((a) => [a.eventMemberId, a.amount]));
    const amounts = memberIds.map((id) => amountMap.get(id) ?? 0);
    return calculatePayments(data.total_amount, memberIds, { splitType: "individual", amounts });
  }

  if (data.split_type === "ratio" && data.ratios) {
    // ratios를 memberIds 순서에 맞게 재매핑
    const ratioMap = new Map(data.ratios.map((r) => [r.eventMemberId, r.ratio]));
    const ratios = memberIds.map((id) => ratioMap.get(id) ?? 0);
    return calculatePayments(data.total_amount, memberIds, { splitType: "ratio", ratios });
  }

  // fallback: 균등 분할
  return calculatePayments(data.total_amount, memberIds, { splitType: "equal" });
}
