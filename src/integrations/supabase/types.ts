export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      animals: {
        Row: {
          breed: string
          created_at: string
          date_of_birth: string
          farm_id: string
          gender: Database["public"]["Enums"]["animal_gender"]
          id: string
          species: Database["public"]["Enums"]["animal_species"]
          status: Database["public"]["Enums"]["animal_status"]
          updated_at: string
        }
        Insert: {
          breed: string
          created_at?: string
          date_of_birth: string
          farm_id: string
          gender: Database["public"]["Enums"]["animal_gender"]
          id: string
          species: Database["public"]["Enums"]["animal_species"]
          status?: Database["public"]["Enums"]["animal_status"]
          updated_at?: string
        }
        Update: {
          breed?: string
          created_at?: string
          date_of_birth?: string
          farm_id?: string
          gender?: Database["public"]["Enums"]["animal_gender"]
          id?: string
          species?: Database["public"]["Enums"]["animal_species"]
          status?: Database["public"]["Enums"]["animal_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "animals_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      cameras: {
        Row: {
          created_at: string
          farm_id: string
          id: string
          name: string
          status: Database["public"]["Enums"]["camera_status"]
          stream_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          farm_id: string
          id: string
          name: string
          status?: Database["public"]["Enums"]["camera_status"]
          stream_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          farm_id?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["camera_status"]
          stream_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cameras_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          farm_id: string
          id: number
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          farm_id: string
          id?: number
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          farm_id?: string
          id?: number
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string | null
          owner_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string | null
          owner_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string | null
          owner_id?: string
        }
        Relationships: []
      }
      feed_stock: {
        Row: {
          created_at: string
          farm_id: string
          id: number
          last_updated: string
          name: string
          stock_amount: number
          supplier: string | null
          type: Database["public"]["Enums"]["feed_type"]
          unit: Database["public"]["Enums"]["feed_unit"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          farm_id: string
          id?: number
          last_updated?: string
          name: string
          stock_amount?: number
          supplier?: string | null
          type: Database["public"]["Enums"]["feed_type"]
          unit?: Database["public"]["Enums"]["feed_unit"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          farm_id?: string
          id?: number
          last_updated?: string
          name?: string
          stock_amount?: number
          supplier?: string | null
          type?: Database["public"]["Enums"]["feed_type"]
          unit?: Database["public"]["Enums"]["feed_unit"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_stock_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          animal_tag: string
          created_at: string
          date: string
          diagnosis: string
          farm_id: string
          id: number
          is_archived: boolean | null
          notes: string | null
          outcome: Database["public"]["Enums"]["health_outcome"] | null
          treatment: string
          updated_at: string
          vet_name: string
        }
        Insert: {
          animal_tag: string
          created_at?: string
          date: string
          diagnosis: string
          farm_id: string
          id?: number
          is_archived?: boolean | null
          notes?: string | null
          outcome?: Database["public"]["Enums"]["health_outcome"] | null
          treatment: string
          updated_at?: string
          vet_name: string
        }
        Update: {
          animal_tag?: string
          created_at?: string
          date?: string
          diagnosis?: string
          farm_id?: string
          id?: number
          is_archived?: boolean | null
          notes?: string | null
          outcome?: Database["public"]["Enums"]["health_outcome"] | null
          treatment?: string
          updated_at?: string
          vet_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_records_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: Database["public"]["Enums"]["inventory_category"]
          created_at: string
          description: string | null
          farm_id: string
          id: number
          last_maintenance: string | null
          name: string
          next_maintenance: string | null
          purchase_date: string
          status: Database["public"]["Enums"]["inventory_status"]
          updated_at: string
          value: number
        }
        Insert: {
          category: Database["public"]["Enums"]["inventory_category"]
          created_at?: string
          description?: string | null
          farm_id: string
          id?: number
          last_maintenance?: string | null
          name: string
          next_maintenance?: string | null
          purchase_date: string
          status?: Database["public"]["Enums"]["inventory_status"]
          updated_at?: string
          value: number
        }
        Update: {
          category?: Database["public"]["Enums"]["inventory_category"]
          created_at?: string
          description?: string | null
          farm_id?: string
          id?: number
          last_maintenance?: string | null
          name?: string
          next_maintenance?: string | null
          purchase_date?: string
          status?: Database["public"]["Enums"]["inventory_status"]
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "inventory_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          farm_id: string | null
          full_name: string
          id: string
          role: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          farm_id?: string | null
          full_name: string
          id: string
          role?: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          farm_id?: string | null
          full_name?: string
          id?: string
          role?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_farm_id: {
        Args: { size?: number }
        Returns: string
      }
    }
    Enums: {
      animal_gender: "Erkek" | "Dişi"
      animal_species: "İnek" | "Koyun" | "Keçi" | "Tavuk" | "Diğer"
      animal_status: "Aktif" | "Hamile" | "Hasta" | "Arşivlendi"
      camera_status: "online" | "offline"
      feed_type: "Tahıl" | "Kaba Yem" | "Konsantre" | "Katkı"
      feed_unit: "kg" | "ton"
      health_outcome: "Tedavi Altında" | "İyileşti" | "Öldü"
      inventory_category: "Araç" | "Ekipman" | "Makine" | "Diğer"
      inventory_status: "Aktif" | "Bakımda" | "Arızalı" | "Arşivlendi"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      animal_gender: ["Erkek", "Dişi"],
      animal_species: ["İnek", "Koyun", "Keçi", "Tavuk", "Diğer"],
      animal_status: ["Aktif", "Hamile", "Hasta", "Arşivlendi"],
      camera_status: ["online", "offline"],
      feed_type: ["Tahıl", "Kaba Yem", "Konsantre", "Katkı"],
      feed_unit: ["kg", "ton"],
      health_outcome: ["Tedavi Altında", "İyileşti", "Öldü"],
      inventory_category: ["Araç", "Ekipman", "Makine", "Diğer"],
      inventory_status: ["Aktif", "Bakımda", "Arızalı", "Arşivlendi"],
    },
  },
} as const
