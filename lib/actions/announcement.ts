"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  announcementCreateSchema,
  announcementUpdateSchema,
  commentCreateSchema,
  type AnnouncementCreateInput,
  type AnnouncementUpdateInput,
  type CommentCreateInput,
} from "@/lib/schemas/announcement";
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
// 공지 생성 — 주최자만 가능
// ---------------------------------------------------------------------------
export async function createAnnouncement(
  input: AnnouncementCreateInput,
): Promise<ActionResult<Tables<"announcements">>> {
  const parsed = announcementCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다",
      code: "VALIDATION",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  const hostId = await getEventHostId(supabase, parsed.data.eventId);
  if (!hostId) return { success: false, error: "이벤트를 찾을 수 없습니다", code: "NOT_FOUND" };
  if (hostId !== user.id)
    return { success: false, error: "주최자만 공지를 작성할 수 있습니다", code: "FORBIDDEN" };

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      event_id: parsed.data.eventId,
      author_id: user.id,
      title: parsed.data.title,
      body: parsed.data.body,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: "공지 작성에 실패했습니다", code: "INTERNAL" };
  }

  revalidatePath(`/manage/${parsed.data.eventId}/announcements`);
  revalidatePath(`/manage/${parsed.data.eventId}/announcements-list`);
  return { success: true, data };
}

// ---------------------------------------------------------------------------
// 공지 수정 — 주최자만 가능
// ---------------------------------------------------------------------------
export async function updateAnnouncement(
  input: AnnouncementUpdateInput,
): Promise<ActionResult<Tables<"announcements">>> {
  const parsed = announcementUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다",
      code: "VALIDATION",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 공지 조회하여 event_id 확인
  const { data: existing } = await supabase
    .from("announcements")
    .select("event_id, author_id")
    .eq("id", parsed.data.id)
    .single();

  if (!existing) return { success: false, error: "공지를 찾을 수 없습니다", code: "NOT_FOUND" };

  const hostId = await getEventHostId(supabase, existing.event_id);
  if (hostId !== user.id)
    return { success: false, error: "주최자만 공지를 수정할 수 있습니다", code: "FORBIDDEN" };

  const updateData: { title?: string; body?: string; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.title !== undefined) updateData.title = parsed.data.title;
  if (parsed.data.body !== undefined) updateData.body = parsed.data.body;

  const { data, error } = await supabase
    .from("announcements")
    .update(updateData)
    .eq("id", parsed.data.id)
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: "공지 수정에 실패했습니다", code: "INTERNAL" };
  }

  revalidatePath(`/manage/${existing.event_id}/announcements`);
  revalidatePath(`/manage/${existing.event_id}/announcements-list`);
  return { success: true, data };
}

// ---------------------------------------------------------------------------
// 공지 삭제 — 주최자만 가능
// ---------------------------------------------------------------------------
export async function deleteAnnouncement(id: string): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 공지 조회하여 event_id 확인
  const { data: existing } = await supabase
    .from("announcements")
    .select("event_id")
    .eq("id", id)
    .single();

  if (!existing) return { success: false, error: "공지를 찾을 수 없습니다", code: "NOT_FOUND" };

  const hostId = await getEventHostId(supabase, existing.event_id);
  if (hostId !== user.id)
    return { success: false, error: "주최자만 공지를 삭제할 수 있습니다", code: "FORBIDDEN" };

  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) return { success: false, error: "공지 삭제에 실패했습니다", code: "INTERNAL" };

  revalidatePath(`/manage/${existing.event_id}/announcements`);
  revalidatePath(`/manage/${existing.event_id}/announcements-list`);
  return { success: true, data: { id } };
}

