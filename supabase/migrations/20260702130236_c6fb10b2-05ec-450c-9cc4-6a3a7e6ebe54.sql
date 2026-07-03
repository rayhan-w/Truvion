CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'::public.app_role
  )
$$;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO service_role;

DROP POLICY IF EXISTS public_media_auth_insert ON storage.objects;
DROP POLICY IF EXISTS public_media_auth_update ON storage.objects;
DROP POLICY IF EXISTS public_media_auth_delete ON storage.objects;

CREATE POLICY public_media_auth_insert
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-media'
  AND public.is_admin(auth.uid())
);

CREATE POLICY public_media_auth_update
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'public-media'
  AND public.is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'public-media'
  AND public.is_admin(auth.uid())
);

CREATE POLICY public_media_auth_delete
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'public-media'
  AND public.is_admin(auth.uid())
);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;