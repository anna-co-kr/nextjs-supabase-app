import type {
  UserProfile,
  Event,
  EventMember,
  Announcement,
  SettlementItem,
  EventSettlement,
} from "@/lib/types";

// ─── 유저 ────────────────────────────────────────────────────────────────────

export const DUMMY_USERS: UserProfile[] = [
  { id: "u1", name: "김지수", email: "jisu@example.com" },
  { id: "u2", name: "이민준", email: "minjun@example.com" },
  { id: "u3", name: "박서연", email: "seoyeon@example.com" },
  { id: "u4", name: "최현우", email: "hyunwoo@example.com" },
  { id: "u5", name: "정유진", email: "yujin@example.com" },
  { id: "u6", name: "한수빈", email: "subin@example.com" },
  { id: "u7", name: "오태양", email: "taeyang@example.com" },
  { id: "u8", name: "임다은", email: "daeun@example.com" },
];

const [jisu, minjun, seoyeon, hyunwoo, yujin, subin, taeyang, daeun] = DUMMY_USERS;

// ─── 이벤트 ──────────────────────────────────────────────────────────────────

export const DUMMY_EVENTS: Event[] = [
  {
    id: "e1",
    title: "제주도 봄 여행",
    description:
      "4월 말 제주도로 떠나는 1박 2일 봄 여행입니다. 한라산 등반과 맛집 투어를 함께해요!",
    type: "one_time",
    status: "open",
    host: jisu,
    maxCapacity: 12,
    confirmedCount: 8,
    waitingCount: 2,
    startDate: "2025-04-26T09:00:00+09:00",
    endDate: "2025-04-27T18:00:00+09:00",
    location: "제주도",
    shareToken: "jeju-spring-2025",
    createdAt: "2025-04-01T10:00:00+09:00",
    updatedAt: "2025-04-15T12:00:00+09:00",
  },
  {
    id: "e2",
    title: "수요일 수영 모임 4월",
    description: "매주 수요일 저녁 수영 정기 모임입니다. 강남구청 수영장에서 진행합니다.",
    type: "recurring",
    status: "open",
    host: minjun,
    maxCapacity: 20,
    confirmedCount: 15,
    waitingCount: 3,
    startDate: "2025-04-02T19:00:00+09:00",
    endDate: "2025-04-30T21:00:00+09:00",
    location: "강남구청 수영장",
    shareToken: "swim-club-apr",
    createdAt: "2025-03-25T09:00:00+09:00",
    updatedAt: "2025-04-10T08:00:00+09:00",
  },
  {
    id: "e3",
    title: "봄맞이 친구 파티",
    description: "홍대 루프탑에서 진행하는 봄맞이 파티입니다. 소소한 먹거리와 함께해요.",
    type: "one_time",
    status: "closed",
    host: seoyeon,
    maxCapacity: 10,
    confirmedCount: 10,
    waitingCount: 0,
    startDate: "2025-04-12T18:00:00+09:00",
    location: "홍대 루프탑 카페",
    shareToken: "spring-party-apr",
    createdAt: "2025-03-28T14:00:00+09:00",
    updatedAt: "2025-04-12T20:00:00+09:00",
  },
];

// ─── 이벤트 멤버 ─────────────────────────────────────────────────────────────

export const DUMMY_MEMBERS: Record<string, EventMember[]> = {
  e1: [
    {
      id: "m1",
      eventId: "e1",
      user: jisu,
      status: "confirmed",
      appliedAt: "2025-04-01T10:00:00+09:00",
      confirmedAt: "2025-04-01T10:00:00+09:00",
    },
    {
      id: "m2",
      eventId: "e1",
      user: minjun,
      status: "confirmed",
      note: "한라산 등반 꼭 가고 싶어요!",
      appliedAt: "2025-04-02T11:00:00+09:00",
      confirmedAt: "2025-04-02T12:00:00+09:00",
    },
    {
      id: "m3",
      eventId: "e1",
      user: seoyeon,
      status: "confirmed",
      appliedAt: "2025-04-03T09:00:00+09:00",
      confirmedAt: "2025-04-03T10:00:00+09:00",
    },
    {
      id: "m4",
      eventId: "e1",
      user: hyunwoo,
      status: "confirmed",
      appliedAt: "2025-04-04T14:00:00+09:00",
      confirmedAt: "2025-04-04T15:00:00+09:00",
    },
    {
      id: "m5",
      eventId: "e1",
      user: yujin,
      status: "confirmed",
      appliedAt: "2025-04-05T10:00:00+09:00",
      confirmedAt: "2025-04-05T11:00:00+09:00",
    },
    {
      id: "m6",
      eventId: "e1",
      user: subin,
      status: "confirmed",
      appliedAt: "2025-04-06T16:00:00+09:00",
      confirmedAt: "2025-04-06T17:00:00+09:00",
    },
    {
      id: "m7",
      eventId: "e1",
      user: taeyang,
      status: "confirmed",
      appliedAt: "2025-04-07T09:00:00+09:00",
      confirmedAt: "2025-04-07T10:00:00+09:00",
    },
    {
      id: "m8",
      eventId: "e1",
      user: daeun,
      status: "confirmed",
      appliedAt: "2025-04-08T11:00:00+09:00",
      confirmedAt: "2025-04-08T12:00:00+09:00",
    },
    {
      id: "m9",
      eventId: "e1",
      user: { id: "u9", name: "강민서", email: "minseo@example.com" },
      status: "waiting",
      appliedAt: "2025-04-10T13:00:00+09:00",
    },
    {
      id: "m10",
      eventId: "e1",
      user: { id: "u10", name: "윤지호", email: "jiho@example.com" },
      status: "waiting",
      appliedAt: "2025-04-11T15:00:00+09:00",
    },
  ],
};

