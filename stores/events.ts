import { defineStore } from 'pinia'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const loading = ref(false)

  async function fetchEvents() {
    loading.value = true
    try {
      const { data } = await useFetch('/api/events')
      events.value = data.value || []
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
      events.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    events: readonly(events),
    loading: readonly(loading),
    fetchEvents
  }
})
