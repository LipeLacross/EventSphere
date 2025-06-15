<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto py-8 px-4">
      <!-- Header Aprimorado -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                  Painel Administrativo
                </h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">
                  Gerencie todos os eventos da plataforma
                </p>
              </div>
            </div>

            <!-- Estatísticas Rápidas -->
            <div class="flex items-center gap-6 mt-4">
              <div class="flex items-center gap-2 text-sm">
                <div class="w-3 h-3 bg-success-500 rounded-full"></div>
                <span class="text-gray-600 dark:text-gray-400">
                  <span class="font-semibold text-success-600">{{ filteredEvents.length }}</span> próximos
                </span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <div class="w-3 h-3 bg-info-500 rounded-full"></div>
                <span class="text-gray-600 dark:text-gray-400">
                  <span class="font-semibold text-info-600">{{ events.length }}</span> total
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <UButton
              color="primary"
              size="lg"
              @click="openCreateForm"
              icon="i-heroicons-plus-circle"
              class="shadow-lg hover:shadow-xl transition-all duration-200"
              :loading="loading"
            >
              Criar Evento
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-heroicons-arrow-path"
              @click="fetchEvents"
              :loading="loading"
              class="hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Atualizar
            </UButton>
          </div>
        </div>
      </div>

      <!-- Filtros Modernos -->
      <UCard class="mb-8 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <UIcon name="i-heroicons-funnel" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Filtros e Pesquisa
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Encontre eventos específicos rapidamente
              </p>
            </div>

            <div class="ml-auto">
              <UButton
                v-if="hasActiveFilters"
                @click="clearAllFilters"
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-heroicons-x-mark"
              >
                Limpar Filtros
              </UButton>
            </div>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Barra de Pesquisa Principal -->
          <div class="relative">
            <UInput
              v-model="searchTerm"
              placeholder="Pesquisar por título, localização ou descrição..."
              icon="i-heroicons-magnifying-glass"
              size="xl"
              class="w-full"
            />
          </div>

          <!-- Filtros em Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <USelect
              v-model="filterCategory"
              :options="categoryOptions"
              placeholder="Filtrar por categoria"
              icon="i-heroicons-tag"
              size="lg"
            />

            <USelect
              v-model="filterStatus"
              :options="statusOptions"
              placeholder="Filtrar por status"
              icon="i-heroicons-clock"
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
        </div>
      </UCard>

      <!-- Modal do Formulário CORRIGIDO -->
      <UModal v-model="isModalOpen" :ui="{ width: 'sm:max-w-4xl' }" prevent-close>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {{ editingEvent ? 'Editar Evento' : 'Criar Novo Evento' }}
              </h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="closeModal"
                size="sm"
              />
            </div>
          </template>

          <EventForm
            :event="editingEvent"
            :loading="formLoading"
            @close="closeModal"
            @saved="handleEventSaved"
          />
        </UCard>
      </UModal>

      <!-- Loading State -->
      <UCard v-if="loading && events.length === 0" class="shadow-lg border-0">
        <div class="flex flex-col items-center justify-center py-20 space-y-6">
          <div class="relative">
            <div class="w-20 h-20 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <UIcon name="i-heroicons-calendar-days" class="w-8 h-8 text-primary-600 absolute inset-0 m-auto" />
          </div>
          <div class="text-center space-y-2">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Carregando eventos...</h3>
            <p class="text-gray-500">Buscando os dados mais recentes</p>
          </div>
        </div>
      </UCard>

      <!-- Error State -->
      <UCard v-else-if="error" class="shadow-lg border-0 border-l-4 border-l-error-500">
        <div class="py-12 text-center space-y-4">
          <div class="w-16 h-16 bg-error-100 dark:bg-error-900/30 rounded-full flex items-center justify-center mx-auto">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-error-600 dark:text-error-400" />
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

      <!-- Empty State -->
      <UCard v-else-if="filteredEvents.length === 0" class="shadow-lg border-0">
        <div class="text-center py-20 space-y-6">
          <div class="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center">
            <UIcon
              :name="events.length === 0 ? 'i-heroicons-calendar-x' : 'i-heroicons-magnifying-glass-minus'"
              class="w-16 h-16 text-gray-400"
            />
          </div>
          <div class="space-y-3">
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {{ events.length === 0 ? 'Nenhum evento cadastrado' : 'Nenhum evento encontrado' }}
            </h3>
            <p class="text-gray-500 max-w-md mx-auto text-lg">
              {{ events.length === 0
                ? 'Comece criando seu primeiro evento para aparecer aqui.'
                : 'Tente ajustar os filtros para encontrar os eventos desejados.'
              }}
            </p>
          </div>
          <div class="space-y-4">
            <UButton
              v-if="events.length === 0"
              color="primary"
              size="lg"
              @click="openCreateForm"
              icon="i-heroicons-plus-circle"
            >
              Criar Primeiro Evento
            </UButton>
            <UButton
              v-else
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
              {{ filteredEvents.length }} {{ filteredEvents.length === 1 ? 'Evento Encontrado' : 'Eventos Encontrados' }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              {{ hasActiveFilters ? 'Resultados filtrados' : 'Todos os próximos eventos' }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
          </div>
        </div>

        <!-- Grid de Eventos -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <TransitionGroup name="list" tag="div" class="contents">
            <UCard
              v-for="event in paginatedEvents"
              :key="event.id"
              class="group hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-gray-800 overflow-hidden"
            >
              <template #header>
                <div class="space-y-4">
                  <!-- Imagem do Evento -->
                  <div v-if="event.image_url" class="relative h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <NuxtImg
                      :src="event.image_url"
                      :alt="event.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div class="absolute top-2 right-2">
                      <UBadge
                        :color="getEventStatus(event.date) === 'upcoming' ? 'success' : 'neutral'"
                        variant="solid"
                        size="xs"
                      >
                        {{ getEventStatus(event.date) === 'upcoming' ? 'Próximo' : 'Passado' }}
                      </UBadge>
                    </div>
                  </div>

                  <!-- Cabeçalho do Evento -->
                  <div class="space-y-3">
                    <div class="flex items-start justify-between">
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {{ event.title }}
                      </h3>
                      <UBadge
                        v-if="!event.image_url"
                        :color="getEventStatus(event.date) === 'upcoming' ? 'success' : 'neutral'"
                        variant="soft"
                        size="xs"
                      >
                        {{ getEventStatus(event.date) === 'upcoming' ? 'Próximo' : 'Passado' }}
                      </UBadge>
                    </div>

                    <!-- Metadados do Evento -->
                    <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <span class="font-medium">{{ formatDate(event.date) }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <span class="line-clamp-1">{{ event.location }}</span>
                      </div>
                      <div v-if="event.category" class="flex items-center gap-2">
                        <UIcon name="i-heroicons-tag" class="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <UBadge color="primary" variant="soft" size="xs">
                          {{ event.category }}
                        </UBadge>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Descrição -->
              <div v-if="event.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                {{ event.description }}
              </div>

              <template #footer>
                <div class="flex gap-2 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                  <UButton
                    :to="`/events/${event.id}`"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-eye"
                  >
                    Ver
                  </UButton>
                  <UButton
                    color="primary"
                    variant="outline"
                    size="sm"
                    @click="editEvent(event)"
                    icon="i-heroicons-pencil"
                  >
                    Editar
                  </UButton>
                  <UButton
                    color="error"
                    variant="outline"
                    size="sm"
                    @click="deleteEvent(event.id)"
                    icon="i-heroicons-trash"
                    :loading="deletingEvents.includes(event.id)"
                  >
                    Excluir
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
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '~/types'

// Middleware de proteção
definePageMeta({
  middleware: 'admin'
})

// SEO
useSeoMeta({
  title: 'Painel Administrativo - EventSphere',
  description: 'Gerencie eventos, visualize estatísticas e administre a plataforma EventSphere'
})

const supabase = useSupabaseClient()
const toast = useToast()

// Estados reativos principais
const events = ref<Event[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Estados do modal e formulário
const isModalOpen = ref(false)
const editingEvent = ref<Event | null>(null)
const formLoading = ref(false)
const deletingEvents = ref<number[]>([])

// Filtros e pesquisa
const searchTerm = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const sortBy = ref('date')

// Paginação
const currentPage = ref(1)
const itemsPerPage = 9

// Opções de filtro
const categoryOptions = computed(() => {
  const categories = [...new Set(events.value.map(e => e.category).filter(Boolean))]
  return [
    { label: 'Todas as categorias', value: '' },
    ...categories.map(cat => ({ label: cat, value: cat }))
  ]
})

const statusOptions = [
  { label: 'Todos os status', value: '' },
  { label: 'Próximos', value: 'upcoming' },
  { label: 'Passados', value: 'past' }
]

const sortOptions = [
  { label: 'Data (Mais próximos)', value: 'date' },
  { label: 'Nome (A-Z)', value: 'name' },
  { label: 'Categoria', value: 'category' },
  { label: 'Criação (Mais recentes)', value: 'created' }
]

// Computed properties
const filteredEvents = computed(() => {
  let filtered = events.value

  // Filtro por termo de pesquisa
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term) ||
      event.description?.toLowerCase().includes(term) ||
      event.category?.toLowerCase().includes(term)
    )
  }

  // Filtro por categoria
  if (filterCategory.value) {
    filtered = filtered.filter(event => event.category === filterCategory.value)
  }

  // Filtro por status
  if (filterStatus.value) {
    const now = new Date()
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.date)
      return filterStatus.value === 'upcoming'
        ? eventDate > now
        : eventDate <= now
    })
  } else {
    // Por padrão, mostrar apenas próximos eventos
    const now = new Date()
    filtered = filtered.filter(event => new Date(event.date) > now)
  }

  // Ordenação
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.title.localeCompare(b.title)
      case 'category':
        return (a.category || '').localeCompare(b.category || '')
      case 'created':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      default:
        return new Date(a.date).getTime() - new Date(b.date).getTime()
    }
  })

  return filtered
})

