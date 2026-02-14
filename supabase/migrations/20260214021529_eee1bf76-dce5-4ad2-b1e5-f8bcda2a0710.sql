
-- Fix 1: Deny public SELECT on messages table (protects email/PII)
CREATE POLICY "No public read messages"
ON public.messages
FOR SELECT
USING (false);

-- Fix 2: Remove public write policies on storage
DROP POLICY IF EXISTS "Public upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Public update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete portfolio images" ON storage.objects;
