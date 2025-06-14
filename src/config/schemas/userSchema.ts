
import * as z from "zod";
import { ROLES } from "@/config/roles";

export const userFormSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(2, { message: "Ad soyad en az 2 karakter olmalıdır." }),
  email: z.string().email({ message: "Geçersiz e-posta adresi." }),
  role: z.string().refine(val => Object.keys(ROLES).includes(val), { message: "Geçersiz rol."}),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (!data.id) { // New user
    if (!data.password || data.password.length < 6) {
        return false;
    }
    return data.password === data.confirmPassword;
  }
  return true; // Existing user, no password validation needed
}, {
  message: "Yeni kullanıcılar için şifreler eşleşmeli ve en az 6 karakter olmalıdır.",
  path: ["confirmPassword"],
});

export type UserFormData = z.infer<typeof userFormSchema>;
