// Tipos para Eventos
export interface Event {
  id: number
  title: string
  date: string
  location: string
  description?: string
  category?: string
  image_url?: string
  created_at?: string
}

// Tipos para Inscrições
export interface Registration {
  id: number
  event_id: number
  name: string
  email: string
  created_at: string
}

export interface RegistrationWithEvent extends Registration {
  eventTitle: string
  events?: {
    title: string
    date: string
    location: string
  }
}

// Tipos para Formulários
export interface EventFormData extends Omit<Event, 'id' | 'created_at'> {
  image?: File | null
}

export interface RegistrationFormData extends Omit<Registration, 'id' | 'created_at'> {}

// Tipos para API
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Tipos para componentes de mapa
export interface MapLocation {
  coordinates: [number, number]
  address: string
}

// Tipos para calendário
export interface CalendarEvent {
  id: number
  title: string
  date: string
  location: string
}
