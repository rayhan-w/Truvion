DROP POLICY IF EXISTS public_media_auth_insert ON storage.objects;
DROP POLICY IF EXISTS public_media_auth_update ON storage.objects;
DROP POLICY IF EXISTS public_media_auth_delete ON storage.objects;

CREATE POLICY public_media_auth_insert
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-media'
  AND private.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY public_media_auth_update
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'public-media'
  AND private.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'public-media'
  AND private.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY public_media_auth_delete
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'public-media'
  AND private.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP FUNCTION IF EXISTS public.is_admin(uuid);