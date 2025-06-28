
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/auth";

export interface InventoryItem {
  id: number;
  farm_id: string;
  name: string;
  category: 'Araç' | 'Ekipman' | 'Makine' | 'Diğer';
  purchase_date: string;
  value: number;
  status: 'Aktif' | 'Bakımda' | 'Arızalı' | 'Arşivlendi';
  description?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  created_at: string;
  updated_at: string;
}

const fetchInventory = async (farmId: string): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('farm_id', farmId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching inventory:", error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useInventory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  const { data: inventory, isLoading, isError, error } = useQuery({
    queryKey: ['inventory', profile?.farm_id],
    queryFn: () => fetchInventory(profile?.farm_id || ''),
    enabled: !!profile?.farm_id,
  });

  const { mutate: addInventoryItem, isPending: isAdding } = useMutation({
    mutationFn: async (itemData: Omit<InventoryItem, 'id' | 'farm_id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('inventory').insert({
        ...itemData,
        farm_id: profile?.farm_id
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Demirbaş başarıyla eklendi." });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Demirbaş eklenirken bir hata oluştu: ${error.message}` });
    }
  });

  const { mutate: updateInventoryItem, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<InventoryItem> & { id: number }) => {
      const { error } = await supabase.from('inventory').update(updateData).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Demirbaş bilgileri güncellendi." });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Güncelleme sırasında bir hata oluştu: ${error.message}` });
    }
  });

  return { 
    inventory: inventory || [], 
    isLoading, 
    isError, 
    error, 
    addInventoryItem, 
    isAdding,
    updateInventoryItem,
    isUpdating
  };
};
