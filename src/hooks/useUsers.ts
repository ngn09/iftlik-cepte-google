
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/user";

const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, status');

  if (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
  return data || [];
};

export const useUsers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: async (userId: string) => {
        const { error } = await supabase.from('profiles').delete().eq('id', userId);
        if (error) throw new Error(error.message);
    },
    onSuccess: () => {
        toast({ title: "Başarılı", description: "Kullanıcı başarıyla silindi." });
        queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
        toast({ variant: "destructive", title: "Hata", description: `Kullanıcı silinirken bir hata oluştu: ${error.message}` });
    }
  });

  return { users, isLoading, isError, error, deleteUser, isDeleting };
};
