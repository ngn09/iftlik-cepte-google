
-- 1. Yeni çiftlikler için sahibi otomatik olarak ayarlayacak bir fonksiyon oluşturur.
CREATE OR REPLACE FUNCTION public.set_farm_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- Yeni eklenen çiftliğin `owner_id` alanını, işlemi yapan kullanıcının kimliği (ID) ile doldurur.
  NEW.owner_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Yukarıdaki fonksiyonu, `farms` tablosuna yeni bir kayıt eklenmeden hemen önce çalıştıracak bir tetikleyici (trigger) oluşturur.
-- Tekrar çalıştırılabilmesi için önce mevcut tetikleyiciyi (varsa) kaldırır.
DROP TRIGGER IF EXISTS on_farm_created ON public.farms;
CREATE TRIGGER on_farm_created
  BEFORE INSERT ON public.farms
  FOR EACH ROW EXECUTE PROCEDURE public.set_farm_owner();

-- 3. "Gruba Katıl" özelliğinin çalışabilmesi için okuma izinlerini günceller.
-- Bu, kimliği doğrulanmış herhangi bir kullanıcının mevcut bir çiftliği ID'si ile arayabilmesini sağlar.
DROP POLICY IF EXISTS "Farm members can view their farm" ON public.farms;
DROP POLICY IF EXISTS "Authenticated users can view farms" ON public.farms;
CREATE POLICY "Authenticated users can view farms"
ON public.farms
FOR SELECT
TO authenticated
USING (true);