// ---------------------------------------------------------------------------
// 공지 고정/해제 토글 — 주최자만 가능
// ---------------------------------------------------------------------------
export async function togglePinAnnouncement(
  id: string,
): Promise<ActionResult<{ id: string; is_pinned: boolean }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  const { data: existing } = await supabase
    .from("announcements")
    .select("event_id, is_pinned")
    .eq("id", id)
    .single();

  if (!existing) return { success: false, error: "공지를 찾을 수 없습니다", code: "NOT_FOUND" };

  const hostId = await getEventHostId(supabase, existing.event_id);
  if (hostId !== user.id)
    return { success: false, error: "주최자만 공지를 고정/해제할 수 있습니다", code: "FORBIDDEN" };

  const { data, error } = await supabase
    .from("announcements")
    .update({ is_pinned: !existing.is_pinned, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, is_pinned")
    .single();

  if (error || !data)
    return { success: false, error: "공지 고정 처리에 실패했습니다", code: "INTERNAL" };

  revalidatePath(`/manage/${existing.event_id}/announcements`);
  revalidatePath(`/manage/${existing.event_id}/announcements-list`);
  return { success: true, data };
}

// ---------------------------------------------------------------------------
// 댓글 작성 — 확정 참여자 또는 주최자
// ---------------------------------------------------------------------------
export async function createComment(
  input: CommentCreateInput,
): Promise<ActionResult<Tables<"announcement_comments">>> {
  const parsed = commentCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다",
      code: "VALIDATION",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 공지의 event_id 조회
  const { data: announcement } = await supabase
    .from("announcements")
    .select("event_id")
    .eq("id", parsed.data.announcementId)
    .single();

  if (!announcement) return { success: false, error: "공지를 찾을 수 없습니다", code: "NOT_FOUND" };

  const hostId = await getEventHostId(supabase, announcement.event_id);

  // 주최자가 아닌 경우 확정 참여자 여부 확인
  if (hostId !== user.id) {
    const { data: membership } = await supabase
      .from("event_members")
      .select("id")
      .eq("event_id", announcement.event_id)
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .single();

    if (!membership) {
      return {
        success: false,
        error: "확정된 참여자만 댓글을 작성할 수 있습니다",
        code: "FORBIDDEN",
      };
    }
  }

  const { data, error } = await supabase
    .from("announcement_comments")
    .insert({
      announcement_id: parsed.data.announcementId,
      author_id: user.id,
      body: parsed.data.body,
    })
    .select()
    .single();

  if (error || !data) {
    return { success: false, error: "댓글 작성에 실패했습니다", code: "INTERNAL" };
  }

  revalidatePath(`/manage/${announcement.event_id}/announcements`);
  revalidatePath(`/manage/${announcement.event_id}/announcements-list`);
  return { success: true, data };
}

// ---------------------------------------------------------------------------
// 댓글 삭제 — 본인 댓글만
// ---------------------------------------------------------------------------
export async function deleteComment(id: string): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 댓글의 author_id와 announcement의 event_id 조회
  const { data: comment } = await supabase
    .from("announcement_comments")
    .select("author_id, announcement_id, announcements(event_id)")
    .eq("id", id)
    .single();

  if (!comment) return { success: false, error: "댓글을 찾을 수 없습니다", code: "NOT_FOUND" };
  if (comment.author_id !== user.id) {
    return { success: false, error: "본인 댓글만 삭제할 수 있습니다", code: "FORBIDDEN" };
  }

  const { error } = await supabase.from("announcement_comments").delete().eq("id", id);
  if (error) return { success: false, error: "댓글 삭제에 실패했습니다", code: "INTERNAL" };

  // event_id 추출 (join 결과)
  const eventId =
    comment.announcements && !Array.isArray(comment.announcements)
      ? comment.announcements.event_id
      : null;

  if (eventId) {
    revalidatePath(`/manage/${eventId}/announcements`);
    revalidatePath(`/manage/${eventId}/announcements-list`);
  }

  return { success: true, data: { id } };
}

// ---------------------------------------------------------------------------
// 리액션 토글 — 이미 있으면 DELETE, 없으면 INSERT
// ---------------------------------------------------------------------------
export async function toggleReaction(
  announcementId: string,
  emoji: string,
): Promise<ActionResult<{ added: boolean }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  // 공지의 event_id 조회
  const { data: announcement } = await supabase
    .from("announcements")
    .select("event_id")
    .eq("id", announcementId)
    .single();

  if (!announcement) return { success: false, error: "공지를 찾을 수 없습니다", code: "NOT_FOUND" };

  // 기존 리액션 존재 여부 확인
  const { data: existing } = await supabase
    .from("announcement_reactions")
    .select("id")
    .eq("announcement_id", announcementId)
    .eq("user_id", user.id)
    .eq("emoji", emoji)
    .maybeSingle();

  if (existing) {
    // 이미 리액션한 경우 — 삭제
    const { error } = await supabase.from("announcement_reactions").delete().eq("id", existing.id);
    if (error) return { success: false, error: "리액션 취소에 실패했습니다", code: "INTERNAL" };

    revalidatePath(`/manage/${announcement.event_id}/announcements-list`);
    return { success: true, data: { added: false } };
  } else {
    // 리액션 추가
    const { error } = await supabase.from("announcement_reactions").insert({
      announcement_id: announcementId,
      user_id: user.id,
      emoji,
    });
    if (error) return { success: false, error: "리액션 추가에 실패했습니다", code: "INTERNAL" };

    revalidatePath(`/manage/${announcement.event_id}/announcements-list`);
    return { success: true, data: { added: true } };
  }
}