// ─── 공지 ────────────────────────────────────────────────────────────────────

export const DUMMY_ANNOUNCEMENTS: Record<string, Announcement[]> = {
  e1: [
    {
      id: "a1",
      eventId: "e1",
      author: jisu,
      title: "집합 장소 및 시간 안내",
      content:
        "안녕하세요! 4월 26일 오전 9시까지 제주국제공항 1번 출구로 모여주세요. 버스로 이동할 예정입니다. 꼭 시간 맞춰 와주세요 😊",
      isPinned: true,
      reactions: [
        { emoji: "👍", count: 6, reactedByMe: true },
        { emoji: "❤️", count: 3, reactedByMe: false },
      ],
      comments: [
        {
          id: "c1",
          author: minjun,
          content: "네! 알겠습니다~ 기대돼요",
          createdAt: "2025-04-15T10:30:00+09:00",
        },
        {
          id: "c2",
          author: seoyeon,
          content: "저도 준비됐어요!",
          createdAt: "2025-04-15T11:00:00+09:00",
        },
      ],
      createdAt: "2025-04-15T10:00:00+09:00",
      updatedAt: "2025-04-15T10:00:00+09:00",
    },
    {
      id: "a2",
      eventId: "e1",
      author: jisu,
      title: "숙소 정보 공유",
      content:
        "이번 여행 숙소는 서귀포 게스트하우스로 확정됐습니다. 2인 1실 기준입니다. 룸메이트는 현장에서 정할게요!",
      isPinned: false,
      reactions: [{ emoji: "🏨", count: 4, reactedByMe: false }],
      comments: [],
      createdAt: "2025-04-16T14:00:00+09:00",
      updatedAt: "2025-04-16T14:00:00+09:00",
    },
    {
      id: "a3",
      eventId: "e1",
      author: jisu,
      title: "준비물 체크리스트",
      content:
        "- 여행 증명서류 (신분증 필수)\n- 등산화 또는 운동화\n- 간단한 간식\n- 멀미약 (배 타실 분)\n- 여벌 옷",
      isPinned: false,
      reactions: [
        { emoji: "📝", count: 5, reactedByMe: true },
        { emoji: "👍", count: 2, reactedByMe: false },
      ],
      comments: [
        {
          id: "c3",
          author: hyunwoo,
          content: "배는 언제 타나요?",
          createdAt: "2025-04-17T09:00:00+09:00",
        },
        {
          id: "c4",
          author: jisu,
          content: "27일 오전에 우도 가는 배 탈 예정이에요!",
          createdAt: "2025-04-17T09:30:00+09:00",
        },
      ],
      createdAt: "2025-04-17T08:00:00+09:00",
      updatedAt: "2025-04-17T09:30:00+09:00",
    },
  ],
};

// ─── 정산 ────────────────────────────────────────────────────────────────────

const e1Members = DUMMY_MEMBERS["e1"].filter((m) => m.status === "confirmed");

const settlementItem1: SettlementItem = {
  id: "s1",
  eventId: "e1",
  name: "숙박비",
  totalAmount: 480000,
  splitType: "equal",
  payments: e1Members.map((m, i) => ({
    id: `sp1-${i}`,
    member: m,
    amount: 60000,
    status: i < 5 ? "paid" : "pending",
    paidAt: i < 5 ? "2025-04-18T10:00:00+09:00" : undefined,
  })),
  createdAt: "2025-04-18T09:00:00+09:00",
};

const settlementItem2: SettlementItem = {
  id: "s2",
  eventId: "e1",
  name: "렌터카",
  totalAmount: 200000,
  splitType: "equal",
  payments: e1Members.map((m, i) => ({
    id: `sp2-${i}`,
    member: m,
    amount: 25000,
    status: i < 3 ? "paid" : "pending",
    paidAt: i < 3 ? "2025-04-18T11:00:00+09:00" : undefined,
  })),
  createdAt: "2025-04-18T09:30:00+09:00",
};

export const DUMMY_SETTLEMENTS: Record<string, EventSettlement> = {
  e1: {
    eventId: "e1",
    items: [settlementItem1, settlementItem2],
    bankAccount: {
      id: "b1",
      eventId: "e1",
      bankName: "카카오뱅크",
      accountNumber: "3333-01-1234567",
      accountHolder: "김지수",
    },
    totalAmount: 680000,
    paidCount: 5,
    unpaidCount: 3,
  },
};

// ─── 현재 로그인 유저 (더미) ─────────────────────────────────────────────────

export const CURRENT_USER: UserProfile = jisu;
