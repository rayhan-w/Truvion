
-- 1. has_role: SECURITY DEFINER with locked search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- 2. team_members: remove public SELECT policy on base table; expose only safe view
DROP POLICY IF EXISTS "Public can view enabled team members" ON public.team_members;
GRANT SELECT ON public.team_members_public TO anon, authenticated;

-- 3. tracking_settings: explicit restrictive policy denying anon SELECT
CREATE POLICY "Block anon from tracking settings"
  ON public.tracking_settings
  AS RESTRICTIVE
  FOR SELECT
  TO anon
  USING (false);
