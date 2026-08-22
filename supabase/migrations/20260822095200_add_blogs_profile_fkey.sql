-- Add foreign key from blogs.user_id to profiles.id for easier joining
ALTER TABLE public.blogs
ADD CONSTRAINT blogs_user_id_profiles_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;
