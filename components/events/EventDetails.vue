<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Card Principal do Evento -->
    <UCard class="shadow-xl border-0 overflow-hidden bg-white dark:bg-gray-800">
      <template #header>
        <div class="space-y-4">
          <!-- Cabeçalho com Título e Status -->
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div class="flex-1">
              <h1 class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                {{ event.title }}
              </h1>
              <div class="flex items-center gap-3 mt-3">
                <UBadge
                  :color="getEventStatus(event.date) === 'upcoming' ? 'success' : 'neutral'"
                  variant="soft"
                  size="md"
                >
                  {{ getEventStatus(event.date) === 'upcoming' ? 'Evento Próximo' : 'Evento Finalizado' }}
                </UBadge>
                <UBadge
                  v-if="event.category"
                  color="primary"
                  variant="soft"
                  size="md"
                >
                  {{ event.category }}
                </UBadge>
              </div>
            </div>

            <!-- Botões de Ação -->
            <div class="flex flex-col sm:flex-row gap-3">
              <UButton
                v-if="getEventStatus(event.date) === 'upcoming'"
                color="primary"
                size="lg"
                icon="i-heroicons-user-plus"
                @click="scrollToRegistration"
                class="shadow-md hover:shadow-lg transition-shadow"
              >
                Inscrever-se
              </UButton>
              <UButton
                color="gray"
                variant="outline"
                size="lg"
                icon="i-heroicons-share"
                @click="shareEvent"
              >
                Compartilhar
              </UButton>
            </div>
          </div>

          <!-- Imagem do Evento -->
          <div v-if="event.image_url" class="relative h-64 lg:h-80 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
            <NuxtImg
              :src="event.image_url"
              :alt="event.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </template>

      <!-- Informações Principais -->
      <div class="space-y-8">
        <!-- Detalhes Rápidos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Data e Horário -->
          <div class="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-calendar-days" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="space-y-1">
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">Data & Horário</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(event.date) }}</p>
              <p v-if="getEventTime(event.date)" class="text-sm font-medium text-blue-600 dark:text-blue-400">
                {{ getEventTime(event.date) }}
              </p>
            </div>
          </div>

          <!-- Localização -->
          <div class="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="space-y-1">
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">Localização</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ event.location }}</p>
              <UButton
                color="success"
                variant="ghost"
                size="xs"
                icon="i-heroicons-map"
                @click="openInMaps"
              >
                Ver no Mapa
              </UButton>
            </div>
          </div>

          <!-- Duração/Status -->
          <div class="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-clock" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="space-y-1">
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">Status</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ getEventStatus(event.date) === 'upcoming' ? 'Proximamente' : 'Finalizado' }}
              </p>
              <p v-if="getEventStatus(event.date) === 'upcoming'" class="text-sm font-medium text-purple-600 dark:text-purple-400">
                {{ getDaysUntilEvent(event.date) }} dias restantes
              </p>
            </div>
          </div>
        </div>

        <!-- Descrição do Evento -->
        <div v-if="event.description" class="space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-500" />
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Sobre o Evento</h3>
          </div>
          <div class="prose prose-gray dark:prose-invert max-w-none">
            <div class="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {{ event.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Informações Adicionais -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Organizador (Placeholder) -->
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <UIcon name="i-heroicons-user-group" class="w-5 h-5 text-primary-500" />
              Organização
            </h3>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Organizado pela equipe EventSphere
              </p>
            </div>
          </div>

          <!-- Contato (Placeholder) -->
          <div class="space-y-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-primary-500" />
              Contato
            </h3>
            <div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                contato@eventsphere.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Mapa do Local -->
    <UCard class="shadow-xl border-0 bg-white dark:bg-gray-800">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-map" class="w-5 h-5 text-primary-500" />
            Localização do Evento
          </h3>
          <UButton
            color="primary"
            variant="outline"
            size="sm"
            icon="i-heroicons-arrow-top-right-on-square"
            @click="openInMaps"
          >
            Abrir no Maps
          </UButton>
        </div>
      </template>

      <div class="h-96 rounded-lg overflow-hidden">
        <Map
          :location="event.location"
          :show-directions="true"
          class="w-full h-full"
        />
      </div>
    </UCard>

    <!-- Seção de Inscrição -->
    <div v-if="getEventStatus(event.date) === 'upcoming'" id="registration" class="scroll-mt-8">
      <RegistrationForm :event-id="event.id" />
    </div>

    <!-- Eventos Relacionados (Placeholder) -->
    <UCard class="shadow-xl border-0 bg-white dark:bg-gray-800">
      <template #header>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-primary-500" />
          Outros Eventos
        </h3>
      </template>

      <div class="text-center py-8">
        <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400">
          Explore outros eventos disponíveis
        </p>
        <UButton
          to="/events"
          color="primary"
          variant="outline"
          class="mt-4"
          icon="i-heroicons-arrow-right"
        >
          Ver Todos os Eventos
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types'

// Definir interface das props
interface Props {
  event: Event
}

const props = defineProps<Props>()

// Funções utilitárias
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getEventTime = (dateString: string) => {
  if (dateString.includes('T')) {
    const date = new Date(dateString)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return null
}

const getEventStatus = (dateString: string) => {
  const eventDate = new Date(dateString)
  const now = new Date()
  return eventDate > now ? 'upcoming' : 'past'
}

const getDaysUntilEvent = (dateString: string) => {
  const eventDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)

  const diffTime = eventDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Amanhã'
  return diffDays.toString()
}

const openInMaps = () => {
  const query = encodeURIComponent(props.event.location)
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`
  window.open(url, '_blank')
}

const shareEvent = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.event.title,
        text: `Confira este evento: ${props.event.title}`,
        url: window.location.href
      })
    } catch (error) {
      console.log('Erro ao compartilhar:', error)
    }
  } else {
    // Fallback: copiar link para área de transferência
    await navigator.clipboard.writeText(window.location.href)
    // Aqui você pode adicionar um toast notification
  }
}

const scrollToRegistration = () => {
  const element = document.getElementById('registration')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Meta da página
useSeoMeta({
  title: () => `${props.event.title} - EventSphere`,
  description: () => props.event.description || `Participe do evento ${props.event.title} em ${props.event.location}`,
  ogTitle: () => props.event.title,
  ogDescription: () => props.event.description || `Evento em ${props.event.location}`,
  ogImage: () => props.event.image_url || '/default-event.jpg'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose {
  max-width: none;
}
</style>
