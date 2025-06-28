
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/auth";

export interface FeedStockItem {
  id: number;
  farm_id: string;
  name: string;
  type: 'Tahıl' | 'Kaba Yem' | 'Konsantre' | 'Katkı';
  stock_amount: number;
  unit: 'kg' | 'ton';
  supplier?: string;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

const fetchFeedStock = async (farmId: string): Promise<FeedStockItem[]> => {
  const { data, error } = await supabase
    .from('feed_stock')
    .select('*')
    .eq('farm_id', farmId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching feed stock:", error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useFeedStock = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  const { data: feedStock, isLoading, isError, error } = useQuery({
    queryKey: ['feedStock', profile?.farm_id],
    queryFn: () => fetchFeedStock(profile?.farm_id || ''),
    enabled: !!profile?.farm_id,
  });

  const { mutate: addFeedItem, isPending: isAdding } = useMutation({
    mutationFn: async (itemData: Omit<FeedStockItem, 'id' | 'farm_id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('feed_stock').insert({
        ...itemData,
        farm_id: profile?.farm_id
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Yem öğesi başarıyla eklendi." });
      queryClient.invalidateQueries({ queryKey: ['feedStock'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Yem öğesi eklenirken bir hata oluştu: ${error.message}` });
    }
  });

  const { mutate: updateFeedItem, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<FeedStockItem> & { id: number }) => {
      const { error } = await supabase.from('feed_stock').update(updateData).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Yem bilgileri güncellendi." });
      queryClient.invalidateQueries({ queryKey: ['feedStock'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Güncelleme sırasında bir hata oluştu: ${error.message}` });
    }
  });

  return { 
    feedStock: feedStock || [], 
    isLoading, 
    isError, 
    error, 
    addFeedItem, 
    isAdding,
    updateFeedItem,
    isUpdating
  };
};
