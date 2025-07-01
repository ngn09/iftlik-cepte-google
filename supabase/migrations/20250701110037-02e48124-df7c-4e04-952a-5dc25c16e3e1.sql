
-- Farms tablosuna logo_url kolonu ekle
ALTER TABLE public.farms ADD COLUMN logo_url TEXT;

-- Farm varlıkları için storage bucket oluştur
INSERT INTO storage.buckets (id, name, public) VALUES ('farm-assets', 'farm-assets', true);

-- Storage bucket için RLS politikası
CREATE POLICY "Authenticated users can upload farm assets" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'farm-assets');

CREATE POLICY "Public can view farm assets" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'farm-assets');

CREATE POLICY "Users can update their own farm assets" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'farm-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own farm assets" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'farm-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
