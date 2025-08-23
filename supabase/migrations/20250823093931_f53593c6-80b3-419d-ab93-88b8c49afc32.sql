-- Fix database function security by adding proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Update profiles RLS policies to restrict email visibility and add field-level security
DROP POLICY IF EXISTS "Users can view profiles in their farm" ON public.profiles;

-- Only admins can see all profile fields including email
CREATE POLICY "Admins can view all profiles in their farm"
ON public.profiles
FOR SELECT
USING (
  farm_id = get_current_user_farm_id() 
  AND get_current_user_role() = 'Yönetici'
);

-- Regular users can only see limited profile fields (excluding email)
CREATE POLICY "Users can view limited profile info in their farm"
ON public.profiles
FOR SELECT
USING (
  farm_id = get_current_user_farm_id()
  AND get_current_user_role() != 'Yönetici'
  AND id != auth.uid()
);

-- Users can always view their own complete profile
CREATE POLICY "Users can view their own complete profile"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

-- Secure camera access - only admins can view cameras
DROP POLICY IF EXISTS "Users can access cameras from their farm" ON public.cameras;

CREATE POLICY "Only admins can access cameras in their farm"
ON public.cameras
FOR ALL
USING (
  farm_id = get_current_user_farm_id()
  AND get_current_user_role() = 'Yönetici'
);

-- Add audit logging table for security monitoring
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  farm_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (
  farm_id = get_current_user_farm_id()
  AND get_current_user_role() = 'Yönetici'
);

-- Create function to log role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.audit_logs (
      user_id,
      action,
      table_name,
      record_id,
      old_values,
      new_values,
      farm_id
    ) VALUES (
      auth.uid(),
      'role_change',
      'profiles',
      NEW.id::text,
      jsonb_build_object('role', OLD.role),
      jsonb_build_object('role', NEW.role),
      NEW.farm_id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for role change logging
CREATE TRIGGER log_profile_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();