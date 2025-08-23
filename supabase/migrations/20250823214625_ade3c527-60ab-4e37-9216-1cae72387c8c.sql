-- Remove the policy that allows non-admins to view other users' profiles
-- This policy currently allows access to all columns including sensitive email data
DROP POLICY IF EXISTS "Users can view limited profile info in their farm" ON public.profiles;

-- Create a new, more restrictive policy for non-admin users
-- This policy will be used in conjunction with application-level field filtering
CREATE POLICY "Non-admin users can view basic profile info in their farm" 
ON public.profiles 
FOR SELECT 
USING (
  (farm_id = get_current_user_farm_id()) 
  AND (get_current_user_role() <> 'Yönetici'::text) 
  AND (id <> auth.uid())
);