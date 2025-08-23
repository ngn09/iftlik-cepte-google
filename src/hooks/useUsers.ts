
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthorization } from "@/hooks/useAuthorization";
import type { User } from "@/types/user";

const fetchUsers = async (isAdmin: boolean): Promise<User[]> => {
  if (isAdmin) {
    // Admins get all fields including email
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, status, farm_id');

    if (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.message);
    }
    return data || [];
  } else {
    // Non-admins get limited fields without email
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, status, farm_id');

    if (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.message);
    }
    // Map to User type with email as undefined
    return (data || []).map(user => ({ ...user, email: undefined }));
  }
};

export const useUsers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAdmin } = useAuthorization();

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users', isAdmin],
    queryFn: () => fetchUsers(isAdmin),
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
