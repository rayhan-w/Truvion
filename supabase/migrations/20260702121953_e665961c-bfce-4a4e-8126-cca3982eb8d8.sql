GRANT SELECT ON public.agency_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agency_settings TO authenticated;
GRANT ALL ON public.agency_settings TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;

GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

GRANT SELECT ON public.pricing_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pricing_packages TO authenticated;
GRANT ALL ON public.pricing_packages TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.tracking_settings TO authenticated;
GRANT ALL ON public.tracking_settings TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;