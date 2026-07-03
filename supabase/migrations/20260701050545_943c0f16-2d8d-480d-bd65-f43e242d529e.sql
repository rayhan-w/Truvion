CREATE TABLE public.tracking_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  ga4_id TEXT,
  gtm_id TEXT,
  google_search_console TEXT,
  google_site_verification TEXT,
  google_ads_conversion_id TEXT,
  google_ads_label TEXT,
  meta_pixel_id TEXT,
  meta_capi_token TEXT,
  meta_test_event_code TEXT,
  meta_domain_verification TEXT,
  tiktok_pixel_id TEXT,
  linkedin_partner_id TEXT,
  clarity_id TEXT,
  hotjar_id TEXT,
  snapchat_pixel_id TEXT,
  pinterest_tag_id TEXT,
  twitter_pixel_id TEXT,
  custom_head_scripts TEXT,
  custom_body_scripts TEXT,
  custom_css TEXT,
  custom_js TEXT,
  schema_markup TEXT,
  robots_txt TEXT,
  sitemap_xml TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.tracking_settings TO authenticated;
GRANT ALL ON public.tracking_settings TO service_role;

ALTER TABLE public.tracking_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view tracking settings"
  ON public.tracking_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tracking settings"
  ON public.tracking_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tracking settings"
  ON public.tracking_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER tracking_settings_updated_at
  BEFORE UPDATE ON public.tracking_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.tracking_settings (id) VALUES (1) ON CONFLICT DO NOTHING;