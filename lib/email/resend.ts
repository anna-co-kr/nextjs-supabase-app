import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "");
}

export type ReminderType = "d_minus_1" | "d_minus_3";

// ---------------------------------------------------------------------------
// 미납자 리마인더 이메일 — 계좌 이체 유도
// ---------------------------------------------------------------------------

interface UnpaidReminderEventInfo {
  /** 이벤트명 */
  title: string;
  /** 이벤트 시작 일시 (ISO 문자열) */
  startsAt: string;
  /** 공개 링크용 공유 토큰 */
  shareToken: string;
}

interface BankAccountInfo {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

/**
 * 미납자에게 정산 리마인더 이메일 발송
 * @param to          수신자 이메일
 * @param event       이벤트 정보
 * @param amount      미납 금액 (원)
 * @param bankAccount 이체 계좌 정보 (없으면 null)
 * @returns 발송 성공 여부
 */
export async function sendUnpaidReminderEmail(
  to: string,
  event: UnpaidReminderEventInfo,
  amount: number,
  bankAccount: BankAccountInfo | null,
): Promise<boolean> {
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

  const amountFormatted = amount.toLocaleString("ko-KR");

  // 계좌 정보 섹션 — 계좌가 없으면 주최자에게 문의 안내
  const bankSection = bankAccount
    ? `
      <div style="background: #f0f4ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-weight: 600; color: #333;">입금 계좌</p>
        <p style="margin: 4px 0; color: #444;">${bankAccount.bank_name}</p>
        <p style="margin: 4px 0; color: #444; font-size: 16px; font-weight: 600;">${bankAccount.account_number}</p>
        <p style="margin: 4px 0; color: #666; font-size: 13px;">예금주: ${bankAccount.account_holder}</p>
      </div>
    `
    : `
      <p style="color: #888; font-size: 13px; margin-bottom: 24px;">
        계좌 정보는 주최자에게 문의해 주세요.
      </p>
    `;

  const { error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM ?? "Gather <noreply@gather.app>",
    to,
    subject: `[Gather] 정산 미납 안내 — ${event.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="font-size: 20px; margin-bottom: 8px;">정산 안내</h2>
        <p style="color: #666; margin-bottom: 24px;">아직 정산이 완료되지 않았습니다.</p>

        <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h3 style="margin: 0 0 8px; font-size: 18px;">${event.title}</h3>
          <p style="margin: 4px 0; color: #444;">${startDate}</p>
        </div>

        <div style="background: #fff8e6; border: 1px solid #ffe0a0; border-radius: 8px; padding: 16px; margin-bottom: 16px; text-align: center;">
          <p style="margin: 0 0 4px; color: #888; font-size: 13px;">미납 금액</p>
          <p style="margin: 0; font-size: 28px; font-weight: 700; color: #e07000;">${amountFormatted}원</p>
        </div>

        ${bankSection}

        <a href="${eventUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-bottom: 24px;">
          이벤트 확인하기
        </a>

        <p style="margin-top: 24px; font-size: 12px; color: #999;">
          이 메일은 Gather 정산 리마인더 서비스에서 발송되었습니다.
        </p>
      </div>
    `,
  });

  return !error;
}

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
