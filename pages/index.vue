<template>
  <div class="container mx-auto py-8">
    <h1 class="text-3xl font-bold mb-6">Bem-vindo ao Site de Eventos!</h1>
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Próximos Eventos</h2>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <EventCard v-for="event in events" :key="event.id" :event="event" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EventCard from '~/components/events/EventCard.vue'

const events = ref([])

onMounted(async () => {
  const res = await $fetch('/api/events')
  events.value = res
})
</script>
