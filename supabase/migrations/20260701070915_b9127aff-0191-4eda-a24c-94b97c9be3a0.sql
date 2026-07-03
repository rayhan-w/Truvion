INSERT INTO public.site_content (section, key, label, input_type, value_text, sort_order) VALUES
  ('branding', 'logo_text', 'Logo Text (main)', 'text', 'Truvion', 1),
  ('branding', 'logo_accent', 'Logo Text (accent, after slash)', 'text', 'Tech', 2),
  ('branding', 'footer_brand_main', 'Footer brand (main)', 'text', 'Truvion', 4),
  ('branding', 'footer_brand_accent', 'Footer brand (accent)', 'text', 'Tech', 5)
ON CONFLICT (section, key) DO NOTHING;

INSERT INTO public.site_content (section, key, label, input_type, value_image_url, sort_order) VALUES
  ('branding', 'logo_url', 'Logo Image (leave empty to use text + icon)', 'image', NULL, 3),
  ('branding', 'favicon_url', 'Favicon (32x32 recommended)', 'image', NULL, 6)
ON CONFLICT (section, key) DO NOTHING;