const hasActiveFilters = computed(() => {
  return !!(searchTerm.value || filterCategory.value || filterStatus.value)
})

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage))

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEvents.value.slice(start, start + itemsPerPage)
})

// Métodos principais
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
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getEventStatus = (dateString: string) => {
  return new Date(dateString) > new Date() ? 'upcoming' : 'past'
}

// Métodos do modal e formulário
const openCreateForm = () => {
  editingEvent.value = null
  isModalOpen.value = true
}

const editEvent = (event: Event) => {
  editingEvent.value = event
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingEvent.value = null
  formLoading.value = false
}

const handleEventSaved = async (savedEvent: Event) => {
  closeModal()
  await fetchEvents()

  toast.add({
    title: editingEvent.value ? 'Evento atualizado!' : 'Evento criado!',
    description: 'As alterações foram salvas com sucesso.',
    color: 'success',
    icon: 'i-heroicons-check-circle'
  })
}

const deleteEvent = async (id: number) => {
  if (!confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.')) {
    return
  }

  try {
    deletingEvents.value.push(id)

    const { error: sbError } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (sbError) throw sbError

    events.value = events.value.filter(event => event.id !== id)

    toast.add({
      title: 'Evento excluído!',
      description: 'O evento foi removido com sucesso.',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  } catch (err) {
    console.error('Erro ao excluir evento:', err)
    toast.add({
      title: 'Erro na exclusão',
      description: (err instanceof Error) ? err.message : 'Não foi possível excluir o evento',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    deletingEvents.value = deletingEvents.value.filter(eventId => eventId !== id)
  }
}

const clearAllFilters = () => {
  searchTerm.value = ''
  filterCategory.value = ''
  filterStatus.value = ''
  currentPage.value = 1
}

// Watchers
watch([searchTerm, filterCategory, filterStatus, sortBy], () => {
  currentPage.value = 1
})

onMounted(fetchEvents)
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
