import { Badge } from "@/components/ui/badge";
import type { EventStatus, MemberStatus, PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

// 이벤트 상태별 세련된 pill 스타일 — 선명한 컬러와 점 인디케이터 포함
const EVENT_STATUS_MAP: Record<
  EventStatus,
  { label: string; className: string; dotColor: string }
> = {
  draft: {
    label: "임시저장",
    className: "border-border/60 bg-muted/60 text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
  open: {
    label: "모집중",
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-700/50 dark:bg-violet-900/30 dark:text-violet-300",
    dotColor: "bg-violet-500 dark:bg-violet-400",
  },
  closed: {
    label: "마감",
    className:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700/50 dark:bg-slate-800/40 dark:text-slate-400",
    dotColor: "bg-slate-400",
  },
  cancelled: {
    label: "취소됨",
    className:
      "border-red-200 bg-red-50 text-red-600 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400",
    dotColor: "bg-red-500 dark:bg-red-400",
  },
};

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  const { label, className: colorClass, dotColor } = EVENT_STATUS_MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colorClass,
        className,
      )}
    >
      {/* 상태 인디케이터 점 */}
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} aria-hidden="true" />
      {label}
    </span>
  );
}

interface MemberStatusBadgeProps {
  status: MemberStatus;
  className?: string;
}

const MEMBER_STATUS_MAP: Record<MemberStatus, { label: string; className: string }> = {
  confirmed: {
    label: "확정",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
  },
  waiting: {
    label: "대기",
    className:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50",
  },
  rejected: {
    label: "거절",
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50",
  },
};

export function MemberStatusBadge({ status, className }: MemberStatusBadgeProps) {
  const { label, className: colorClass } = MEMBER_STATUS_MAP[status];
  return (
    <Badge variant="outline" className={cn(colorClass, className)}>
      {label}
    </Badge>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const PAYMENT_STATUS_MAP: Record<PaymentStatus, { label: string; className: string }> = {
  paid: {
    label: "납부완료",
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
  },
  pending: {
    label: "미납",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50",
  },
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const { label, className: colorClass } = PAYMENT_STATUS_MAP[status];
  return (
    <Badge variant="outline" className={cn(colorClass, className)}>
      {label}
    </Badge>
  );
}
