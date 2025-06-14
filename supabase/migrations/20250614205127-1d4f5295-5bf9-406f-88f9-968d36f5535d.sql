
-- 1. Create a function to generate short, unique, human-readable IDs for farms.
CREATE OR REPLACE FUNCTION public.generate_farm_id(size INT DEFAULT 6)
RETURNS TEXT AS $$
DECLARE
  chars TEXT[] := '{A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9}';
  result TEXT := '';
  i INTEGER;
  new_id TEXT;
  is_unique BOOLEAN := FALSE;
BEGIN
  WHILE NOT is_unique LOOP
    result := '';
    FOR i IN 1..size LOOP
      result := result || chars[1 + floor(random() * array_length(chars, 1))];
    END LOOP;
    new_id := result;
    -- Check if the generated ID already exists in the farms table
    PERFORM 1 FROM public.farms WHERE id = new_id;
    IF NOT FOUND THEN
      is_unique := TRUE;
    END IF;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 2. Create the 'farms' table to store farm/group information.
CREATE TABLE public.farms (
  id TEXT NOT NULL PRIMARY KEY DEFAULT public.generate_farm_id(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.farms IS 'Stores information about user farms or groups.';

-- 3. Add a 'farm_id' column to the 'profiles' table to link users to farms.
ALTER TABLE public.profiles
ADD COLUMN farm_id TEXT;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_farm_id_fkey
FOREIGN KEY (farm_id) REFERENCES public.farms(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.profiles.farm_id IS 'The farm this user belongs to.';

-- 4. Enable Row Level Security for the 'farms' table.
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for the 'farms' table.
-- Policy: Allow authenticated users to create new farms.
CREATE POLICY "Authenticated users can create farms"
ON public.farms
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow farm members to view their farm's details.
CREATE POLICY "Farm members can view their farm"
ON public.farms
FOR SELECT
USING (id = (SELECT farm_id FROM public.profiles WHERE profiles.id = auth.uid()));

-- Policy: Allow farm owners to update their farm's details.
CREATE POLICY "Farm owners can update their farm"
ON public.farms
FOR UPDATE
USING (auth.uid() = owner_id);

-- Policy: Allow farm owners to delete their farms.
CREATE POLICY "Farm owners can delete their farm"
ON public.farms
FOR DELETE
USING (auth.uid() = owner_id);
