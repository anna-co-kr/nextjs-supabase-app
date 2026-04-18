// ─── 공통 ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// ─── 이벤트 ──────────────────────────────────────────────────────────────────

export type EventStatus = "draft" | "open" | "closed" | "cancelled";
export type EventType = "one_time" | "recurring";
/** 참여 신청 승인 방식: auto(즉시 확정) | manual(주최자 수동 확정) */
export type ApprovalType = "auto" | "manual";

export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  /** 참여 신청 승인 방식 — PRD F003: 주최자 수동 확정 지원 */
  approvalType: ApprovalType;
  host: UserProfile;
  maxCapacity: number;
  confirmedCount: number;
  waitingCount: number;
  startDate: string;
  endDate?: string;
  location?: string;
  /** 참여 신청 마감일 — PRD registration_deadline 컬럼에 대응 */
  registrationDeadline?: string;
  /** 공개 공유 링크 슬러그 — PRD public_slug 컬럼에 대응, View 모델에서 shareToken으로 통일 */
  shareToken: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 이벤트 멤버 ─────────────────────────────────────────────────────────────

export type MemberStatus = "confirmed" | "waiting" | "rejected";

export interface EventMember {
  id: string;
  eventId: string;
  user: UserProfile;
  status: MemberStatus;
  note?: string;
  appliedAt: string;
  confirmedAt?: string;
  /** 거절 처리된 일시 — 주최자가 거절 처리한 시점 추적 */
  rejectedAt?: string;
}

// ─── 공지 ────────────────────────────────────────────────────────────────────

export interface AnnouncementReaction {
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface AnnouncementComment {
  id: string;
  author: UserProfile;
  content: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  eventId: string;
  author: UserProfile;
  title: string;
  content: string;
  isPinned: boolean;
  reactions: AnnouncementReaction[];
  comments: AnnouncementComment[];
  createdAt: string;
  updatedAt: string;
}

// ─── 정산 ────────────────────────────────────────────────────────────────────

export type SplitType = "equal" | "individual" | "ratio";
export type PaymentStatus = "pending" | "paid";

export interface SettlementPayment {
  id: string;
  member: EventMember;
  amount: number;
  ratio?: number;
  status: PaymentStatus;
  paidAt?: string;
}

export interface SettlementItem {
  id: string;
  eventId: string;
  name: string;
  totalAmount: number;
  splitType: SplitType;
  payments: SettlementPayment[];
  createdAt: string;
}

export interface HostBankAccount {
  id: string;
  eventId: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface EventSettlement {
  eventId: string;
  items: SettlementItem[];
  bankAccount?: HostBankAccount;
  totalAmount: number;
  paidCount: number;
  unpaidCount: number;
}
