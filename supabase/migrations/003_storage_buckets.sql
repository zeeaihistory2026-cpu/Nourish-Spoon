-- ==============================================================================
-- NOURISH SPOON: SUPABASE STORAGE BUCKETS MIGRATION 003
-- Description: Provision Storage Buckets and Access Policies
-- ==============================================================================

-- Create Storage Buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('product-images', 'product-images', true),
    ('review-screenshots', 'review-screenshots', true),
    ('banners', 'banners', true),
    ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access on all public buckets
DROP POLICY IF EXISTS "Public Read on product-images" ON storage.objects;
CREATE POLICY "Public Read on product-images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Read on review-screenshots" ON storage.objects;
CREATE POLICY "Public Read on review-screenshots" ON storage.objects
    FOR SELECT USING (bucket_id = 'review-screenshots');

DROP POLICY IF EXISTS "Public Read on banners" ON storage.objects;
CREATE POLICY "Public Read on banners" ON storage.objects
    FOR SELECT USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Public Read on avatars" ON storage.objects;
CREATE POLICY "Public Read on avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Admin write policies
DROP POLICY IF EXISTS "Admins can upload files" ON storage.objects;
CREATE POLICY "Admins can upload files" ON storage.objects
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Admins can update files" ON storage.objects;
CREATE POLICY "Admins can update files" ON storage.objects
    FOR UPDATE USING (
        auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;
CREATE POLICY "Admins can delete files" ON storage.objects
    FOR DELETE USING (
        auth.role() = 'authenticated'
    );
