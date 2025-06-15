<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div v-if="pending" class="text-center space-y-4">
      <UProgress animation="carousel" class="w-40 mx-auto" />
      <p class="text-gray-500">Carregando detalhes do evento...</p>
    </div>

    <div v-else-if="error" class="text-center space-y-4">
      <UAlert
        color="error"
        icon="i-heroicons-exclamation-triangle"
        title="Evento não encontrado"
        description="O evento solicitado não existe ou foi removido"
      />
      <UButton to="/events" label="Voltar para eventos" />
    </div>

    <div v-else-if="event" class="space-y-8">
      <UCard class="shadow-lg">
        <template #header>
          <h1 class="text-3xl font-bold text-primary-700 dark:text-primary-300">
            {{ event.title }}
          </h1>
        </template>

        <div class="prose dark:prose-invert max-w-none">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
                <span>{{ formatDate(event.date) }}</span>
              </p>
              <p class="flex items-center gap-2 mt-2">
                <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
                <span>{{ event.location }}</span>
              </p>
              <p v-if="event.category" class="mt-4">
                <UBadge color="primary">{{ event.category }}</UBadge>
              </p>
            </div>

            <div v-if="event.image_url" class="relative h-64 rounded-lg overflow-hidden">
              <NuxtImg
                :src="event.image_url"
                :alt="event.title"
                class="object-cover w-full h-full"
              />
            </div>
          </div>

          <div class="mt-6" v-html="event.description"></div>
        </div>
      </UCard>

      <div class="h-96">
        <Map :location="event.location" />
      </div>

      <RegistrationForm :event-id="event.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types'

const route = useRoute()
const { id } = route.params

const { data: event, pending, error } = await useLazyFetch<Event>(`/api/events/${id}`, {
  server: false
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
