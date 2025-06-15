<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
    <div class="container mx-auto py-12 flex-1">
      <UCard class="shadow-lg p-8">
        <template #header>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 class="text-3xl font-bold text-primary-700 dark:text-primary-300">
              Bem-vindo ao EventSphere!
            </h1>
            <UButton
              to="/events"
              color="primary"
              variant="solid"
              icon="i-heroicons-calendar"
            >
              Ver Todos os Eventos
            </UButton>
          </div>
        </template>

        <div v-if="loading" class="flex flex-col items-center justify-center py-16">
          <UProgress animation="carousel" class="w-40" />
          <p class="mt-4 text-gray-500">Carregando eventos...</p>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
          <UAlert
            color="error"
            :title="error"
            description="Tente recarregar a página ou verifique sua conexão."
          />
        </div>

        <div v-else>
          <h2 class="text-xl font-semibold mb-6 text-primary-800 dark:text-primary-200">
            Próximos Eventos
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard
              v-for="event in events"
              :key="event.id"
              :event="event"
            />
          </div>
          <div v-if="events.length === 0" class="text-center text-gray-400 mt-8">
            <UIcon name="i-heroicons-calendar-x" class="w-16 h-16 mx-auto mb-4" />
            <p>Nenhum evento encontrado.</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EventCard from '~/components/events/EventCard.vue'

// Definir interface TypeScript para Event
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

// Estados reativos com tipagem correta
const events = ref<Event[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

// Função para buscar eventos
const fetchEvents = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null

    const res = await $fetch<Event[]>('/api/events')
    events.value = res || []
  } catch (err) {
    console.error('Erro ao carregar eventos:', err)
    error.value = 'Erro ao carregar eventos'

    // Fallback apenas para desenvolvimento/teste
    if (process.dev) {
      events.value = [
        {
          id: 1,
          title: "Evento de Teste",
          date: "2025-06-15",
          location: "São Paulo, SP",
          description: "Evento de exemplo para testes"
        }
      ]
    }
  } finally {
    loading.value = false
  }
}

// Executar ao montar o componente
onMounted(() => {
  fetchEvents()
})
</script>
