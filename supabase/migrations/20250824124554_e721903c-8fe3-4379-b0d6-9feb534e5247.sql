-- 1) Remove non-admin direct SELECT access to profiles to prevent email leakage
DROP POLICY IF EXISTS "Non-admin users can view basic profile info in their farm" ON public.profiles;

-- 2) Create a secure, redacted RPC for non-admins (no email exposed)
CREATE OR REPLACE FUNCTION public.get_farm_profiles_basic()
RETURNS TABLE (
  id uuid,
  full_name text,
  role text,
  status text,
  farm_id text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT p.id, p.full_name, p.role, p.status, p.farm_id
  FROM public.profiles AS p
  WHERE p.farm_id = get_current_user_farm_id()
    AND p.id <> auth.uid();
$$;

-- 3) Allow authenticated users to call the function
GRANT EXECUTE ON FUNCTION public.get_farm_profiles_basic() TO authenticated;