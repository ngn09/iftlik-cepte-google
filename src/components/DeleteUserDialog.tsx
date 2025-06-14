
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
import type { User } from "@/types/user";

interface DeleteUserDialogProps {
  user: User | null;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  isDeleting: boolean;
}

export function DeleteUserDialog({ user, onClose, onConfirm, isDeleting }: DeleteUserDialogProps) {
  const handleConfirm = () => {
    if (user) {
      onConfirm(user.id);
    }
  };

  return (
    <AlertDialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem geri alınamaz. Bu, kullanıcıyı veritabanından kalıcı olarak silecektir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? "Siliniyor..." : "Sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
