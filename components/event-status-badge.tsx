import { Badge } from "@/components/ui/badge";
import type { EventStatus, MemberStatus, PaymentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

const EVENT_STATUS_MAP: Record<
  EventStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "임시저장", variant: "outline" },
  open: { label: "모집중", variant: "default" },
  closed: { label: "마감", variant: "secondary" },
  cancelled: { label: "취소됨", variant: "destructive" },
};

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  const { label, variant } = EVENT_STATUS_MAP[status];
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
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
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  waiting: {
    label: "대기",
    className:
      "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  },
  rejected: {
    label: "거절",
    className:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
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
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  },
  pending: {
    label: "미납",
    className:
      "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
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
