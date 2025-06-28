
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/auth";

export interface HealthRecord {
  id: number;
  farm_id: string;
  animal_tag: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  vet_name: string;
  outcome?: 'Tedavi Altında' | 'İyileşti' | 'Öldü';
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
}

const fetchHealthRecords = async (farmId: string): Promise<HealthRecord[]> => {
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('farm_id', farmId)
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching health records:", error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useHealthRecords = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  const { data: healthRecords, isLoading, isError, error } = useQuery({
    queryKey: ['healthRecords', profile?.farm_id],
    queryFn: () => fetchHealthRecords(profile?.farm_id || ''),
    enabled: !!profile?.farm_id,
  });

  const { mutate: addHealthRecord, isPending: isAdding } = useMutation({
    mutationFn: async (recordData: Omit<HealthRecord, 'id' | 'farm_id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('health_records').insert({
        ...recordData,
        farm_id: profile?.farm_id
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Sağlık kaydı başarıyla eklendi." });
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Sağlık kaydı eklenirken bir hata oluştu: ${error.message}` });
    }
  });

  const { mutate: updateHealthRecord, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<HealthRecord> & { id: number }) => {
      const { error } = await supabase.from('health_records').update(updateData).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Sağlık kaydı güncellendi." });
      queryClient.invalidateQueries({ queryKey: ['healthRecords'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Güncelleme sırasında bir hata oluştu: ${error.message}` });
    }
  });

  return { 
    healthRecords: healthRecords || [], 
    isLoading, 
    isError, 
    error, 
    addHealthRecord, 
    isAdding,
    updateHealthRecord,
    isUpdating
  };
};
