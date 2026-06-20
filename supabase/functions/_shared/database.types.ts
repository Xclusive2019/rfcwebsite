export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          company: string | null;
          service: string;
          booking_date: string;
          booking_time: string;
          status: string;
          notes: string | null;
          division: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          company?: string | null;
          service: string;
          booking_date: string;
          booking_time: string;
          status?: string;
          notes?: string | null;
          division?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contacts"]["Insert"]>;
        Relationships: [];
      };
      quiz_submissions: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          company: string | null;
          answers: Record<string, string>;
          score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          company?: string | null;
          answers: Record<string, string>;
          score: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["quiz_submissions"]["Insert"]>;
        Relationships: [];
      };
      chat_conversations: {
        Row: {
          id: string;
          session_id: string;
          messages: unknown;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          messages: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_conversations"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
