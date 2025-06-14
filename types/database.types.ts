export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: number
          user_id: string
        }
        Insert: {
          id?: number
          user_id: string
        }
        Update: {
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      answers: {
        Row: {
          answer_text: string | null
          choice_id: number | null
          flagged: boolean | null
          id: string
          question_id: number
          team_id: string
          test_session_id: string | null
          timestamp: string
        }
        Insert: {
          answer_text?: string | null
          choice_id?: number | null
          flagged?: boolean | null
          id: string
          question_id: number
          team_id: string
          test_session_id?: string | null
          timestamp: string
        }
        Update: {
          answer_text?: string | null
          choice_id?: number | null
          flagged?: boolean | null
          id?: string
          question_id?: number
          team_id?: string
          test_session_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "choices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answers_test_session_id_fkey"
            columns: ["test_session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      choices: {
        Row: {
          choice_mdx: string | null
          choice_text: string
          id: number
          question_id: number
        }
        Insert: {
          choice_mdx?: string | null
          choice_text: string
          id?: number
          question_id: number
        }
        Update: {
          choice_mdx?: string | null
          choice_text?: string
          id?: number
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      correction_table: {
        Row: {
          answer_text: string | null
          choice_id: number | null
          id: number
          question_id: number | null
          question_score: number | null
          score: number | null
        }
        Insert: {
          answer_text?: string | null
          choice_id?: number | null
          id?: number
          question_id?: number | null
          question_score?: number | null
          score?: number | null
        }
        Update: {
          answer_text?: string | null
          choice_id?: number | null
          id?: number
          question_id?: number | null
          question_score?: number | null
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "correction_table_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "choices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "correction_table_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      debug_logs: {
        Row: {
          created_at: string | null
          data: Json | null
          id: number
          message: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: number
          message?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: number
          message?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debug_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      finishes: {
        Row: {
          created_at: string
          id: number
          session_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          session_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finishes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      flags: {
        Row: {
          id: string
          team_id: string
        }
        Insert: {
          id: string
          team_id: string
        }
        Update: {
          id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flags_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          display: string | null
          email: string | null
          hashed_password: string | null
          id: string
          salt: string | null
          team_id: string
        }
        Insert: {
          display?: string | null
          email?: string | null
          hashed_password?: string | null
          id: string
          salt?: string | null
          team_id: string
        }
        Update: {
          display?: string | null
          email?: string | null
          hashed_password?: string | null
          id?: string
          salt?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          has_choices: boolean
          id: number
          minus: number | null
          next_question_id: number | null
          points: number | null
          question_mdx: string | null
          question_text: string
          question_type: Database["public"]["Enums"]["questiontype"]
          test_id: number
          validation_pattern: string | null
        }
        Insert: {
          has_choices?: boolean
          id?: number
          minus?: number | null
          next_question_id?: number | null
          points?: number | null
          question_mdx?: string | null
          question_text: string
          question_type: Database["public"]["Enums"]["questiontype"]
          test_id: number
          validation_pattern?: string | null
        }
        Update: {
          has_choices?: boolean
          id?: number
          minus?: number | null
          next_question_id?: number | null
          points?: number | null
          question_mdx?: string | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["questiontype"]
          test_id?: number
          validation_pattern?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_next_question_id_fkey"
            columns: ["next_question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          created_at: string
          id: string
          score: number | null
          session_id: string | null
          team_id: string
          test_id: number
        }
        Insert: {
          created_at?: string
          id: string
          score?: number | null
          session_id?: string | null
          team_id: string
          test_id: number
        }
        Update: {
          created_at?: string
          id?: string
          score?: number | null
          session_id?: string | null
          team_id?: string
          test_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "scores_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      test_sessions: {
        Row: {
          answers: Json | null
          created_at: string
          end_time: string | null
          id: string
          start_time: string | null
          status: Database["public"]["Enums"]["sessionstatus"] | null
          team_id: string
          test_id: number | null
        }
        Insert: {
          answers?: Json | null
          created_at?: string
          end_time?: string | null
          id: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["sessionstatus"] | null
          team_id: string
          test_id?: number | null
        }
        Update: {
          answers?: Json | null
          created_at?: string
          end_time?: string | null
          id?: string
          start_time?: string | null
          status?: Database["public"]["Enums"]["sessionstatus"] | null
          team_id?: string
          test_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_sessions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_sessions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number | null
          end_time: string | null
          id: number
          instructions: string | null
          password: string | null
          slug: string | null
          start_time: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          end_time?: string | null
          id?: number
          instructions?: string | null
          password?: string | null
          slug?: string | null
          start_time?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          end_time?: string | null
          id?: number
          instructions?: string | null
          password?: string | null
          slug?: string | null
          start_time?: string | null
          title?: string
        }
        Relationships: []
      }
      unfairness: {
        Row: {
          category: string | null
          created_at: string
          detail: string | null
          id: number
          test_session_id: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          detail?: string | null
          id?: number
          test_session_id?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          detail?: string | null
          id?: number
          test_session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unfairness_test_session_id_fkey"
            columns: ["test_session_id"]
            isOneToOne: false
            referencedRelation: "test_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_info: string | null
          id: string
          ip: string | null
          is_active: boolean | null
          last_seen_at: string | null
          session_token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip?: string | null
          is_active?: boolean | null
          last_seen_at?: string | null
          session_token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_info?: string | null
          id?: string
          ip?: string | null
          is_active?: boolean | null
          last_seen_at?: string | null
          session_token?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_score_on_status_change: {
        Args: {
          session_id: string
        }
        Returns: number
      }
    }
    Enums: {
      questiontype: "multiple-choices" | "multiple-answers" | "short-answer"
      roles: "Student" | "Admin"
      sessionstatus: "not-started" | "ongoing" | "finished"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
