import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

export type EventRowWithCounts = Tables<"events"> & {
  confirmedCount: number;
  waitingCount: number;
  host: Pick<Tables<"profiles">, "id" | "full_name" | "email" | "avatar_url">;
};

export async function getMyHostingEvents(): Promise<EventRowWithCounts[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("host_id", user.id)
    .order("starts_at", { ascending: false });

  if (error || !events) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .eq("id", user.id)
    .single();

  const eventIds = events.map((e) => e.id);
  const { data: memberCounts } = await supabase
    .from("event_members")
    .select("event_id, status")
    .in("event_id", eventIds)
    .in("status", ["confirmed", "waiting"]);

  return events.map((event) => {
    const members = memberCounts?.filter((m) => m.event_id === event.id) ?? [];
    return {
      ...event,
      confirmedCount: members.filter((m) => m.status === "confirmed").length,
      waitingCount: members.filter((m) => m.status === "waiting").length,
      host: profile ?? { id: user.id, full_name: null, email: user.email ?? "", avatar_url: null },
    };
  });
}

export async function getEventById(id: string): Promise<EventRowWithCounts | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: event, error } = await supabase.from("events").select("*").eq("id", id).single();

  if (error || !event) return null;

  const { data: hostProfile } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .eq("id", event.host_id)
    .single();

  const { data: memberCounts } = await supabase
    .from("event_members")
    .select("status")
    .eq("event_id", id)
    .in("status", ["confirmed", "waiting"]);

  if (user && event.host_id !== user.id) {
    const { data: membership } = await supabase
      .from("event_members")
      .select("id")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .single();
    if (!membership) return null;
  }

  return {
    ...event,
    confirmedCount: memberCounts?.filter((m) => m.status === "confirmed").length ?? 0,
    waitingCount: memberCounts?.filter((m) => m.status === "waiting").length ?? 0,
    host: hostProfile ?? {
      id: event.host_id,
      full_name: null,
      email: "",
      avatar_url: null,
    },
  };
}

export async function getPublicEventByToken(token: string): Promise<EventRowWithCounts | null> {
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("share_token", token)
    .single();

  if (error || !event) return null;

  const { data: hostProfile } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .eq("id", event.host_id)
    .single();

  const { data: memberCounts } = await supabase
    .from("event_members")
    .select("status")
    .eq("event_id", event.id)
    .in("status", ["confirmed", "waiting"]);

  return {
    ...event,
    confirmedCount: memberCounts?.filter((m) => m.status === "confirmed").length ?? 0,
    waitingCount: memberCounts?.filter((m) => m.status === "waiting").length ?? 0,
    host: hostProfile ?? {
      id: event.host_id,
      full_name: null,
      email: "",
      avatar_url: null,
    },
  };
}

export async function getMyMembershipForEvent(
  eventId: string,
): Promise<Tables<"event_members"> | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("event_members")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  return data ?? null;
}

export async function getMyParticipatingEvents(): Promise<EventRowWithCounts[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: memberships, error: memberError } = await supabase
    .from("event_members")
    .select("event_id, status")
    .eq("user_id", user.id)
    .neq("status", "rejected");

  if (memberError || !memberships?.length) return [];

  const eventIds = memberships.map((m) => m.event_id);

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .in("id", eventIds)
    .neq("host_id", user.id)
    .order("starts_at", { ascending: false });

  if (error || !events) return [];

  const hostIds = [...new Set(events.map((e) => e.host_id))];
  const { data: hostProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, avatar_url")
    .in("id", hostIds);

  const { data: memberCounts } = await supabase
    .from("event_members")
    .select("event_id, status")
    .in("event_id", eventIds)
    .in("status", ["confirmed", "waiting"]);

  return events.map((event) => {
    const host = hostProfiles?.find((p) => p.id === event.host_id);
    const members = memberCounts?.filter((m) => m.event_id === event.id) ?? [];
    return {
      ...event,
      confirmedCount: members.filter((m) => m.status === "confirmed").length,
      waitingCount: members.filter((m) => m.status === "waiting").length,
      host: host ?? {
        id: event.host_id,
        full_name: null,
        email: "",
        avatar_url: null,
      },
    };
  });
}
