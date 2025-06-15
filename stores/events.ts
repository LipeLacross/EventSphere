import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'

// Definir interfaces TypeScript
interface Event {
  id: number
  title: string
  date: string
  location: string
  description?: string
  category?: string
  image_url?: string
  created_at?: string
}

interface EventsState {
  events: Event[]
  loading: boolean
  error: string | null
}

export const useEventsStore = defineStore('events', () => {
  // Estado reativo com tipagem
  const events = ref<Event[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Ações
  async function fetchEvents(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const { data } = await useFetch<Event[]>('/api/events')
      events.value = data.value || []
    } catch (err) {
      console.error('Erro ao carregar eventos:', err)
      error.value = 'Erro ao carregar eventos. Tente novamente.'
      events.value = []
    } finally {
      loading.value = false
    }
  }

  async function createEvent(eventData: Omit<Event, 'id' | 'created_at'>): Promise<Event | null> {
    try {
      const data = await $fetch<Event>('/api/events', {
        method: 'POST',
        body: eventData
      })

      // Adicionar o novo evento à lista
      events.value.push(data)
      return data
    } catch (err) {
      console.error('Erro ao criar evento:', err)
      error.value = 'Erro ao criar evento'
      return null
    }
  }

  async function updateEvent(id: number, eventData: Partial<Event>): Promise<Event | null> {
    try {
      const data = await $fetch<Event>(`/api/events/${id}`, {
        method: 'PUT',
        body: eventData
      })

      // Atualizar o evento na lista
      const index = events.value.findIndex(event => event.id === id)
      if (index !== -1) {
        events.value[index] = data
      }

      return data
    } catch (err) {
      console.error('Erro ao atualizar evento:', err)
      error.value = 'Erro ao atualizar evento'
      return null
    }
  }

  async function deleteEvent(id: number): Promise<boolean> {
    try {
      await $fetch(`/api/events/${id}`, {
        method: 'DELETE'
      })

      // Remover o evento da lista
      events.value = events.value.filter(event => event.id !== id)
      return true
    } catch (err) {
      console.error('Erro ao deletar evento:', err)
      error.value = 'Erro ao deletar evento'
      return false
    }
  }

  // Getters computados
  const upcomingEvents = computed(() => {
    const now = new Date()
    return events.value.filter(event => new Date(event.date) > now)
  })

  const pastEvents = computed(() => {
    const now = new Date()
    return events.value.filter(event => new Date(event.date) <= now)
  })

  const eventsByCategory = computed(() => {
    return events.value.reduce((acc, event) => {
      const category = event.category || 'Outros'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(event)
      return acc
    }, {} as Record<string, Event[]>)
  })

  // Limpar erro
  function clearError(): void {
    error.value = null
  }

  return {
    // Estado readonly
    events: readonly(events),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    upcomingEvents,
    pastEvents,
    eventsByCategory,

    // Ações
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError
  }
})
