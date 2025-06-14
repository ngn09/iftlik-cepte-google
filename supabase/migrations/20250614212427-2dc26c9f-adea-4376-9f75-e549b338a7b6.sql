
-- Mevcut çiftlik ekleme politikasını kaldırıyoruz.
DROP POLICY "Authenticated users can create farms" ON public.farms;

-- Kullanıcıların yalnızca kendileri için çiftlik oluşturabilmesini sağlayan yeni ve daha güvenli bir politika ekliyoruz.
CREATE POLICY "Authenticated users can create farms for themselves"
ON public.farms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);
