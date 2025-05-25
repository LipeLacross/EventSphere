export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const loading = ref(false)

  async function fetchEvents() {
    loading.value = true
    try {
      const { data } = await useFetch('/api/events')
      events.value = data.value
    } finally {
      loading.value = false
    }
  }

  return { events, loading, fetchEvents }
})
