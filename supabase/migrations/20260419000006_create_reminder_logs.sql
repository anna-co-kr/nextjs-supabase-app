CREATE TABLE IF NOT EXISTS public.reminder_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reminder_type text NOT NULL CHECK (reminder_type IN ('d_minus_1', 'd_minus_3')),
  sent_at timestamptz NOT NULL DEFAULT now(),
  sent_date date NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE (event_id, user_id, reminder_type, sent_date)
);

ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON public.reminder_logs
  USING (false)
  WITH CHECK (false);
