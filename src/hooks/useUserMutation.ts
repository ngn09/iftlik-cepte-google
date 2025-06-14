
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { UserFormData } from "@/config/schemas/userSchema";

export const useUserMutation = (onSuccessCallback: () => void, isEditing: boolean) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: UserFormData) => {
        const { id, password, confirmPassword, ...updateData } = data;
        
        if (id) {
            const { error } = await supabase.from('profiles').update(updateData).eq('id', id);
            if (error) throw new Error(error.message);
            return { ...updateData, id };
        } else {
            const { error } = await supabase.functions.invoke('create-user', {
                body: {
                    email: updateData.email,
                    password: password,
                    full_name: updateData.full_name,
                    role: updateData.role,
                }
            });
            if (error) {
              throw new Error(`Kullanıcı oluşturulamadı: ${typeof error === 'object' ? JSON.stringify(error) : error.message}`);
            }
        }
    },
    onSuccess: () => {
        toast({ title: "Başarılı", description: isEditing ? "Kullanıcı bilgileri güncellendi." : "Kullanıcı oluşturuldu." });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        onSuccessCallback();
    },
    onError: (error) => {
        toast({ variant: "destructive", title: "Hata", description: `İşlem sırasında bir hata oluştu: ${error.message}` });
    }
  });
};
