"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/api";
import type { Tables } from "@/types/database.types";

/**
 * 이벤트 참가 신청
 * - 중복 신청 방지
 * - 정원 초과 시 자동으로 waiting 상태로 등록
 * - manual 승인 이벤트는 항상 waiting 상태로 시작
 */
export async function applyToEvent(
  eventId: string,
  note?: string,
): Promise<ActionResult<Tables<"event_members">>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 중복 신청 체크
  const { data: existing } = await supabase
    .from("event_members")
    .select("id, status")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return { success: false, error: "이미 신청한 모임입니다", code: "DUPLICATE" };

  // 이벤트 정보 조회
  const { data: event } = await supabase
    .from("events")
    .select("status, approval_type, max_participants, registration_deadline")
    .eq("id", eventId)
    .single();

  if (!event) return { success: false, error: "모임을 찾을 수 없습니다", code: "NOT_FOUND" };

  if (event.status === "closed" || event.status === "cancelled") {
    return { success: false, error: "마감된 모임입니다", code: "FORBIDDEN" };
  }

  if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
    return { success: false, error: "신청 마감일이 지났습니다", code: "FORBIDDEN" };
  }

  // 확정 인원 수 조회 (정원 확인)
  const { count: confirmedCount } = await supabase
    .from("event_members")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("status", "confirmed");

  const isFull = (confirmedCount ?? 0) >= event.max_participants;

  // manual 승인 이거나 정원 초과면 waiting, 아니면 confirmed
  const status: Tables<"event_members">["status"] =
    event.approval_type === "manual" || isFull ? "waiting" : "confirmed";

  const { data, error } = await supabase
    .from("event_members")
    .insert({
      event_id: eventId,
      user_id: user.id,
      status,
      note: note ?? null,
      applied_at: new Date().toISOString(),
      ...(status === "confirmed" && { confirmed_at: new Date().toISOString() }),
    })
    .select()
    .single();

  if (error) return { success: false, error: "신청에 실패했습니다", code: "INTERNAL" };

  revalidatePath(`/events`);
  return { success: true, data };
}

/**
 * 멤버 상태 변경 (주최자 전용)
 * - confirmed → rejected 시 대기자 자동 승격 트리거
 */
export async function updateMemberStatus(
  memberId: string,
  newStatus: "confirmed" | "rejected",
): Promise<ActionResult<Tables<"event_members">>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 현재 멤버 정보 조회
  const { data: member } = await supabase
    .from("event_members")
    .select("event_id, status")
    .eq("id", memberId)
    .single();

  if (!member) return { success: false, error: "멤버를 찾을 수 없습니다", code: "NOT_FOUND" };

  // 주최자 권한 확인
  const { data: event } = await supabase
    .from("events")
    .select("host_id")
    .eq("id", member.event_id)
    .single();

  if (!event || event.host_id !== user.id) {
    return { success: false, error: "권한이 없습니다", code: "FORBIDDEN" };
  }

  const { data, error } = await supabase
    .from("event_members")
    .update({
      status: newStatus,
      ...(newStatus === "confirmed" && { confirmed_at: new Date().toISOString() }),
      ...(newStatus === "rejected" && { rejected_at: new Date().toISOString() }),
    })
    .eq("id", memberId)
    .select()
    .single();

  if (error) return { success: false, error: "상태 변경에 실패했습니다", code: "INTERNAL" };

  // 확정 취소(confirmed → rejected) 시 대기자 자동 승격
  if (newStatus === "rejected" && member.status === "confirmed") {
    await supabase.rpc("promote_next_waitlist", { p_event_id: member.event_id });
  }

  revalidatePath(`/manage/${member.event_id}/members`);
  return { success: true, data };
}

/**
 * 본인 참가 신청 취소
 * - 확정 상태 취소 시 대기자 자동 승격 트리거
 */
export async function cancelMyApplication(memberId: string): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  const { data: member } = await supabase
    .from("event_members")
    .select("event_id, user_id, status")
    .eq("id", memberId)
    .single();

  if (!member) return { success: false, error: "신청 내역을 찾을 수 없습니다", code: "NOT_FOUND" };
  if (member.user_id !== user.id)
    return { success: false, error: "권한이 없습니다", code: "FORBIDDEN" };

  const wasConfirmed = member.status === "confirmed";
  const eventId = member.event_id;

  const { error } = await supabase.from("event_members").delete().eq("id", memberId);
  if (error) return { success: false, error: "취소에 실패했습니다", code: "INTERNAL" };

  // 확정 인원 취소 시 대기자 자동 승격
  if (wasConfirmed) {
    await supabase.rpc("promote_next_waitlist", { p_event_id: eventId });
  }

  revalidatePath(`/events`);
  return { success: true, data: { id: memberId } };
}
