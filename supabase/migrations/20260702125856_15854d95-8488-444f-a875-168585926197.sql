DROP POLICY IF EXISTS public_media_admin_insert ON storage.objects;
DROP POLICY IF EXISTS public_media_admin_update ON storage.objects;
DROP POLICY IF EXISTS public_media_admin_delete ON storage.objects;
DROP POLICY IF EXISTS public_media_read ON storage.objects;

CREATE POLICY public_media_read ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'public-media');

CREATE POLICY public_media_auth_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'public-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY public_media_auth_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'public-media' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'public-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY public_media_auth_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'public-media' AND public.has_role(auth.uid(), 'admin'::public.app_role));