REVOKE SELECT (email, phone) ON public.team_members FROM anon, authenticated;
GRANT SELECT (id, name, role, bio, photo_url, facebook_url, linkedin_url, twitter_url, instagram_url, sort_order, enabled, created_at, updated_at)
  ON public.team_members TO anon, authenticated;