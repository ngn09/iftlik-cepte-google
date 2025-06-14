import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ManageUserDialog } from "@/components/ManageUserDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
};

const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, status');

  if (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
  // Supabase'den gelen null veriyi boş dizi olarak döndür
  return data || [];
};

const Users = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const currentUserRole = 'Yönetici';
  const isAdmin = currentUserRole === 'Yönetici';

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
        setUserToDelete(null);
    },
    onError: (error) => {
        toast({ variant: "destructive", title: "Hata", description: `Kullanıcı silinirken bir hata oluştu: ${error.message}` });
        setUserToDelete(null);
    }
  });

  const handleAddNewUser = () => {
    setUserToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
          {isAdmin && <Skeleton className="h-10 w-36" />}
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ad</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        </div>
        <div className="text-red-600 p-4 border border-red-500 rounded-lg bg-red-50">
          <p className="font-bold">Kullanıcılar yüklenirken bir hata oluştu.</p>
          <p className="text-sm mt-1">{error.message}</p>
          <p className="text-sm text-muted-foreground mt-2">
            <b>Öneri:</b> Lütfen Supabase projenizde `profiles` adında bir tablo oluşturduğunuzdan ve uygulamanın bu tabloya okuma izni olduğundan emin olun.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        {isAdmin && (
          <Button onClick={handleAddNewUser}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Kullanıcı
          </Button>
        )}
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              {isAdmin && <TableHead className="text-right">İşlemler</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => setUserToDelete(user)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ManageUserDialog user={userToEdit} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu, kullanıcıyı veritabanından kalıcı olarak silecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
