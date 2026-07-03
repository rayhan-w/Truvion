DROP POLICY IF EXISTS public_media_auth_insert ON storage.objects;
DROP POLICY IF EXISTS public_media_auth_update ON storage.objects;
DROP POLICY IF EXISTS public_media_auth_delete ON storage.objects;

CREATE POLICY public_media_service_insert
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'public-media');

CREATE POLICY public_media_service_update
ON storage.objects
FOR UPDATE
TO service_role
USING (bucket_id = 'public-media')
WITH CHECK (bucket_id = 'public-media');

CREATE POLICY public_media_service_delete
ON storage.objects
FOR DELETE
TO service_role
USING (bucket_id = 'public-media');