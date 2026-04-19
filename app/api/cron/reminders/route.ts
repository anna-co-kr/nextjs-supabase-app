import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendReminderEmail, type ReminderType } from "@/lib/email/resend";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();

  const targets: { type: ReminderType; daysAhead: number }[] = [
    { type: "d_minus_1", daysAhead: 1 },
    { type: "d_minus_3", daysAhead: 3 },
  ];

  let totalSent = 0;
  let totalSkipped = 0;

  for (const { type, daysAhead } of targets) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysAhead);
    const dateStr = targetDate.toISOString().slice(0, 10);

    const { data: events } = await supabase
      .from("events")
      .select("id, title, starts_at, location, share_token")
      .gte("starts_at", `${dateStr}T00:00:00.000Z`)
      .lt("starts_at", `${dateStr}T23:59:59.999Z`)
      .eq("status", "open");

    if (!events?.length) continue;

    for (const event of events) {
      const { data: members } = await supabase
        .from("event_members")
        .select("user_id")
        .eq("event_id", event.id)
        .eq("status", "confirmed");

      if (!members?.length) continue;

      const userIds = members.map((m) => m.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      for (const profile of profiles ?? []) {
        const { error: logError } = await supabase.from("reminder_logs").insert({
          event_id: event.id,
          user_id: profile.id,
          reminder_type: type,
          sent_date: dateStr,
        });

        if (logError) {
          totalSkipped++;
          continue;
        }

        after(async () => {
          await sendReminderEmail(profile.email, type, {
            title: event.title,
            startsAt: event.starts_at,
            location: event.location,
            shareToken: event.share_token,
          });
        });

        totalSent++;
      }
    }
  }

  return Response.json({ ok: true, sent: totalSent, skipped: totalSkipped });
}
