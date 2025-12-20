export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          allergies_concerns: string | null
          amount: number | null
          appointment_date: string | null
          appointment_time: string | null
          client_email: string
          client_name: string
          client_phone: string
          created_at: string
          duration_estimate: string | null
          event_type: string | null
          id: string
          location: string | null
          makeup_look_preference: string | null
          message: string | null
          number_of_people: number | null
          payment_id: string | null
          payment_status: string | null
          reference_images: string[] | null
          service: string
          skin_type: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allergies_concerns?: string | null
          amount?: number | null
          appointment_date?: string | null
          appointment_time?: string | null
          client_email: string
          client_name: string
          client_phone: string
          created_at?: string
          duration_estimate?: string | null
          event_type?: string | null
          id?: string
          location?: string | null
          makeup_look_preference?: string | null
          message?: string | null
          number_of_people?: number | null
          payment_id?: string | null
          payment_status?: string | null
          reference_images?: string[] | null
          service: string
          skin_type?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allergies_concerns?: string | null
          amount?: number | null
          appointment_date?: string | null
          appointment_time?: string | null
          client_email?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          duration_estimate?: string | null
          event_type?: string | null
          id?: string
          location?: string | null
          makeup_look_preference?: string | null
          message?: string | null
          number_of_people?: number | null
          payment_id?: string | null
          payment_status?: string | null
          reference_images?: string[] | null
          service?: string
          skin_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_details: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: string
          bank_name: string
          branch_name: string | null
          created_at: string
          gst_number: string | null
          id: string
          ifsc_code: string
          pan_number: string
          updated_at: string
          upi_id: string | null
          user_id: string
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type?: string
          bank_name: string
          branch_name?: string | null
          created_at?: string
          gst_number?: string | null
          id?: string
          ifsc_code: string
          pan_number: string
          updated_at?: string
          upi_id?: string | null
          user_id: string
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: string
          bank_name?: string
          branch_name?: string | null
          created_at?: string
          gst_number?: string | null
          id?: string
          ifsc_code?: string
          pan_number?: string
          updated_at?: string
          upi_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          id: string
          message: string | null
          payer_name: string
          payment_id: string
          provider_id: string
          rating: number
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          payer_name: string
          payment_id: string
          provider_id: string
          rating: number
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          payer_name?: string
          payment_id?: string
          provider_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "feedback_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          payment_id: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          payment_id?: string | null
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          payment_id?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string | null
          callback_data: Json | null
          created_at: string
          currency: string
          id: string
          payer_email: string | null
          payer_name: string | null
          payer_phone: string | null
          payment_id: string | null
          payment_method: string | null
          payment_response: Json | null
          payment_status: string
          payment_type: string | null
          provider_id: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          updated_at: string
          user_id: string | null
          verified_at: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          callback_data?: Json | null
          created_at?: string
          currency?: string
          id?: string
          payer_email?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_response?: Json | null
          payment_status?: string
          payment_type?: string | null
          provider_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          callback_data?: Json | null
          created_at?: string
          currency?: string
          id?: string
          payer_email?: string | null
          payer_name?: string | null
          payer_phone?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_response?: Json | null
          payment_status?: string
          payment_type?: string | null
          provider_id?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_balance: number | null
          available_days: string[] | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          category: string | null
          city: string | null
          email: string | null
          expected_payment_amount: number | null
          full_name: string | null
          hourly_rate: number | null
          id: string
          phone: string | null
          portfolio_images: string[] | null
          price_range: string | null
          service_pricing: Json | null
          services: string | null
          social_accounts: string | null
          updated_at: string | null
        }
        Insert: {
          account_balance?: number | null
          available_days?: string[] | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          email?: string | null
          expected_payment_amount?: number | null
          full_name?: string | null
          hourly_rate?: number | null
          id: string
          phone?: string | null
          portfolio_images?: string[] | null
          price_range?: string | null
          service_pricing?: Json | null
          services?: string | null
          social_accounts?: string | null
          updated_at?: string | null
        }
        Update: {
          account_balance?: number | null
          available_days?: string[] | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          email?: string | null
          expected_payment_amount?: number | null
          full_name?: string | null
          hourly_rate?: number | null
          id?: string
          phone?: string | null
          portfolio_images?: string[] | null
          price_range?: string | null
          service_pricing?: Json | null
          services?: string | null
          social_accounts?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          category_tags: string[] | null
          completed: boolean
          created_at: string
          description: string | null
          due_date: string | null
          estimated_duration: string | null
          id: string
          priority: string
          start_date: string | null
          status: string | null
          task_type: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category_tags?: string[] | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_duration?: string | null
          id?: string
          priority?: string
          start_date?: string | null
          status?: string | null
          task_type?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category_tags?: string[] | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_duration?: string | null
          id?: string
          priority?: string
          start_date?: string | null
          status?: string | null
          task_type?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          bank_details_id: string | null
          created_at: string
          id: string
          notes: string | null
          processed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_details_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_details_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          processed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_bank_details_id_fkey"
            columns: ["bank_details_id"]
            isOneToOne: false
            referencedRelation: "bank_details"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          available_days: string[] | null
          avatar_url: string | null
          bio: string | null
          category: string | null
          city: string | null
          full_name: string | null
          id: string | null
          portfolio_images: string[] | null
          price_range: string | null
          services: string | null
          social_accounts: string | null
          updated_at: string | null
        }
        Insert: {
          available_days?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          full_name?: string | null
          id?: string | null
          portfolio_images?: string[] | null
          price_range?: string | null
          services?: string | null
          social_accounts?: string | null
          updated_at?: string | null
        }
        Update: {
          available_days?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          city?: string | null
          full_name?: string | null
          id?: string | null
          portfolio_images?: string[] | null
          price_range?: string | null
          services?: string | null
          social_accounts?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_book_appointment: { Args: { provider_id: string }; Returns: boolean }
      get_contact_for_booking: {
        Args: { provider_id: string }
        Returns: {
          email: string
          phone: string
        }[]
      }
      get_public_profile_safe: {
        Args: { profile_id: string }
        Returns: {
          available_days: string[]
          avatar_url: string
          banner_url: string
          bio: string
          category: string
          city: string
          full_name: string
          id: string
          portfolio_images: string[]
          price_range: string
          services: string
          social_accounts: string
        }[]
      }
      get_safe_profile: {
        Args: { profile_id: string }
        Returns: {
          available_days: string[]
          avatar_url: string
          bio: string
          category: string
          city: string
          full_name: string
          id: string
          portfolio_images: string[]
          price_range: string
          services: string
          social_accounts: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
