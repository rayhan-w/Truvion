-- Team members table
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  photo_url text,
  email text,
  phone text,
  facebook_url text,
  linkedin_url text,
  twitter_url text,
  instagram_url text,
  website_url text,
  sort_order int NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view enabled team members"
  ON public.team_members FOR SELECT
  USING (enabled = true);

CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Site content: WordPress-style editable key/value store for every string/image on the site
CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value_text text,
  value_json jsonb,
  value_image_url text,
  label text,
  input_type text NOT NULL DEFAULT 'text', -- text | textarea | image | url | json | number | boolean
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section, key)
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site content"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site content"
  ON public.site_content FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed default landing page content keys so admin sees everything ready to edit
INSERT INTO public.site_content (section, key, label, input_type, value_text, sort_order) VALUES
  ('hero', 'eyebrow',      'Hero Eyebrow',      'text',     'Digital Marketing Agency', 1),
  ('hero', 'headline',     'Hero Headline',     'textarea', 'Grow your business with world-class digital marketing', 2),
  ('hero', 'tagline',      'Hero Tagline',      'textarea', 'Top Creative Agency in Bangladesh for Branding & UI/UX Design', 3),
  ('hero', 'subheadline',  'Hero Subheadline',  'textarea', 'Website development, SEO, Facebook Ads, and full business digitalization — done right.', 4),
  ('hero', 'cta_primary',  'Primary CTA Text',  'text',     'Get Free Consultation', 5),
  ('hero', 'cta_secondary','Secondary CTA Text','text',     'See Our Work', 6),
  ('hero', 'social_proof', 'Social Proof Text', 'text',     '50+ Happy Clients', 7),

  ('about', 'title',       'About Title',       'text',     'Why Choose Truvion Tech', 1),
  ('about', 'description', 'About Description', 'textarea', 'We combine strategy, design, and technology to help Bangladeshi businesses win online.', 2),

  ('services', 'title',    'Services Title',    'text',     'Our Services', 1),
  ('services', 'subtitle', 'Services Subtitle', 'textarea', 'Everything you need to grow online, under one roof.', 2),

  ('portfolio','title',    'Portfolio Title',   'text',     'Our Recent Work', 1),
  ('portfolio','subtitle', 'Portfolio Subtitle','textarea', 'Real projects for real Bangladeshi brands.', 2),

  ('team',    'title',     'Team Title',        'text',     'Meet Our Team', 1),
  ('team',    'subtitle',  'Team Subtitle',     'textarea', 'The people behind Truvion Tech.', 2),

  ('pricing', 'title',     'Pricing Title',     'text',     'Pricing Plans', 1),
  ('pricing', 'subtitle',  'Pricing Subtitle',  'textarea', 'Transparent packages. No surprises.', 2),

  ('testimonials','title', 'Testimonials Title','text',     'What Our Clients Say', 1),

  ('contact', 'title',     'Contact Title',     'text',     'Let''s work together', 1),
  ('contact', 'subtitle',  'Contact Subtitle',  'textarea', 'Tell us about your project and we''ll get back within 24 hours.', 2),

  ('footer',  'tagline',   'Footer Tagline',    'textarea', 'Bangladesh''s trusted digital growth partner.', 1),
  ('footer',  'copyright', 'Copyright Text',    'text',     '© 2026 Truvion Tech. All rights reserved.', 2)
ON CONFLICT (section, key) DO NOTHING;