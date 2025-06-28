
-- Hayvan türleri için enum
CREATE TYPE animal_species AS ENUM ('İnek', 'Koyun', 'Keçi', 'Tavuk', 'Diğer');
CREATE TYPE animal_gender AS ENUM ('Erkek', 'Dişi');
CREATE TYPE animal_status AS ENUM ('Aktif', 'Hamile', 'Hasta', 'Arşivlendi');

-- Hayvanlar tablosu
CREATE TABLE public.animals (
  id TEXT PRIMARY KEY,
  farm_id TEXT NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  species animal_species NOT NULL,
  breed TEXT NOT NULL,
  gender animal_gender NOT NULL,
  status animal_status NOT NULL DEFAULT 'Aktif',
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Envanter kategorileri için enum
CREATE TYPE inventory_category AS ENUM ('Araç', 'Ekipman', 'Makine', 'Diğer');
CREATE TYPE inventory_status AS ENUM ('Aktif', 'Bakımda', 'Arızalı', 'Arşivlendi');

-- Envanter tablosu
CREATE TABLE public.inventory (
  id SERIAL PRIMARY KEY,
  farm_id TEXT NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category inventory_category NOT NULL,
  purchase_date DATE NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  status inventory_status NOT NULL DEFAULT 'Aktif',
  description TEXT,
  last_maintenance DATE,
  next_maintenance DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Yem stok türleri için enum
CREATE TYPE feed_type AS ENUM ('Tahıl', 'Kaba Yem', 'Konsantre', 'Katkı');
CREATE TYPE feed_unit AS ENUM ('kg', 'ton');

-- Yem stok tablosu
CREATE TABLE public.feed_stock (
  id SERIAL PRIMARY KEY,
  farm_id TEXT NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type feed_type NOT NULL,
  stock_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit feed_unit NOT NULL DEFAULT 'kg',
  supplier TEXT,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sağlık kayıtları tablosu
CREATE TYPE health_outcome AS ENUM ('Tedavi Altında', 'İyileşti', 'Öldü');

CREATE TABLE public.health_records (
  id SERIAL PRIMARY KEY,
  farm_id TEXT NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  animal_tag TEXT NOT NULL,
  date DATE NOT NULL,
  diagnosis TEXT NOT NULL,
  treatment TEXT NOT NULL,
  notes TEXT,
  vet_name TEXT NOT NULL,
  outcome health_outcome DEFAULT 'Tedavi Altında',
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Kameralar tablosu
CREATE TYPE camera_status AS ENUM ('online', 'offline');

CREATE TABLE public.cameras (
  id TEXT PRIMARY KEY,
  farm_id TEXT NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stream_url TEXT,
  status camera_status NOT NULL DEFAULT 'offline',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sohbet mesajları tablosu
CREATE TABLE public.chat_messages (
  id SERIAL PRIMARY KEY,
  farm_id TEXT NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Güncelleme tetikleyicileri
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_animals_updated_at BEFORE UPDATE ON public.animals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON public.inventory FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_feed_stock_updated_at BEFORE UPDATE ON public.feed_stock FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON public.health_records FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cameras_updated_at BEFORE UPDATE ON public.cameras FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RLS politikaları - Sadece aynı çiftlikteki kullanıcılar erişebilir
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Animals tablosu politikaları
CREATE POLICY "Users can access animals from their farm" ON public.animals
FOR ALL USING (
  farm_id IN (
    SELECT farm_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Inventory tablosu politikaları
CREATE POLICY "Users can access inventory from their farm" ON public.inventory
FOR ALL USING (
  farm_id IN (
    SELECT farm_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Feed stock tablosu politikaları
CREATE POLICY "Users can access feed stock from their farm" ON public.feed_stock
FOR ALL USING (
  farm_id IN (
    SELECT farm_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Health records tablosu politikaları
CREATE POLICY "Users can access health records from their farm" ON public.health_records
FOR ALL USING (
  farm_id IN (
    SELECT farm_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Cameras tablosu politikaları
CREATE POLICY "Users can access cameras from their farm" ON public.cameras
FOR ALL USING (
  farm_id IN (
    SELECT farm_id FROM public.profiles WHERE id = auth.uid()
  )
);

-- Chat messages tablosu politikaları
CREATE POLICY "Users can access chat messages from their farm" ON public.chat_messages
FOR ALL USING (
  farm_id IN (
    SELECT farm_id FROM public.profiles WHERE id = auth.uid()
  )
);
