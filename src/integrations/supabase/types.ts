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
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          birth_day: number
          birth_month: number
          birth_year: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          birth_day: number
          birth_month: number
          birth_year: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          birth_day?: number
          birth_month?: number
          birth_year?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      analyses: {
        Row: {
          id: string
          user_id: string
          method_id: string
          methodology: string
          tier: string
          result_type: string
          input: Json
          result: Json
          title: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          method_id: string
          methodology: string
          tier: string
          result_type: string
          input: Json
          result: Json
          title?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          method_id?: string
          methodology?: string
          tier?: string
          result_type?: string
          input?: Json
          result?: Json
          title?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
