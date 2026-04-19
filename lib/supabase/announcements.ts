import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

/**
 * 공지 상세 타입 — 저자, 댓글(+댓글 저자), 리액션 집계 포함
 */
export type AnnouncementWithDetails = Tables<"announcements"> & {
  author: Pick<Tables<"profiles">, "id" | "full_name" | "email">;
  comments: Array<
    Tables<"announcement_comments"> & {
      author: Pick<Tables<"profiles">, "id" | "full_name" | "email">;
    }
  >;
  reactions: Array<{ emoji: string; count: number; reactedByMe: boolean }>;
};

/**
 * 특정 이벤트의 공지 목록 조회
 * - 고정 공지 우선, 최신순 정렬
 * - 저자 프로필, 댓글, 리액션 집계 포함
 */
export async function getAnnouncementsByEventId(
  eventId: string,
): Promise<AnnouncementWithDetails[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("event_id", eventId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !announcements) return [];

  // 공지 저자 프로필 일괄 조회
  const authorIds = [...new Set(announcements.map((a) => a.author_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", authorIds);
  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const announcementIds = announcements.map((a) => a.id);

  // 댓글 일괄 조회
  const { data: comments } = await supabase
    .from("announcement_comments")
    .select("*")
    .in("announcement_id", announcementIds)
    .order("created_at", { ascending: true });

  // 댓글 저자 프로필 일괄 조회
  const commentAuthorIds = [...new Set((comments ?? []).map((c) => c.author_id))];
  let commentProfileMap = new Map<string, Pick<Tables<"profiles">, "id" | "full_name" | "email">>();
  if (commentAuthorIds.length > 0) {
    const { data: commentProfiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", commentAuthorIds);
    commentProfileMap = new Map((commentProfiles ?? []).map((p) => [p.id, p]));
  }

  // 리액션 일괄 조회
  const { data: reactions } = await supabase
    .from("announcement_reactions")
    .select("announcement_id, emoji, user_id")
    .in("announcement_id", announcementIds);

  return announcements.map((a) => {
    // 공지 저자
    const author = profileMap.get(a.author_id) ?? {
      id: a.author_id,
      full_name: null,
      email: "",
    };

    // 댓글 + 댓글 저자 매핑
    const announcementComments = (comments ?? [])
      .filter((c) => c.announcement_id === a.id)
      .map((c) => ({
        ...c,
        author: commentProfileMap.get(c.author_id) ?? {
          id: c.author_id,
          full_name: null,
          email: "",
        },
      }));

    // 리액션 이모지별 집계
    const announcementReactions = (reactions ?? []).filter((r) => r.announcement_id === a.id);
    const emojiMap = new Map<string, { count: number; reactedByMe: boolean }>();
    for (const r of announcementReactions) {
      const existing = emojiMap.get(r.emoji) ?? { count: 0, reactedByMe: false };
      emojiMap.set(r.emoji, {
        count: existing.count + 1,
        reactedByMe: existing.reactedByMe || r.user_id === user?.id,
      });
    }

    return {
      ...a,
      author,
      comments: announcementComments,
      reactions: [...emojiMap.entries()].map(([emoji, data]) => ({ emoji, ...data })),
    };
  });
}
