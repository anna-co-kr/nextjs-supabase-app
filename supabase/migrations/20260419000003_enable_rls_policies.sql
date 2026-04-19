-- 모든 테이블 RLS 활성화
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_bank_accounts ENABLE ROW LEVEL SECURITY;

-- events RLS: draft 제외 공개 조회, 주최자만 쓰기
CREATE POLICY "events_public_select" ON public.events
  FOR SELECT USING (status != 'draft');
CREATE POLICY "events_host_insert" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "events_host_update" ON public.events
  FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "events_host_delete" ON public.events
  FOR DELETE USING (auth.uid() = host_id);

-- event_members RLS: 본인 또는 주최자만 조회, 본인만 신청, 주최자만 상태 변경
CREATE POLICY "members_select" ON public.event_members
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT host_id FROM public.events WHERE id = event_id)
  );
CREATE POLICY "members_insert" ON public.event_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members_host_update" ON public.event_members
  FOR UPDATE USING (
    auth.uid() IN (SELECT host_id FROM public.events WHERE id = event_id)
  );
CREATE POLICY "members_delete" ON public.event_members
  FOR DELETE USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT host_id FROM public.events WHERE id = event_id)
  );

-- announcements RLS: 확정 참여자 또는 주최자만 조회, 주최자만 쓰기
CREATE POLICY "announcements_select" ON public.announcements
  FOR SELECT USING (
    auth.uid() IN (SELECT host_id FROM public.events WHERE id = event_id) OR
    EXISTS (
      SELECT 1 FROM public.event_members
      WHERE event_id = announcements.event_id
        AND user_id = auth.uid()
        AND status = 'confirmed'
    )
  );
CREATE POLICY "announcements_host_all" ON public.announcements
  FOR ALL USING (
    auth.uid() IN (SELECT host_id FROM public.events WHERE id = event_id)
  );

-- announcement_comments RLS: 확정 참여자 또는 주최자만 조회, 본인만 수정/삭제
CREATE POLICY "comments_select" ON public.announcement_comments
  FOR SELECT USING (
    auth.uid() IN (
      SELECT e.host_id FROM public.events e
      JOIN public.announcements a ON a.event_id = e.id
      WHERE a.id = announcement_id
    ) OR
    EXISTS (
      SELECT 1 FROM public.event_members em
      JOIN public.announcements a ON a.event_id = em.event_id
      WHERE a.id = announcement_id AND em.user_id = auth.uid() AND em.status = 'confirmed'
    )
  );
CREATE POLICY "comments_insert" ON public.announcement_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_author_update" ON public.announcement_comments
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "comments_author_delete" ON public.announcement_comments
  FOR DELETE USING (auth.uid() = author_id);

-- announcement_reactions RLS: 확정 참여자 또는 주최자만 조회, 본인만 추가/삭제
CREATE POLICY "reactions_select" ON public.announcement_reactions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT e.host_id FROM public.events e
      JOIN public.announcements a ON a.event_id = e.id
      WHERE a.id = announcement_id
    ) OR
    EXISTS (
      SELECT 1 FROM public.event_members em
      JOIN public.announcements a ON a.event_id = em.event_id
      WHERE a.id = announcement_id AND em.user_id = auth.uid() AND em.status = 'confirmed'
    )
  );
CREATE POLICY "reactions_insert" ON public.announcement_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reactions_delete" ON public.announcement_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- settlement_items RLS: 확정 참여자 또는 주최자만 조회, 주최자만 쓰기
CREATE POLICY "settlement_items_select" ON public.settlement_items
  FOR SELECT USING (
    auth.uid() IN (SELECT host_id FROM public.events WHERE id = event_id) OR
    EXISTS (
      SELECT 1 FROM public.event_members
      WHERE event_id = settlement_items.event_id
        AND user_id = auth.uid()
        AND status = 'confirmed'
    )
  );
CREATE POLICY "settlement_items_host_all" ON public.settlement_items
  FOR ALL USING (
    auth.uid() IN (SELECT host_id FROM public.events WHERE id = event_id)
  );

-- settlement_payments RLS: 본인 참여자 또는 주최자 조회, 주최자만 납부 처리
CREATE POLICY "payments_select" ON public.settlement_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.event_members em
      JOIN public.events e ON e.id = em.event_id
      WHERE em.id = event_member_id
        AND (em.user_id = auth.uid() OR e.host_id = auth.uid())
    )
  );
CREATE POLICY "payments_host_update" ON public.settlement_payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.event_members em
      JOIN public.events e ON e.id = em.event_id
      WHERE em.id = event_member_id AND e.host_id = auth.uid()
    )
  );
CREATE POLICY "payments_host_insert" ON public.settlement_payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.event_members em
      JOIN public.events e ON e.id = em.event_id
      WHERE em.id = event_member_id AND e.host_id = auth.uid()
    )
  );

-- host_bank_accounts RLS: 확정 참여자 또는 주최자 조회, 주최자만 쓰기
CREATE POLICY "bank_accounts_select" ON public.host_bank_accounts
  FOR SELECT USING (
    auth.uid() = host_id OR
    EXISTS (
      SELECT 1 FROM public.event_members
      WHERE event_id = host_bank_accounts.event_id
        AND user_id = auth.uid()
        AND status = 'confirmed'
    )
  );
CREATE POLICY "bank_accounts_host_all" ON public.host_bank_accounts
  FOR ALL USING (auth.uid() = host_id);
