
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([
    { id: 1, name: "Admin Kullanıcı", email: "admin@ciftlik.com", role: "Yönetici", status: "Aktif" },
    { id: 2, name: "Çiftlik İşçisi", email: "isci@ciftlik.com", role: "İşçi", status: "Aktif" },
    { id: 3, name: "Veteriner", email: "vet@ciftlik.com", role: "Veteriner", status: "Aktif" },
  ]);

  const handleUserAction = (action: string, userId?: number) => {
    // TODO: Supabase ile entegre edilecek
    toast({
      title: "Kullanıcı İşlemi",
      description: `${action} işlemi gerçekleştirildi. ${userId ? `ID: ${userId}` : ''}`
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        <Button onClick={() => handleUserAction("Yeni kullanıcı ekle")}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kullanıcı
        </Button>
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
