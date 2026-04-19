import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

export type ReminderType = "d_minus_1" | "d_minus_3";

interface EventInfo {
  title: string;
  startsAt: string;
  location: string | null;
  shareToken: string;
}

export async function sendReminderEmail(
  to: string,
  type: ReminderType,
  event: EventInfo,
): Promise<boolean> {
  const dayLabel = type === "d_minus_1" ? "내일" : "3일 후";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const eventUrl = `${siteUrl}/events/${event.shareToken}`;

  const startDate = new Date(event.startsAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "Gather <noreply@gather.app>",
    to,
    subject: `[Gather] ${dayLabel} 모임이 있어요 — ${event.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="font-size: 20px; margin-bottom: 8px;">📅 모임 리마인더</h2>
        <p style="color: #666; margin-bottom: 24px;">${dayLabel} 참여하실 모임이 있습니다!</p>
        <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px; font-size: 18px;">${event.title}</h3>
          <p style="margin: 4px 0; color: #444;">📅 ${startDate}</p>
          ${event.location ? `<p style="margin: 4px 0; color: #444;">📍 ${event.location}</p>` : ""}
        </div>
        <a href="${eventUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
          모임 확인하기
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">
          이 메일은 Gather 모임 리마인더 서비스에서 발송되었습니다.
        </p>
      </div>
    `,
  });

  return !error;
}
