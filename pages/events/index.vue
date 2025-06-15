<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="max-w-7xl mx-auto py-8 px-4">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Descubra Eventos Incríveis
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Encontre os melhores eventos próximos a você e participe de experiências únicas
        </p>
      </div>

      <!-- Filtros Aprimorados -->
      <UCard class="mb-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Encontre Seu Evento Perfeito
            </h2>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Barra de Pesquisa Principal -->
          <div class="relative">
            <UInput
              v-model="searchTerm"
              placeholder="Pesquisar por nome, local ou descrição..."
              icon="i-heroicons-magnifying-glass"
              size="xl"
              class="w-full"
              :ui="{ icon: { leading: { wrapper: 'pl-4' } } }"
            />
          </div>

          <!-- Filtros em Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <USelect
              v-model="category"
              :options="categoryOptions"
              placeholder="Todas as categorias"
              icon="i-heroicons-tag"
              size="lg"
            />
            <UInput
              v-model="location"
              placeholder="Localização"
              icon="i-heroicons-map-pin"
              size="lg"
            />
            <UInput
              v-model="selectedDate"
              type="date"
              placeholder="Data do evento"
              icon="i-heroicons-calendar"
              size="lg"
            />
            <USelect
              v-model="sortBy"
              :options="sortOptions"
              placeholder="Ordenar por"
              icon="i-heroicons-bars-arrow-down"
              size="lg"
            />
          </div>

          <!-- Tags de Filtros Rápidos -->
          <div class="flex flex-wrap gap-2">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Filtros rápidos:</span>
            <UButton
              v-for="quickFilter in quickFilters"
              :key="quickFilter.value"
              :variant="category === quickFilter.value ? 'solid' : 'soft'"
              color="primary"
              size="xs"
              @click="toggleQuickFilter(quickFilter.value)"
            >
              {{ quickFilter.label }}
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <UCard class="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Total de Eventos</p>
              <p class="text-3xl font-bold">{{ events.length }}</p>
            </div>
            <UIcon name="i-heroicons-calendar-days" class="w-10 h-10 text-blue-200" />
          </div>
        </UCard>

        <UCard class="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium">Eventos Encontrados</p>
              <p class="text-3xl font-bold">{{ filteredEvents.length }}</p>
            </div>
            <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 text-green-200" />
          </div>
        </UCard>

        <UCard class="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Próximos 7 Dias</p>
              <p class="text-3xl font-bold">{{ upcomingWeekEvents.length }}</p>
            </div>
            <UIcon name="i-heroicons-clock" class="w-10 h-10 text-purple-200" />
          </div>
        </UCard>
      </div>

      <!-- Estados de Loading e Erro -->
      <UCard v-if="loading" class="shadow-xl border-0">
        <div class="flex flex-col items-center justify-center py-20 space-y-6">
          <div class="relative">
            <div class="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <UIcon name="i-heroicons-calendar-days" class="w-8 h-8 text-primary-600 absolute inset-0 m-auto" />
          </div>
          <div class="text-center space-y-2">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Carregando eventos...</h3>
            <p class="text-gray-500">Buscando os melhores eventos para você</p>
          </div>
        </div>
      </UCard>

      <UCard v-else-if="error" class="shadow-xl border-0 border-l-4 border-l-red-500">
        <div class="py-12 text-center space-y-4">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <UAlert
            color="error"
            variant="soft"
            title="Erro ao carregar eventos"
            :description="error"
          />
          <UButton
            color="error"
            variant="outline"
            @click="fetchEvents"
            icon="i-heroicons-arrow-path"
            size="lg"
          >
            Tentar Novamente
          </UButton>
        </div>
      </UCard>

      <!-- Estado Vazio -->
      <UCard v-else-if="filteredEvents.length === 0" class="shadow-xl border-0">
        <div class="text-center py-20 space-y-6">
          <div class="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
            <UIcon
              :name="events.length === 0 ? 'i-heroicons-calendar-x' : 'i-heroicons-magnifying-glass-minus'"
              class="w-16 h-16 text-gray-400"
            />
          </div>
          <div class="space-y-3">
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {{ events.length === 0 ? 'Nenhum evento disponível' : 'Nenhum evento encontrado' }}
            </h3>
            <p class="text-gray-500 max-w-md mx-auto text-lg">
              {{ events.length === 0
                ? 'Não há eventos cadastrados no momento. Volte em breve!'
                : 'Tente ajustar os filtros para encontrar eventos que correspondam aos seus interesses.'
              }}
            </p>
          </div>
          <div v-if="hasActiveFilters" class="space-y-4">
            <UButton
              color="primary"
              variant="outline"
              @click="clearAllFilters"
              icon="i-heroicons-x-mark"
              size="lg"
            >
              Limpar Filtros
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Lista de Eventos -->
      <div v-else class="space-y-8">
        <!-- Cabeçalho da Lista -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="space-y-1">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ filteredEvents.length }} Eventos Encontrados
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              {{ hasActiveFilters ? 'Resultados filtrados' : 'Todos os próximos eventos' }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <USelect
              v-model="viewMode"
              :options="viewModeOptions"
              size="sm"
            >
              <template #leading>
                <UIcon :name="viewMode === 'grid' ? 'i-heroicons-squares-2x2' : 'i-heroicons-list-bullet'" class="w-4 h-4" />
              </template>
            </USelect>

            <span class="text-sm text-gray-500">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
          </div>
        </div>

        <!-- Grid/Lista de Eventos -->
        <div
          :class="[
            'transition-all duration-300',
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
          ]"
        >
          <TransitionGroup
            :name="viewMode === 'grid' ? 'grid' : 'list'"
            tag="div"
            :class="viewMode === 'grid' ? 'contents' : 'space-y-4'"
          >
            <UCard
              v-for="event in paginatedEvents"
              :key="event.id"
              :class="[
                'group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 overflow-hidden cursor-pointer',
                viewMode === 'grid' ? 'h-full' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
              @click="navigateToEvent(event.id)"
            >
              <template #header>
                <div :class="viewMode === 'grid' ? 'space-y-3' : 'flex items-start gap-4'">
                  <!-- Imagem do Evento -->
                  <div
                    v-if="event.image_url"
                    :class="[
                      'rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700',
                      viewMode === 'grid' ? 'w-full h-48' : 'w-24 h-24 flex-shrink-0'
                    ]"
                  >
                    <NuxtImg
                      :src="event.image_url"
                      :alt="event.title"
                      :class="[
                        'object-cover group-hover:scale-105 transition-transform duration-300',
                        viewMode === 'grid' ? 'w-full h-full' : 'w-24 h-24'
                      ]"
                    />
                  </div>

                  <!-- Conteúdo do Evento -->
                  <div :class="viewMode === 'grid' ? 'space-y-3' : 'flex-1 min-w-0'">
                    <div class="flex items-start justify-between gap-3">
                      <h3 :class="[
                        'font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors',
                        viewMode === 'grid' ? 'text-xl line-clamp-2' : 'text-lg truncate'
                      ]">
                        {{ event.title }}
                      </h3>

                      <div class="flex items-center gap-2 flex-shrink-0">
                        <UBadge
                          :color="getDaysUntilEvent(event.date) <= 7 ? 'orange' : 'green'"
                          variant="soft"
                          size="xs"
                        >
                          {{ getDaysUntilEvent(event.date) === 0 ? 'Hoje' :
                             getDaysUntilEvent(event.date) === 1 ? 'Amanhã' :
                             `${getDaysUntilEvent(event.date)} dias` }}
                        </UBadge>

                        <UBadge v-if="event.category" color="primary" variant="soft" size="xs">
                          {{ event.category }}
                        </UBadge>
                      </div>
                    </div>

                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <span class="font-medium">{{ formatDate(event.date) }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <span :class="viewMode === 'grid' ? 'line-clamp-1' : 'truncate'">{{ event.location }}</span>
                      </div>
                    </div>

                    <div v-if="event.description && viewMode === 'grid'" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {{ event.description }}
                    </div>
                  </div>
                </div>
              </template>

              <template v-if="viewMode === 'grid'" #footer>
                <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <UIcon name="i-heroicons-clock" class="w-3 h-3" />
                    <span>Criado {{ formatRelativeDate(event.created_at) }}</span>
                  </div>

                  <UButton
                    color="primary"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-arrow-right"
                  >
                    Ver Detalhes
                  </UButton>
                </div>
              </template>
            </UCard>
          </TransitionGroup>
        </div>

        <!-- Paginação -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12">
          <UPagination
            v-model="currentPage"
            :page-count="itemsPerPage"
            :total="filteredEvents.length"
            size="lg"
            :max="5"
            :ui="{
              wrapper: 'flex items-center gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700',
              base: 'min-w-0 flex justify-center items-center'
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types'

// Configuração SEO
useSeoMeta({
  title: 'Eventos - EventSphere',
  description: 'Descubra e participe dos melhores eventos próximos a você no EventSphere'
})

const supabase = useSupabaseClient()
const router = useRouter()

// Estados reativos
const events = ref<Event[]>([])
const searchTerm = ref('')
const category = ref('')
const location = ref('')
const selectedDate = ref('')
const sortBy = ref('date')
const viewMode = ref('grid')
const loading = ref(true)
const error = ref<string | null>(null)

// Paginação
const currentPage = ref(1)
const itemsPerPage = 12

// Opções
const quickFilters = [
  { label: 'Tecnologia', value: 'Tecnologia' },
  { label: 'Música', value: 'Música' },
  { label: 'Esporte', value: 'Esporte' },
  { label: 'Arte', value: 'Arte' },
  { label: 'Negócios', value: 'Negócios' }
]

const sortOptions = [
  { label: 'Data (Mais próximos)', value: 'date' },
  { label: 'Nome (A-Z)', value: 'name' },
  { label: 'Localização', value: 'location' },
  { label: 'Categoria', value: 'category' }
]

const viewModeOptions = [
  { label: 'Grade', value: 'grid' },
  { label: 'Lista', value: 'list' }
]

// Computed properties
const categoryOptions = computed(() => {
  const categories = [...new Set(events.value.map(e => e.category).filter(Boolean))]
  return [
    { label: 'Todas as categorias', value: '' },
    ...categories.map(cat => ({ label: cat, value: cat }))
  ]
})

const filteredEvents = computed(() => {
  let filtered = events.value

  // Filtrar apenas eventos futuros
  const now = new Date()
  filtered = filtered.filter(event => new Date(event.date) > now)

  // Filtro por termo de pesquisa
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term) ||
      event.description?.toLowerCase().includes(term)
    )
  }

  // Filtros específicos
  if (category.value) {
    filtered = filtered.filter(event => event.category === category.value)
  }

  if (location.value) {
    filtered = filtered.filter(event =>
      event.location.toLowerCase().includes(location.value.toLowerCase())
    )
  }

  if (selectedDate.value) {
    filtered = filtered.filter(event => event.date === selectedDate.value)
  }

  // Ordenação
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.title.localeCompare(b.title)
      case 'location':
        return a.location.localeCompare(b.location)
      case 'category':
        return (a.category || '').localeCompare(b.category || '')
      default:
        return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  })

  return filtered
})

