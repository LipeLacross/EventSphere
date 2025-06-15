<template>
  <UCard class="hover:shadow-lg transition">
    <template #header>
      <h3 class="text-lg font-bold">{{ event.title }}</h3>
    </template>
    <p>{{ event.date }} - {{ event.location }}</p>
    <UButton :to="`/events/${event.id}`" color="primary" variant="solid">Detalhes</UButton>
  </UCard>
</template>

<script setup lang="ts">
interface Event {
  id: number
  title: string
  date: string
  location: string
  description?: string
  category?: string
  image_url?: string
}

defineProps<{
  event: Event
}>()

</script>
