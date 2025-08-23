import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { User } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roleOptions } from "@/config/roles";
import { useUpdateUserRole } from "@/hooks/useUpdateUserRole";
import { useAuthorization } from "@/hooks/useAuthorization";

interface UserTableProps {
  users: User[] | undefined;
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  canManageUsers: boolean;
  canUpdateRoles: boolean;
}

const UserTableSkeleton = () => (
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
);

export function UserTable({ users, isLoading, onEdit, onDelete, canManageUsers, canUpdateRoles }: UserTableProps) {
  const { mutate: updateUserRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { isAdmin } = useAuthorization();

  const handleRoleChange = (userId: string, newRole: string) => {
    updateUserRole({ userId, role: newRole });
  };

  return (
    <div className="border rounded-lg">
      {isLoading ? <UserTableSkeleton /> : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              {isAdmin && <TableHead>E-posta</TableHead>}
              <TableHead>Rol</TableHead>
              <TableHead>Durum</TableHead>
              {canManageUsers && <TableHead className="text-right">İşlemler</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                {isAdmin && <TableCell>{user.email}</TableCell>}
                <TableCell>
                  {canUpdateRoles ? (
                    <Select
                      value={user.role}
                      onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                      disabled={isUpdatingRole}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Rol seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell>{user.status}</TableCell>
                {canManageUsers && (
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => onDelete(user)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}