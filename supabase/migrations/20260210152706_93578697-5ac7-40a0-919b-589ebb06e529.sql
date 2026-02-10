
-- Site content (editable text blocks)
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (true);

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);

-- Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  proficiency INT NOT NULL DEFAULT 50,
  sort_order INT NOT NULL DEFAULT 0
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);

-- Contact messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Theme settings
CREATE TABLE public.theme_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  accent_color TEXT NOT NULL DEFAULT '#39FF14',
  accent_intensity REAL NOT NULL DEFAULT 1.0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read theme" ON public.theme_settings FOR SELECT USING (true);

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);
CREATE POLICY "Public read portfolio images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
CREATE POLICY "Public upload portfolio images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');
CREATE POLICY "Public update portfolio images" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images');
CREATE POLICY "Public delete portfolio images" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images');

-- Seed initial content
INSERT INTO public.site_content (id, content) VALUES
  ('hero_title', 'Faizan Shah'),
  ('hero_subtitle', 'Full Stack Developer & Creative Technologist'),
  ('hero_description', 'I build exceptional digital experiences that live at the intersection of design and technology.'),
  ('about_text', 'I am a passionate developer with expertise in modern web technologies. I love creating beautiful, functional, and user-friendly applications that solve real-world problems.'),
  ('contact_heading', 'Get In Touch'),
  ('contact_subtext', 'Have a project in mind? Let''s work together to bring your ideas to life.');

-- Seed skills
INSERT INTO public.skills (name, category, proficiency, sort_order) VALUES
  ('React', 'Frontend', 90, 1),
  ('TypeScript', 'Frontend', 85, 2),
  ('Node.js', 'Backend', 80, 3),
  ('Python', 'Backend', 75, 4),
  ('Tailwind CSS', 'Frontend', 90, 5),
  ('PostgreSQL', 'Database', 70, 6);

-- Seed projects
INSERT INTO public.projects (title, description, tech_stack, sort_order) VALUES
  ('E-Commerce Platform', 'A full-featured online store with real-time inventory management and secure payment processing.', ARRAY['React', 'Node.js', 'PostgreSQL'], 1),
  ('AI Chat Application', 'An intelligent chatbot powered by machine learning for customer support automation.', ARRAY['Python', 'TensorFlow', 'React'], 2),
  ('Portfolio Dashboard', 'A real-time analytics dashboard for tracking investment portfolios.', ARRAY['TypeScript', 'D3.js', 'Firebase'], 3);

-- Seed theme
INSERT INTO public.theme_settings (id, accent_color, accent_intensity) VALUES ('default', '#39FF14', 1.0);
