import type { Event, UserProfile } from "@/lib/types/index";
import type { EventRowWithCounts } from "@/lib/supabase/events";

export function mapEventRowToView(row: EventRowWithCounts): Event {
  const host: UserProfile = {
    id: row.host.id,
    name: row.host.full_name ?? row.host.email,
    email: row.host.email,
    avatarUrl: row.host.avatar_url ?? undefined,
  };

  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    type: row.event_type,
    status: row.status,
    approvalType: row.approval_type,
    host,
    maxCapacity: row.max_participants,
    confirmedCount: row.confirmedCount,
    waitingCount: row.waitingCount,
    startDate: row.starts_at,
    endDate: row.ends_at ?? undefined,
    location: row.location ?? undefined,
    registrationDeadline: row.registration_deadline ?? undefined,
    shareToken: row.share_token,
    createdAt: row.created_at ?? row.starts_at,
    updatedAt: row.updated_at ?? row.starts_at,
  };
}
