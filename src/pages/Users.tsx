
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSupabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

// Bu fonksiyon, Supabase'deki 'profiles' tablosundan kullanıcıları çeker.
// Not: Supabase projenizde 'id' (uuid), 'full_name' (text), 'email' (text), 
// 'role' (text), ve 'status' (text) sütunlarına sahip bir 'profiles' tablosu olmalıdır.
const fetchUsers = async () => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, status');

  if (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.message);
  }
  // Bileşenin `user.name` kullanabilmesi için `full_name` alanını `name` olarak eşliyoruz.
  return data.map(user => ({ ...user, name: user.full_name }));
};


const Users = () => {
  const { toast } = useToast();
  // TODO: Bu rol, giriş yapan kullanıcıdan dinamik olarak alınmalıdır.
  const currentUserRole = 'Yönetici';
  const isAdmin = currentUserRole === 'Yönetici';

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const handleUserAction = (action: string, userId?: number | string) => {
    // TODO: Supabase ile kullanıcı ekleme, düzenleme ve silme işlemleri yapılacak
    toast({
      title: "Kullanıcı İşlemi",
      description: `${action} işlemi için arayüz hazırlandı. ${userId ? `ID: ${userId}` : ''}`
    });
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
          <Button onClick={() => handleUserAction("Yeni kullanıcı ekle")}>
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
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => handleUserAction("Kullanıcı düzenle", user.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleUserAction("Kullanıcı sil", user.id)}>
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
    </div>
  );
};

export default Users;
