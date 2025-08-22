-- Create security functions to safely check user roles without RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_farm_id()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT farm_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_farm_owner(target_farm_id TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.farms 
    WHERE id = target_farm_id 
    AND owner_id = auth.uid()
  );
$$;

-- Drop the existing overly permissive profiles policy
DROP POLICY IF EXISTS "Authenticated users can manage profiles" ON public.profiles;

-- Create proper farm-scoped policies for profiles table
CREATE POLICY "Users can view profiles in their farm"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  farm_id = public.get_current_user_farm_id()
);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Farm owners can update roles in their farm"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  public.get_current_user_role() = 'Yönetici' 
  AND public.is_farm_owner(farm_id)
)
WITH CHECK (
  public.get_current_user_role() = 'Yönetici' 
  AND public.is_farm_owner(farm_id)
);

CREATE POLICY "New users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Update farms table policies to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can view farms" ON public.farms;

CREATE POLICY "Users can view their associated farm"
ON public.farms
FOR SELECT
TO authenticated
USING (
  id = public.get_current_user_farm_id()
  OR owner_id = auth.uid()
);

-- Fix database functions security
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;