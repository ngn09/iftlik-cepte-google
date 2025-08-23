import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth";

export interface AuditLog {
  id: number;
  user_id: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  farm_id: string;
  created_at: string;
}

const fetchAuditLogs = async (farmId: string): Promise<AuditLog[]> => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('farm_id', farmId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching audit logs:", error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useAuditLogs = () => {
  const { profile } = useAuth();

  const { data: auditLogs, isLoading, isError, error } = useQuery({
    queryKey: ['auditLogs', profile?.farm_id],
    queryFn: () => fetchAuditLogs(profile?.farm_id || ''),
    enabled: !!profile?.farm_id,
  });

  return { 
    auditLogs: auditLogs || [], 
    isLoading, 
    isError, 
    error
  };
};