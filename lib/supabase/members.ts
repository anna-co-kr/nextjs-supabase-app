import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

// event_members와 profiles를 조인한 확장 타입
export type MemberWithProfile = Tables<"event_members"> & {
  profile: Pick<Tables<"profiles">, "id" | "full_name" | "email" | "avatar_url">;
};

/**
 * 특정 이벤트의 전체 멤버 목록을 프로필 정보와 함께 조회
 * event_members.user_id → profiles.id 로 조인 (직접 FK 없어서 profiles 별도 조회 후 병합)
 */
export async function getMembersByEventId(eventId: string): Promise<MemberWithProfile[]> {
  const supabase = await createClient();

  const { data: members, error } = await supabase
    .from("event_members")
    .select("*")
    .eq("event_id", eventId)
    .order("applied_at", { ascending: true });

  if (error || !members || members.length === 0) return [];

  // user_id 목록으로 profiles 일괄 조회
  const userIds = members.map((m) => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .in("id", userIds);

  // 프로필 Map 생성 (O(1) 조회를 위해)
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
