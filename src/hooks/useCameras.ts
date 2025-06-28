
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/auth";

export interface Camera {
  id: string;
  farm_id: string;
  name: string;
  stream_url?: string;
  status: 'online' | 'offline';
  created_at: string;
  updated_at: string;
}

const fetchCameras = async (farmId: string): Promise<Camera[]> => {
  const { data, error } = await supabase
    .from('cameras')
    .select('*')
    .eq('farm_id', farmId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching cameras:", error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useCameras = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  const { data: cameras, isLoading, isError, error } = useQuery({
    queryKey: ['cameras', profile?.farm_id],
    queryFn: () => fetchCameras(profile?.farm_id || ''),
    enabled: !!profile?.farm_id,
  });

  const { mutate: addCamera, isPending: isAdding } = useMutation({
    mutationFn: async (cameraData: Omit<Camera, 'farm_id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('cameras').insert({
        ...cameraData,
        farm_id: profile?.farm_id
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Kamera başarıyla eklendi." });
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Kamera eklenirken bir hata oluştu: ${error.message}` });
    }
  });

  const { mutate: updateCamera, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Camera> & { id: string }) => {
      const { error } = await supabase.from('cameras').update(updateData).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Kamera bilgileri güncellendi." });
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Güncelleme sırasında bir hata oluştu: ${error.message}` });
    }
  });

  const { mutate: deleteCamera, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('cameras').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Kamera başarıyla silindi." });
      queryClient.invalidateQueries({ queryKey: ['cameras'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Silme sırasında bir hata oluştu: ${error.message}` });
    }
  });

  return { 
    cameras: cameras || [], 
    isLoading, 
    isError, 
    error, 
    addCamera, 
    isAdding,
    updateCamera,
    isUpdating,
    deleteCamera,
    isDeleting
  };
};
