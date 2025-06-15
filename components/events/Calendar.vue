<template>
  <div class="calendar-container">
    <UCard class="shadow-lg">
      <template #header>
        <h3 class="text-lg font-semibold text-primary-700 dark:text-primary-300">
          Calendário de Eventos
        </h3>
      </template>

      <div class="calendar-wrapper">
        <UCalendar
          v-model="selectedDate"
          :attributes="calendarAttributes"
          @day-click="onDayClick"
          class="w-full"
        >
          <template #day="{ day }">
            <div class="relative">
              <span class="text-sm font-medium">{{ day.day }}</span>
              <div
                v-if="hasEvent(day)"
                class="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full"
              />
            </div>
          </template>
        </UCalendar>
      </div>

      <div v-if="eventsForSelectedDate.length > 0" class="mt-4 pt-4 border-t">
        <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2">
          Eventos para {{ formatSelectedDate }}:
        </h4>
        <div class="space-y-2">
          <div
            v-for="event in eventsForSelectedDate"
            :key="event.id"
            class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
          >
            <div>
              <p class="font-medium text-sm">{{ event.title }}</p>
              <p class="text-xs text-gray-500">{{ event.location }}</p>
            </div>
            <UButton
              :to="`/events/${event.id}`"
              color="primary"
              variant="ghost"
              size="xs"
            >
              Detalhes
            </UButton>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CalendarDate, parseDate } from '@internationalized/date'

interface CalendarEvent {
  id: number
  title: string
  date: string
  location: string
  description?: string
  category?: string
}

interface Props {
  events?: CalendarEvent[]
}

const props = withDefaults(defineProps<Props>(), {
  events: () => []
})

// Estado reativo usando CalendarDate
const selectedDate = ref<CalendarDate>(new CalendarDate(2024, 6, 1))
const allEvents = ref<CalendarEvent[]>([])
const loading = ref(false)

const calendarAttributes = computed(() => {
  return [{
    dates: allEvents.value.map(event => parseDate(event.date)),
    dot: {
      style: {
        backgroundColor: '#3B82F6'
      }
    }
  }]
})

const eventsForSelectedDate = computed(() => {
  return allEvents.value.filter(event => {
    const eventDate = parseDate(event.date)
    return eventDate.compare(selectedDate.value) === 0
  })
})

const formatSelectedDate = computed(() => {
  const date = selectedDate.value.toDate('UTC')
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const hasEvent = (day: { date: CalendarDate }) => {
  return allEvents.value.some(event => {
    const eventDate = parseDate(event.date)
    return eventDate.compare(day.date) === 0
  })
}

const onDayClick = (day: { date: CalendarDate }) => {
  selectedDate.value = day.date
}

const fetchEvents = async () => {
  try {
    loading.value = true
    const data = await $fetch<CalendarEvent[]>('/api/events')
    allEvents.value = data || []
  } catch (error) {
    console.error('Erro ao carregar eventos:', error)
    allEvents.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.events?.length) {
    allEvents.value = props.events
  } else {
    fetchEvents()
  }
})
</script>

<style scoped>
.calendar-container {
  max-width: 100%;
}

.calendar-wrapper {
  width: 100%;
}
</style>
