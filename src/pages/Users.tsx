import { Button } from "@/components/ui/button";
import { Plus, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ManageUserDialog } from "@/components/ManageUserDialog";
import { useUsers } from "@/hooks/useUsers";
import { UserTable } from "@/components/UserTable";
import { DeleteUserDialog } from "@/components/DeleteUserDialog";
import type { User } from "@/types/user";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthorization } from "@/hooks/useAuthorization";

const Users = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { toast } = useToast();
  const { isAdmin, canManageUsers, profile } = useAuthorization();

  const { users, isLoading, isError, error, deleteUser, isDeleting } = useUsers();

  const handleCopyToClipboard = () => {
    if (profile?.farm_id) {
      navigator.clipboard.writeText(profile.farm_id);
      toast({
        title: "Kopyalandı!",
        description: "Grup ID'si panoya kopyalandı.",
      });
    }
  };

  const handleAddNewUser = () => {
    setUserToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (user: User) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = (userId: string) => {
    deleteUser(userId, {
      onSettled: () => {
        setUserToDelete(null);
      },
    });
  };

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
        {canManageUsers && (
          isLoading ? (
            <Skeleton className="h-10 w-36" />
          ) : (
            <Button onClick={handleAddNewUser}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kullanıcı
            </Button>
          )
        )}
      </div>

      {profile?.farm_id && canManageUsers && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ekibinizi Davet Edin</CardTitle>
            <CardDescription>
              Ekip arkadaşlarınızı çiftliğinize davet etmek için aşağıdaki Grup ID'sini paylaşın. Onlar bu ID'yi kullanarak gruba katılabilirler.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 border rounded-lg bg-muted">
              <p className="text-lg font-mono font-semibold tracking-widest flex-grow">{profile.farm_id}</p>
              <Button variant="outline" size="icon" onClick={handleCopyToClipboard}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Kopyala</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <UserTable 
        users={users} 
        isLoading={isLoading} 
        onEdit={handleEditUser} 
        onDelete={handleDeleteRequest} 
        canManageUsers={canManageUsers}
        canUpdateRoles={isAdmin}
      />
      <ManageUserDialog user={userToEdit} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <DeleteUserDialog 
        user={userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Users;
