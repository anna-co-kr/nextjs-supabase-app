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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcement_comments: {
        Row: {
          announcement_id: string
          author_id: string
          body: string
          created_at: string | null
          id: string
        }
        Insert: {
          announcement_id: string
          author_id: string
          body: string
          created_at?: string | null
          id?: string
        }
        Update: {
          announcement_id?: string
          author_id?: string
          body?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_comments_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_reactions: {
        Row: {
          announcement_id: string
          emoji: string
          id: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          emoji: string
          id?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          emoji?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reactions_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          author_id: string
          body: string
          created_at: string | null
          event_id: string
          id: string
          is_pinned: boolean
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string | null
          event_id: string
          id?: string
          is_pinned?: boolean
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string | null
          event_id?: string
          id?: string
          is_pinned?: boolean
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_members: {
        Row: {
          applied_at: string
          confirmed_at: string | null
          event_id: string
          id: string
          note: string | null
          rejected_at: string | null
          status: Database["public"]["Enums"]["member_status_enum"]
          user_id: string
        }
        Insert: {
          applied_at?: string
          confirmed_at?: string | null
          event_id: string
          id?: string
          note?: string | null
          rejected_at?: string | null
          status?: Database["public"]["Enums"]["member_status_enum"]
          user_id: string
        }
        Update: {
          applied_at?: string
          confirmed_at?: string | null
          event_id?: string
          id?: string
          note?: string | null
          rejected_at?: string | null
          status?: Database["public"]["Enums"]["member_status_enum"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_members_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          approval_type: Database["public"]["Enums"]["approval_type_enum"]
          created_at: string | null
          description: string | null
          ends_at: string | null
          event_type: Database["public"]["Enums"]["event_type_enum"]
          host_id: string
          id: string
          location: string | null
          max_participants: number
          registration_deadline: string | null
          share_token: string
          starts_at: string
          status: Database["public"]["Enums"]["event_status_enum"]
          title: string
          updated_at: string | null
        }
        Insert: {
          approval_type?: Database["public"]["Enums"]["approval_type_enum"]
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type_enum"]
          host_id: string
          id?: string
          location?: string | null
          max_participants: number
          registration_deadline?: string | null
          share_token?: string
          starts_at: string
          status?: Database["public"]["Enums"]["event_status_enum"]
          title: string
          updated_at?: string | null
        }
        Update: {
          approval_type?: Database["public"]["Enums"]["approval_type_enum"]
          created_at?: string | null
          description?: string | null
          ends_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type_enum"]
          host_id?: string
          id?: string
          location?: string | null
          max_participants?: number
          registration_deadline?: string | null
          share_token?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["event_status_enum"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      host_bank_accounts: {
        Row: {
          account_holder: string
          account_number: string
          bank_name: string
          event_id: string
          host_id: string
          id: string
        }
        Insert: {
          account_holder: string
          account_number: string
          bank_name: string
          event_id: string
          host_id: string
          id?: string
        }
        Update: {
          account_holder?: string
          account_number?: string
          bank_name?: string
          event_id?: string
          host_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "host_bank_accounts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reminder_logs: {
        Row: {
          event_id: string
          id: string
          reminder_type: string
          sent_at: string
          sent_date: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          reminder_type: string
          sent_at?: string
          sent_date?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          reminder_type?: string
          sent_at?: string
          sent_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      settlement_items: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          name: string
          split_type: Database["public"]["Enums"]["split_type_enum"]
          total_amount: number
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          name: string
          split_type?: Database["public"]["Enums"]["split_type_enum"]
          total_amount: number
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          name?: string
          split_type?: Database["public"]["Enums"]["split_type_enum"]
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "settlement_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      settlement_payments: {
        Row: {
          amount: number
          event_member_id: string
          id: string
          is_paid: boolean
          paid_at: string | null
          ratio: number | null
          settlement_item_id: string
        }
        Insert: {
          amount?: number
          event_member_id: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          ratio?: number | null
          settlement_item_id: string
        }
        Update: {
          amount?: number
          event_member_id?: string
          id?: string
          is_paid?: boolean
          paid_at?: string | null
          ratio?: number | null
          settlement_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlement_payments_event_member_id_fkey"
            columns: ["event_member_id"]
            isOneToOne: false
            referencedRelation: "event_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settlement_payments_settlement_item_id_fkey"
            columns: ["settlement_item_id"]
            isOneToOne: false
            referencedRelation: "settlement_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      promote_next_waitlist: {
        Args: { p_event_id: string }
        Returns: undefined
      }
    }
    Enums: {
      approval_type_enum: "auto" | "manual"
      event_status_enum: "draft" | "open" | "closed" | "cancelled"
      event_type_enum: "one_time" | "recurring"
      member_status_enum: "confirmed" | "waiting" | "rejected"
      split_type_enum: "equal" | "individual" | "ratio"
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

// ---------------------------------------------------------------
// 편의 타입 (자주 사용하는 테이블의 Row/Insert/Update 별칭)
// ---------------------------------------------------------------

/** profiles 테이블 Row 타입 */
export type Profile = Tables<"profiles">
/** profiles 테이블 Insert 타입 */
export type ProfileInsert = TablesInsert<"profiles">
/** profiles 테이블 Update 타입 */
export type ProfileUpdate = TablesUpdate<"profiles">

/** events 테이블 Row 타입 */
export type EventRow = Tables<"events">
/** events 테이블 Insert 타입 */
export type EventInsert = TablesInsert<"events">
/** events 테이블 Update 타입 */
export type EventUpdate = TablesUpdate<"events">

/** event_members 테이블 Row 타입 */
export type EventMemberRow = Tables<"event_members">

export const Constants = {
  public: {
    Enums: {
      approval_type_enum: ["auto", "manual"],
      event_status_enum: ["draft", "open", "closed", "cancelled"],
      event_type_enum: ["one_time", "recurring"],
      member_status_enum: ["confirmed", "waiting", "rejected"],
      split_type_enum: ["equal", "individual", "ratio"],
    },
  },
} as const
