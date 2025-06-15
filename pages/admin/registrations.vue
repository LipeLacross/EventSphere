<template>
  <div class="container mx-auto py-8">
    <UCard class="shadow-lg">
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-primary-700 dark:text-primary-300">
            Inscrições de Eventos
          </h1>
          <UBadge v-if="registrations.length > 0" color="primary" variant="solid">
            {{ registrations.length }} inscrições
          </UBadge>
        </div>
      </template>

      <div v-if="loading" class="flex justify-center items-center py-8">
        <UProgress animation="carousel" class="w-40" />
        <p class="ml-4 text-gray-500">Carregando inscrições...</p>
      </div>

      <div v-else-if="error" class="py-8">
        <UAlert
          color="error"
          variant="soft"
          title="Erro ao carregar inscrições"
          :description="error"
        />
      </div>

      <div v-else-if="registrations.length === 0" class="text-center py-8">
        <UIcon name="i-heroicons-users" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">Nenhuma inscrição encontrada</p>
      </div>

      <div v-else class="overflow-x-auto">
        <UTable
          :rows="registrations"
          :columns="columns"
          class="w-full"
        >
          <template #eventTitle-data="{ row }">
            <div class="font-medium text-gray-900 dark:text-gray-100">
              {{ getRegistrationData(row).eventTitle }}
            </div>
          </template>

          <template #name-data="{ row }">
            <div class="text-gray-700 dark:text-gray-300">
              {{ getRegistrationData(row).name }}
            </div>
          </template>

          <template #email-data="{ row }">
            <div class="text-blue-600 dark:text-blue-400 font-mono text-sm">
              {{ getRegistrationData(row).email }}
            </div>
          </template>

          <template #created_at-data="{ row }">
            <div class="text-gray-500 text-sm">
              {{ formatDate(getRegistrationData(row).created_at) }}
            </div>
          </template>
        </UTable>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Definir interfaces TypeScript
interface Registration {
  id: number
  eventTitle: string
  name: string
  email: string
  created_at: string
  event_id: number
}

// Estados reativos
const registrations = ref<Registration[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

// Configuração das colunas SEM tipagem explícita - SOLUÇÃO PRINCIPAL
const columns = [
  { key: 'eventTitle', label: 'Evento', sortable: true },
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'email', label: 'E-mail', sortable: true },
  { key: 'created_at', label: 'Data de Inscrição', sortable: true }
]

// Função helper para type casting seguro
const getRegistrationData = (row: any): Registration => {
  return row as Registration
}

// Função para formatar data
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Função para buscar inscrições
const fetchRegistrations = async (): Promise<void> => {
  try {
    loading.value = true
    error.value = null

    const data = await $fetch<Registration[]>('/api/registrations')
    registrations.value = data || []
  } catch (err) {
    console.error('Erro ao carregar inscrições:', err)
    error.value = 'Erro ao carregar as inscrições. Tente novamente mais tarde.'
    registrations.value = []
  } finally {
    loading.value = false
  }
}

// Executar ao montar o componente
onMounted(() => {
  fetchRegistrations()
})

// Middleware de proteção para área administrativa
definePageMeta({
  middleware: 'admin'
})
</script>
