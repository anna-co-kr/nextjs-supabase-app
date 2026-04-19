import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileUpdate } from "@/types/database.types";

/**
 * 현재 로그인한 사용자의 프로필을 조회합니다.
 * Server Component 또는 Server Action에서 사용합니다.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (error) {
    console.error("[getProfile] error:", error.message);
    return null;
  }

  return data;
}

/**
 * 특정 사용자 ID로 프로필을 조회합니다.
 * RLS 정책이 퍼블릭 SELECT를 허용하는 경우에만 동작합니다.
 */
export async function getProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

  if (error) {
    console.error("[getProfileById] error:", error.message);
    return null;
  }

  return data;
}

/**
 * 현재 로그인한 사용자의 프로필을 수정합니다.
 * Server Action에서 사용합니다.
 */
export async function updateProfile(
  updates: Omit<ProfileUpdate, "id" | "email" | "created_at" | "updated_at">,
): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "인증되지 않은 사용자입니다." };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("[updateProfile] error:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * 트리거 실패 시 백업용 — profiles 레코드가 없으면 생성합니다.
 * 회원가입 직후 트리거가 실패했을 때 호출하여 프로필을 보장합니다.
 */
export async function ensureProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 이미 프로필이 존재하면 그대로 반환
  const existing = await getProfile();
  if (existing) return existing;

  // 프로필이 없으면 새로 생성
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      email: user.email ?? "",
      full_name:
        (user.user_metadata?.full_name as string | undefined) ??
        (user.user_metadata?.name as string | undefined) ??
        user.email?.split("@")[0] ??
        "",
    })
    .select()
    .single();

  if (error) {
    console.error("[ensureProfile] error:", error.message);
    return null;
  }
  return data;
}
