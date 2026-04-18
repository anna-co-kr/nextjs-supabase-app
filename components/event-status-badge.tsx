import { Badge } from "@/components/ui/badge";
import type { EventStatus, MemberStatus, PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

// 이벤트 상태별 배지 — dot 없음, 단순 배경색+텍스트
const EVENT_STATUS_MAP: Record<EventStatus, { label: string; className: string }> = {
  draft: {
    label: "임시저장",
    // muted 배경, muted-foreground 텍스트
    className: "bg-muted text-muted-foreground",
  },
  open: {
    label: "모집중",
    // primary/10 배경, primary 텍스트
    className: "bg-primary/10 text-primary",
  },
  closed: {
    label: "마감",
    // muted 배경, muted-foreground 텍스트
    className: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "취소됨",
    // 레드 계열
    className: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  },
};

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  const { label, className: colorClass } = EVENT_STATUS_MAP[status];
  return (
    /* 배지: rounded-md, border 없음, 작은 패딩 */
    <span
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1 text-xs font-medium",
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

// 멤버 상태 배지
const MEMBER_STATUS_MAP: Record<MemberStatus, { label: string; className: string }> = {
  confirmed: {
    label: "확정",
    // 그린 계열
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
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
      className={cn("rounded-md border-0 px-3 py-1 text-xs font-medium", colorClass, className)}
    >
      {label}
    </Badge>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

// 납부 상태 배지
const PAYMENT_STATUS_MAP: Record<PaymentStatus, { label: string; className: string }> = {
  paid: {
    label: "납부완료",
    // 그린 계열
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
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
      className={cn("rounded-md border-0 px-3 py-1 text-xs font-medium", colorClass, className)}
    >
      {label}
    </Badge>
  );
}
