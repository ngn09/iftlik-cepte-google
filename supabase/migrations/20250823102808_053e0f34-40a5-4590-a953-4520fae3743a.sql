-- Fix remaining functions that need search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_farm_id()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT farm_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_farm_owner(target_farm_id text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.farms 
    WHERE id = target_farm_id 
    AND owner_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.generate_farm_id(size integer DEFAULT 6)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;