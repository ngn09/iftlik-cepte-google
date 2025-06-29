import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/auth";

export interface Animal {
  id: string;
  farm_id: string;
  species: 'İnek' | 'Koyun' | 'Keçi' | 'Tavuk' | 'Diğer';
  breed: string;
  gender: 'Erkek' | 'Dişi';
  status: 'Aktif' | 'Hamile' | 'Hasta' | 'Arşivlendi';
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

const fetchAnimals = async (farmId: string): Promise<Animal[]> => {
  const { data, error } = await supabase
    .from('animals')
    .select('*')
    .eq('farm_id', farmId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching animals:", error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useAnimals = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { profile } = useAuth();

  const { data: animals, isLoading, isError, error } = useQuery({
    queryKey: ['animals', profile?.farm_id],
    queryFn: () => fetchAnimals(profile?.farm_id || ''),
    enabled: !!profile?.farm_id,
  });

  const { mutate: addAnimal, isPending: isAdding } = useMutation({
    mutationFn: async (animalData: Omit<Animal, 'farm_id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('animals').insert({
        ...animalData,
        farm_id: profile?.farm_id
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Hayvan başarıyla eklendi." });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Hayvan eklenirken bir hata oluştu: ${error.message}` });
    }
  });

  // Callback destekli addAnimal fonksiyonu
  const addAnimalWithCallback = (
    animalData: Omit<Animal, 'farm_id' | 'created_at' | 'updated_at'>, 
    callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }
  ) => {
    addAnimal(animalData, {
      onSuccess: () => {
        callbacks?.onSuccess?.();
      },
      onError: (error) => {
        callbacks?.onError?.(error);
      }
    });
  };

  const { mutate: updateAnimal, isPending: isUpdating } = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Animal> & { id: string }) => {
      const { error } = await supabase.from('animals').update(updateData).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Hayvan bilgileri güncellendi." });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Güncelleme sırasında bir hata oluştu: ${error.message}` });
    }
  });

  const { mutate: deleteAnimal, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('animals').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Başarılı", description: "Hayvan başarıyla silindi." });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
    onError: (error) => {
      toast({ variant: "destructive", title: "Hata", description: `Silme sırasında bir hata oluştu: ${error.message}` });
    }
  });

  return { 
    animals: animals || [], 
    isLoading, 
    isError, 
    error, 
    addAnimal: addAnimalWithCallback, 
    isAdding,
    updateAnimal,
    isUpdating,
    deleteAnimal,
    isDeleting
  };
};
