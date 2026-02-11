
CREATE TABLE public.admin_sessions (
  token TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- No public access - only service role (edge function) can access
CREATE POLICY "No public access" ON public.admin_sessions FOR ALL USING (false);
