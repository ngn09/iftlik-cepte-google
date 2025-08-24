-- Fix security vulnerability: Restrict all profiles table access to authenticated users only
-- Current policies use {public} roles which can allow anonymous access attempts

-- Drop existing policies that use {public} role
DROP POLICY IF EXISTS "Admins can view all profiles in their farm" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "New users can insert their own profile" ON public.profiles;

-- Recreate all policies with proper authentication requirements
CREATE POLICY "Admins can view all profiles in their farm" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING ((farm_id = get_current_user_farm_id()) AND (get_current_user_role() = 'Yönetici'::text));

CREATE POLICY "Users can view their own complete profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "New users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (id = auth.uid());

-- The "Farm owners can update roles" policy already uses authenticated role, so no change needed