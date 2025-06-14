
-- "Sert sıfırlama": Çiftlik oluşturma için tüm bilinen güvenlik politikalarını kaldırır.
DROP POLICY IF EXISTS "Authenticated users can create farms" ON public.farms;
DROP POLICY IF EXISTS "Authenticated users can create farms for themselves" ON public.farms;

-- Doğru ve güvenli politikayı yeniden oluşturur.
-- Bu, kullanıcıların yalnızca kendi kimlikleri (ID) ile eşleşen bir owner_id'ye sahip çiftlikler oluşturabilmesini sağlar.
CREATE POLICY "Authenticated users can create farms for themselves"
ON public.farms
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);
