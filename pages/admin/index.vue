<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Administração de Eventos</h1>
    <UButton color="primary" @click="showForm = true">Novo Evento</UButton>
    <EventForm v-if="showForm" @close="showForm = false" @saved="fetchEvents" />
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <EventCard v-for="event in events" :key="event.id" :event="event">
        <template #footer>
          <UButton color="warning" @click="editEvent(event)">Editar</UButton>
          <UButton color="red" @click="deleteEvent(event.id)">Remover</UButton>
        </template>
      </EventCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EventCard from '~/components/events/EventCard.vue'
import EventForm from '~/components/events/EventForm.vue'

const events = ref([])
const showForm = ref(false)
const fetchEvents = async () => {
  events.value = await $fetch('/api/events')
}
onMounted(fetchEvents)

const editEvent = (event) => {
  // lógica para editar (pode abrir o formulário preenchido)
}
const deleteEvent = async (id) => {
  await $fetch(`/api/events/${id}`, { method: 'DELETE' })
  fetchEvents()
}
</script>