const upcomingWeekEvents = computed(() => {
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  return events.value.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate > new Date() && eventDate <= nextWeek
  })
})

const hasActiveFilters = computed(() => {
  return !!(searchTerm.value || category.value || location.value || selectedDate.value)
})

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage))

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEvents.value.slice(start, start + itemsPerPage)
})

// Métodos
const fetchEvents = async () => {
  try {
    loading.value = true
    error.value = null

    const { data, error: sbError } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (sbError) throw sbError
    events.value = data || []
  } catch (err) {
    console.error('Erro ao carregar eventos:', err)
    error.value = (err instanceof Error) ? err.message : 'Erro ao buscar eventos'
    events.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatRelativeDate = (dateString: string | undefined) => {
  if (!dateString) return 'recentemente'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'ontem'
  if (diffDays < 7) return `há ${diffDays} dias`
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`
  return `há ${Math.floor(diffDays / 30)} meses`
}

const getDaysUntilEvent = (dateString: string) => {
  const eventDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDate.setHours(0, 0, 0, 0)

  const diffTime = eventDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const toggleQuickFilter = (filterValue: string) => {
  category.value = category.value === filterValue ? '' : filterValue
}

const clearAllFilters = () => {
  searchTerm.value = ''
  category.value = ''
  location.value = ''
  selectedDate.value = ''
  currentPage.value = 1
}

const navigateToEvent = (eventId: number) => {
  router.push(`/events/${eventId}`)
}

// Watchers
watch([searchTerm, category, location, selectedDate, sortBy], () => {
  currentPage.value = 1
})

onMounted(fetchEvents)
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.grid-enter-active,
.grid-leave-active,
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
