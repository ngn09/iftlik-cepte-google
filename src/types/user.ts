
export type User = {
  id: string;
  full_name: string;
  email?: string; // Made optional since non-admins can't access emails
  role: string;
  status: string;
  farm_id?: string | null;
};
