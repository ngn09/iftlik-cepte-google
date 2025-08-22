import { useAuth } from "@/auth/useAuth";
import { useMemo } from "react";

export const useAuthorization = () => {
  const { profile } = useAuth();

  const permissions = useMemo(() => {
    if (!profile) {
      return {
        isAdmin: false,
        isFarmOwner: false,
        canManageUsers: false,
        canUpdateRoles: false,
        canDeleteUsers: false,
        canViewUsers: false,
      };
    }

    const isAdmin = profile.role === 'Yönetici';
    
    return {
      isAdmin,
      isFarmOwner: isAdmin, // In this system, farm owners are admins
      canManageUsers: isAdmin,
      canUpdateRoles: isAdmin,
      canDeleteUsers: isAdmin,
      canViewUsers: true, // All authenticated users can view users in their farm
    };
  }, [profile]);

  return {
    ...permissions,
    profile,
    currentUserRole: profile?.role || null,
    currentUserFarmId: profile?.farm_id || null,
  };
};