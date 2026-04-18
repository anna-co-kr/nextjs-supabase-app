import { Badge } from "@/components/ui/badge";
import type { EventStatus, MemberStatus, PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

// 이벤트 상태별 Apple 스타일 pill — dot 없음, 단순 배경색+텍스트
const EVENT_STATUS_MAP: Record<EventStatus, { label: string; className: string }> = {
  draft: {
    label: "임시저장",
    // Apple 회색: #f5f5f7 배경, #6e6e73 텍스트
    className: "bg-[#f5f5f7] text-[#6e6e73] dark:bg-[#2c2c2e] dark:text-[#ebebf0]",
  },
  open: {
    label: "모집중",
    // Apple blue 계열: #e3f0ff 배경, #0071e3 텍스트
    className: "bg-[#e3f0ff] text-[#0071e3] dark:bg-[#0071e3]/20 dark:text-[#4dabf7]",
  },
  closed: {
    label: "마감",
    // Apple 회색 계열
    className: "bg-[#f5f5f7] text-[#6e6e73] dark:bg-[#2c2c2e] dark:text-[#ebebf0]",
  },
  cancelled: {
    label: "취소됨",
    // Apple 레드 계열: 연한 빨강 배경
    className: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  },
};

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  const { label, className: colorClass } = EVENT_STATUS_MAP[status];
  return (
    /* Apple 스타일 pill: rounded-full, border 없음, 작은 패딩 */
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        colorClass,
        className,
      )}
    >
      {label}
    </span>
  );
}

interface MemberStatusBadgeProps {
  status: MemberStatus;
  className?: string;
}

// 멤버 상태 배지 — Apple 스타일 pill
const MEMBER_STATUS_MAP: Record<MemberStatus, { label: string; className: string }> = {
  confirmed: {
    label: "확정",
    // Apple 그린 계열: #e8f5e9 배경
    className: "bg-[#e8f5e9] text-[#1a7f37] dark:bg-[#1a7f37]/20 dark:text-[#4ade80]",
  },
  waiting: {
    label: "대기",
    // Apple 옐로우 계열
    className: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  },
  rejected: {
    label: "거절",
    // Apple 레드 계열
    className: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  },
};

export function MemberStatusBadge({ status, className }: MemberStatusBadgeProps) {
  const { label, className: colorClass } = MEMBER_STATUS_MAP[status];
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full border-0 px-3 py-1 text-xs font-medium", colorClass, className)}
    >
      {label}
    </Badge>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

// 납부 상태 배지 — Apple 스타일 pill
const PAYMENT_STATUS_MAP: Record<PaymentStatus, { label: string; className: string }> = {
  paid: {
    label: "납부완료",
    // Apple 그린 계열
    className: "bg-[#e8f5e9] text-[#1a7f37] dark:bg-[#1a7f37]/20 dark:text-[#4ade80]",
  },
  pending: {
    label: "미납",
    // Apple 오렌지 계열
    className: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  },
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const { label, className: colorClass } = PAYMENT_STATUS_MAP[status];
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full border-0 px-3 py-1 text-xs font-medium", colorClass, className)}
    >
      {label}
    </Badge>
  );
}
