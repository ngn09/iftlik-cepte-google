
-- Güvenlik sorununu ayıklamak amacıyla geçici olarak daha izin verici bir politikaya geri dönülüyor.
-- Bu, sorunun CHECK koşulunda olup olmadığını belirlememize yardımcı olacaktır.

-- Önce mevcut kısıtlayıcı politikayı kaldıralım.
DROP POLICY IF EXISTS "Authenticated users can create farms for themselves" ON public.farms;

-- Ardından orijinal, daha izin verici politikayı yeniden ekleyelim.
-- Bu, kimliği doğrulanmış herhangi bir kullanıcının bir çiftlik oluşturmasına olanak tanır.
-- Hata ayıklaması yapıldıktan sonra daha güvenli politikayı geri yükleyeceğiz.
CREATE POLICY "Authenticated users can create farms"
ON public.farms
FOR INSERT
TO authenticated
WITH CHECK (true);
