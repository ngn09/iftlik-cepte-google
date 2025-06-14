
-- Kullanıcı profillerini saklamak için 'profiles' tablosunu oluşturur.
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'İşçi',
  status TEXT NOT NULL DEFAULT 'Aktif',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 'updated_at' sütununu otomatik olarak güncellemek için bir fonksiyon oluşturur.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 'profiles' tablosundaki bir satır güncellendiğinde 'updated_at' trigger'ını tetikler.
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Tablo için Satır Seviyesi Güvenliği (RLS) etkinleştirir.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kimliği doğrulanmış kullanıcıların profilleri yönetmesine izin veren bir politika oluşturur.
-- Bu, UI katmanının kimin ne yapabileceğini kontrol ettiğini varsayar.
CREATE POLICY "Authenticated users can manage profiles"
  ON public.profiles FOR ALL
  USING ( auth.role() = 'authenticated' )
  WITH CHECK ( auth.role() = 'authenticated' );
