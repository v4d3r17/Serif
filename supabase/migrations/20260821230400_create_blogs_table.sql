-- Create blogs table
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    body TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published')),
    read_time INTEGER NOT NULL DEFAULT 0,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view published blogs"
    ON blogs FOR SELECT
    USING (status = 'Published');

CREATE POLICY "Users can view their own blogs"
    ON blogs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blogs"
    ON blogs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blogs"
    ON blogs FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blogs"
    ON blogs FOR DELETE
    USING (auth.uid() = user_id);

-- Setup Storage for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public can view blog images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'blog-images');

CREATE POLICY "Users can upload blog images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own blog images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own blog images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
