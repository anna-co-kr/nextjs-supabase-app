"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { eventCreateSchema, eventUpdateSchema } from "@/lib/schemas/event";
import type { ActionResult } from "@/lib/types/api";
import type { EventRow } from "@/types/database.types";

export async function createEvent(
  input: unknown,
): Promise<ActionResult<{ id: string; shareToken: string }>> {
  const parsed = eventCreateSchema.safeParse(input);
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

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      event_type: parsed.data.eventType,
      approval_type: parsed.data.approvalType,
      max_participants: parsed.data.maxParticipants,
      starts_at: parsed.data.startsAt,
      ends_at: parsed.data.endsAt ?? null,
      location: parsed.data.location ?? null,
      registration_deadline: parsed.data.registrationDeadline ?? null,
      host_id: user.id,
      status: "open",
    })
    .select("id, share_token")
    .single();

  if (error) return { success: false, error: "모임 생성에 실패했습니다", code: "INTERNAL" };

  revalidatePath("/dashboard");
  return { success: true, data: { id: data.id, shareToken: data.share_token } };
}

export async function updateEvent(input: unknown): Promise<ActionResult<EventRow>> {
  const parsed = eventUpdateSchema.safeParse(input);
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

  const { id, ...fields } = parsed.data;

  const { data, error } = await supabase
    .from("events")
    .update({
      ...(fields.title !== undefined && { title: fields.title }),
      ...(fields.description !== undefined && { description: fields.description }),
      ...(fields.eventType !== undefined && { event_type: fields.eventType }),
      ...(fields.approvalType !== undefined && { approval_type: fields.approvalType }),
      ...(fields.maxParticipants !== undefined && { max_participants: fields.maxParticipants }),
      ...(fields.startsAt !== undefined && { starts_at: fields.startsAt }),
      ...(fields.endsAt !== undefined && { ends_at: fields.endsAt }),
      ...(fields.location !== undefined && { location: fields.location }),
      ...(fields.registrationDeadline !== undefined && {
        registration_deadline: fields.registrationDeadline,
      }),
      ...(fields.status !== undefined && { status: fields.status }),
    })
    .eq("id", id)
    .eq("host_id", user.id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116")
      return { success: false, error: "수정 권한이 없습니다", code: "FORBIDDEN" };
    return { success: false, error: "모임 수정에 실패했습니다", code: "INTERNAL" };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/manage/${id}`);
  return { success: true, data };
}

export async function deleteEvent(id: string): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "로그인이 필요합니다", code: "UNAUTHORIZED" };

  const { error } = await supabase.from("events").delete().eq("id", id).eq("host_id", user.id);

  if (error) {
    if (error.code === "PGRST116")
      return { success: false, error: "삭제 권한이 없습니다", code: "FORBIDDEN" };
    return { success: false, error: "모임 삭제에 실패했습니다", code: "INTERNAL" };
  }

  revalidatePath("/dashboard");
  return { success: true, data: { id } };
}
