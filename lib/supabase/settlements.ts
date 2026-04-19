import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

/**
 * 현재 사용자의 이벤트 정산 현황 조회
 * - 확정 참여자 여부 확인 후, 본인 납부 내역과 계좌 정보 반환
 * - 확정 참여자가 아니면 null 반환
 */
export type MySettlementStatus = {
  memberId: string;
  payments: (Tables<"settlement_payments"> & {
    settlement_item: Tables<"settlement_items">;
  })[];
  bankAccount: Tables<"host_bank_accounts"> | null;
  totalDue: number;
  allPaid: boolean;
};

export async function getMySettlementStatus(
  eventId: string,
  userId: string,
): Promise<MySettlementStatus | null> {
  const supabase = await createClient();

  // 1. 확정 참여자 여부 확인
  const { data: member } = await supabase
    .from("event_members")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .eq("status", "confirmed")
    .maybeSingle();

  if (!member) return null;

  // 2. 본인 납부 내역 조회 (정산 항목 포함)
  const { data: payments } = await supabase
    .from("settlement_payments")
    .select("*, settlement_item:settlement_items(*)")
    .eq("event_member_id", member.id);

  // 3. 이벤트 입금 계좌 조회
  const { data: bankAccount } = await supabase
    .from("host_bank_accounts")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();

  const safePayments = (payments ?? []) as MySettlementStatus["payments"];
  const totalDue = safePayments.reduce((sum, p) => sum + p.amount, 0);
  const allPaid = safePayments.length > 0 && safePayments.every((p) => p.is_paid);

  return {
    memberId: member.id,
    payments: safePayments,
    bankAccount,
    totalDue,
    allPaid,
  };
}

/**
 * 프로필 정보를 포함한 확정 멤버 타입
 * event_members.user_id → profiles.id 조인 (직접 FK 없어서 별도 조회 후 병합)
 */
export type ConfirmedMemberWithProfile = Tables<"event_members"> & {
  profile: Pick<Tables<"profiles">, "id" | "full_name" | "email" | "avatar_url">;
};

/**
 * 결제 정보 — 멤버 및 프로필 포함
 */
export type SettlementPaymentWithMember = Tables<"settlement_payments"> & {
  member: ConfirmedMemberWithProfile;
};

/**
 * 정산 항목 — 결제 목록 포함
 */
export type SettlementItemWithPayments = Tables<"settlement_items"> & {
  payments: SettlementPaymentWithMember[];
};

/**
 * 이벤트의 입금 계좌 조회
 * - 계좌가 없으면 null 반환
 */
export async function getBankAccount(
  eventId: string,
): Promise<Tables<"host_bank_accounts"> | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("host_bank_accounts")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();
  return data;
}

/**
 * 이벤트의 확정 멤버 목록 조회
 * - status = 'confirmed' 인 멤버만
 * - 프로필 정보 별도 조회 후 병합
 */
export async function getConfirmedMembers(eventId: string): Promise<ConfirmedMemberWithProfile[]> {
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("event_members")
    .select("*")
    .eq("event_id", eventId)
    .eq("status", "confirmed")
    .order("applied_at", { ascending: true });

  if (error || !members || members.length === 0) return [];

  // user_id 목록으로 profiles 일괄 조회
  const userIds = members.map((m) => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .in("id", userIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  return members.map((m) => ({
    ...m,
    profile: profileMap.get(m.user_id) ?? {
      id: m.user_id,
      full_name: null,
      email: "",
      avatar_url: null,
    },
  }));
}

/**
 * 이벤트의 정산 항목 목록 조회
 * - 결제 정보(멤버 + 프로필) 포함
 * - 생성일 오름차순 정렬
 */
export async function getSettlementsByEventId(
  eventId: string,
): Promise<SettlementItemWithPayments[]> {
  const supabase = await createClient();

  // 1. 정산 항목 조회
  const { data: items, error: itemsError } = await supabase
    .from("settlement_items")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  if (itemsError || !items || items.length === 0) return [];

  // 2. 모든 항목의 결제 정보 일괄 조회
  const itemIds = items.map((i) => i.id);
  const { data: payments, error: paymentsError } = await supabase
    .from("settlement_payments")
    .select("*")
    .in("settlement_item_id", itemIds);

  if (paymentsError || !payments) {
    return items.map((item) => ({ ...item, payments: [] }));
  }

  // 3. 결제에 연관된 event_members 일괄 조회
  const memberIds = [...new Set(payments.map((p) => p.event_member_id))];
  const { data: members } = await supabase.from("event_members").select("*").in("id", memberIds);

  // 4. 멤버의 프로필 일괄 조회
  const userIds = [...new Set((members ?? []).map((m) => m.user_id))];
  const { data: profiles } =
    userIds.length > 0
      ? await supabase.from("profiles").select("id, full_name, email, avatar_url").in("id", userIds)
      : { data: [] };

  // Map 생성
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const memberMap = new Map(
    (members ?? []).map((m) => [
      m.id,
      {
        ...m,
        profile: profileMap.get(m.user_id) ?? {
          id: m.user_id,
          full_name: null,
          email: "",
          avatar_url: null,
        },
      } as ConfirmedMemberWithProfile,
    ]),
  );

  // 5. 항목별로 결제 정보 병합
  return items.map((item) => ({
    ...item,
    payments: payments
      .filter((p) => p.settlement_item_id === item.id)
      .map((p) => ({
        ...p,
        member: memberMap.get(p.event_member_id) ?? {
          // fallback: 멤버를 찾을 수 없는 경우
          id: p.event_member_id,
          event_id: eventId,
          user_id: "",
          status: "confirmed" as const,
          applied_at: "",
          confirmed_at: null,
          rejected_at: null,
          note: null,
          profile: { id: "", full_name: null, email: "", avatar_url: null },
        },
      })),
  }));
}
