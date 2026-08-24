-- Add visibility to blogs
ALTER TABLE public.blogs ADD COLUMN visibility TEXT NOT NULL DEFAULT 'Public' CHECK (visibility IN ('Public', 'Private'));

-- Drop existing SELECT policy and recreate it with visibility check
DROP POLICY IF EXISTS "Public can view published blogs" ON public.blogs;

CREATE POLICY "Public can view published blogs"
    ON public.blogs FOR SELECT
    USING (status = 'Published' AND visibility = 'Public');
