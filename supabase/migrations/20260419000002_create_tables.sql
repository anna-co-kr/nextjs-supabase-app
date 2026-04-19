-- events 테이블: 이벤트 핵심 정보
CREATE TABLE public.events (
  id                    uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id               uuid        NOT NULL REFERENCES auth.users(id),
  title                 text        NOT NULL,
  description           text,
  event_type            public.event_type_enum   NOT NULL DEFAULT 'one_time',
  status                public.event_status_enum NOT NULL DEFAULT 'draft',
  approval_type         public.approval_type_enum NOT NULL DEFAULT 'manual',
  max_participants      integer     NOT NULL,
  starts_at             timestamptz NOT NULL,
  ends_at               timestamptz,
  location              text,
  registration_deadline timestamptz,
  share_token           uuid        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- event_members 테이블: 이벤트 참여자 신청 및 상태
CREATE TABLE public.event_members (
  id           uuid                      NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id     uuid                      NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id      uuid                      NOT NULL REFERENCES auth.users(id),
  status       public.member_status_enum NOT NULL DEFAULT 'waiting',
  note         text,
  applied_at   timestamptz               NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  rejected_at  timestamptz,
  UNIQUE(event_id, user_id)
);

-- announcements 테이블: 이벤트별 공지사항
CREATE TABLE public.announcements (
  id         uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id   uuid        NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  author_id  uuid        NOT NULL REFERENCES auth.users(id),
  title      text        NOT NULL,
  body       text        NOT NULL,
  is_pinned  boolean     NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- announcement_comments 테이블: 공지 댓글
CREATE TABLE public.announcement_comments (
  id              uuid        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id uuid        NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  author_id       uuid        NOT NULL REFERENCES auth.users(id),
  body            text        NOT NULL,
  created_at      timestamptz DEFAULT now()
);

-- announcement_reactions 테이블: 공지 이모지 리액션
CREATE TABLE public.announcement_reactions (
  id              uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id),
  emoji           text NOT NULL,
  UNIQUE(announcement_id, user_id, emoji)
);

-- settlement_items 테이블: 정산 항목
CREATE TABLE public.settlement_items (
  id           uuid                    NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id     uuid                    NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name         text                    NOT NULL,
  total_amount integer                 NOT NULL,
  split_type   public.split_type_enum  NOT NULL DEFAULT 'equal',
  created_at   timestamptz             DEFAULT now()
);

-- settlement_payments 테이블: 납부 현황
CREATE TABLE public.settlement_payments (
  id                  uuid           NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  settlement_item_id  uuid           NOT NULL REFERENCES public.settlement_items(id) ON DELETE CASCADE,
  event_member_id     uuid           NOT NULL REFERENCES public.event_members(id) ON DELETE CASCADE,
  amount              integer        NOT NULL DEFAULT 0,
  ratio               numeric(5, 2),
  is_paid             boolean        NOT NULL DEFAULT false,
  paid_at             timestamptz
);

-- host_bank_accounts 테이블: 주최자 정산 계좌
CREATE TABLE public.host_bank_accounts (
  id             uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id       uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  host_id        uuid NOT NULL REFERENCES auth.users(id),
  bank_name      text NOT NULL,
  account_number text NOT NULL,
  account_holder text NOT NULL
);

-- updated_at 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- events 테이블에 updated_at 트리거 적용
CREATE TRIGGER handle_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- announcements 테이블에 updated_at 트리거 적용
CREATE TRIGGER handle_announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 인덱스: 주요 조회 패턴 최적화
CREATE INDEX idx_events_host_id ON public.events(host_id);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_event_members_event_id ON public.event_members(event_id);
CREATE INDEX idx_event_members_user_id ON public.event_members(user_id);
CREATE INDEX idx_event_members_event_status ON public.event_members(event_id, status);
CREATE INDEX idx_announcements_event_id ON public.announcements(event_id);
CREATE INDEX idx_announcements_pinned ON public.announcements(event_id, is_pinned);
CREATE INDEX idx_settlement_items_event_id ON public.settlement_items(event_id);
