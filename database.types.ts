export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: number
          title: string
          date: string
          location: string
          description: string | null
          category: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: never
          title: string
          date: string
          location: string
          description?: string | null
          category?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: never
          title?: string
          date?: string
          location?: string
          description?: string | null
          category?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: number
          event_id: number
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: never
          event_id: number
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: never
          event_id?: number
          name?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}
