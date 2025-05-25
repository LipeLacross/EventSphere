<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Eventos</h1>
    <UCalendar v-model="selectedDate" />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <EventCard v-for="event in filteredEvents" :key="event.id" :event="event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import EventCard from '~/components/events/EventCard.vue'

const events = ref([])
const selectedDate = ref(null)

onMounted(async () => {
  const res = await $fetch('/api/events')
  events.value = res
})

const filteredEvents = computed(() => {
  if (!selectedDate.value) return events.value
  return events.value.filter(event => event.date === selectedDate.value)
})
</script>
