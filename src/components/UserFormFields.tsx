
import React, { useState, useEffect } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLES, roleOptions } from "@/config/roles";
import type { Role } from "@/config/roles";
import type { Control, UseFormWatch } from "react-hook-form";
import type { UserFormData } from "@/config/schemas/userSchema";

interface UserFormFieldsProps {
  control: Control<UserFormData>;
  watch: UseFormWatch<UserFormData>;
  isEditing: boolean;
}

export function UserFormFields({ control, watch, isEditing }: UserFormFieldsProps) {
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(watch("role") as Role);
  
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'role' && value.role) {
        setSelectedRole(value.role as Role);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <FormField
        control={control}
        name="full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ad Soyad</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-posta</FormLabel>
            <FormControl>
              <Input placeholder="test@example.com" {...field} disabled={isEditing} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {!isEditing && (
        <>
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre Tekrar</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rol</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Rol seçin" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {roleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole && <p className="text-sm text-muted-foreground mt-2">{ROLES[selectedRole]}</p>}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
