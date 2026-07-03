DROP POLICY IF EXISTS "Public can view enabled packages" ON public.pricing_packages;
CREATE POLICY "Public can view enabled packages"
ON public.pricing_packages
FOR SELECT
TO anon, authenticated
USING (enabled = true);

CREATE POLICY "Admins can view all packages"
ON public.pricing_packages
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Public can read enabled services" ON public.services;
CREATE POLICY "Public can read enabled services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (enabled = true);

CREATE POLICY "Admins can view all services"
ON public.services
FOR SELECT
TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated;