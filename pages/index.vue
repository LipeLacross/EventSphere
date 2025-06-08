<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EventCard from '~/components/events/EventCard.vue'

const events = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await $fetch('/api/events')
    events.value = res
  } catch (err) {
    console.error('Erro ao carregar eventos:', err)
    error.value = 'Erro ao carregar eventos'
    // Fallback para teste
    events.value = [
      {
        id: 1,
        title: "Evento de Teste",
        date: "2025-06-15",
        location: "São Paulo, SP",
        description: "Evento de exemplo"
      }
    ]
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
    <div class="container mx-auto py-12 flex-1">
      <UCard class="shadow-lg p-8">
        <template #header>
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 class="text-3xl font-bold text-primary-700 dark:text-primary-300">Bem-vindo ao Site de Eventos!</h1>
            <!-- Exemplo: botão para criar evento futuro -->
            <!-- <UButton color="primary" variant="solid">Criar Evento</UButton> -->
          </div>
        </template>

        <div v-if="loading" class="flex flex-col items-center justify-center py-16">
          <UProgress animation="carousel" class="w-40" />
          <p class="mt-4 text-gray-500">Carregando eventos...</p>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center py-16">
          <UAlert color="red" :title="error" />
        </div>

        <div v-else>
          <h2 class="text-xl font-semibold mb-6 text-primary-800 dark:text-primary-200">Próximos Eventos</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard v-for="event in events" :key="event.id" :event="event" />
          </div>
          <div v-if="events.length === 0" class="text-center text-gray-400 mt-8">
            Nenhum evento encontrado.
          </div>
        </div>
      </UCard>
    </div>
    <footer class="bg-neutral-100 dark:bg-neutral-900 py-6 mt-auto">
      <div class="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
        © 2025 Site de Eventos
      </div>
    </footer>
  </div>
</template>
