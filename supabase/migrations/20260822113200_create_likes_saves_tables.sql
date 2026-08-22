-- Create blog_likes table
CREATE TABLE blog_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(blog_id, user_id)
);

-- Enable RLS for blog_likes
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blog likes"
    ON blog_likes FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own likes"
    ON blog_likes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
    ON blog_likes FOR DELETE
    USING (auth.uid() = user_id);


-- Create blog_saves table
CREATE TABLE blog_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(blog_id, user_id)
);

-- Enable RLS for blog_saves
ALTER TABLE blog_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own saves"
    ON blog_saves FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saves"
    ON blog_saves FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves"
    ON blog_saves FOR DELETE
    USING (auth.uid() = user_id);
