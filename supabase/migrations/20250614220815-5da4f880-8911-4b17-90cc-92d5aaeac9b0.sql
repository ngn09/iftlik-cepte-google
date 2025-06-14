
-- 1. Artık kullanılmayacağı için tetikleyiciyi ve ilgili fonksiyonu kaldırıyoruz.
DROP TRIGGER IF EXISTS on_farm_created ON public.farms;
DROP FUNCTION IF EXISTS public.set_farm_owner();

-- 2. 'owner_id' sütununa, yeni bir çiftlik oluşturulduğunda sahibini otomatik olarak atayacak bir varsayılan değer ekliyoruz.
-- Bu, hem veritabanı mantığını basitleştirir hem de TypeScript türlerinin doğru şekilde üretilmesini sağlayarak hatayı çözer.
ALTER TABLE public.farms
ALTER COLUMN owner_id SET DEFAULT auth.uid();
