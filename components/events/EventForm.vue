<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
    <!-- Header do Formulário -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {{ props.event ? 'Editar Evento' : 'Criar Novo Evento' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ props.event ? 'Atualize as informações do evento' : 'Preencha os dados para criar um novo evento' }}
          </p>
        </div>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="closeForm"
          size="sm"
          class="hover:bg-gray-100 dark:hover:bg-gray-700"
        />
      </div>
    </div>

    <!-- Corpo do Formulário -->
    <div class="p-6">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Informações Básicas -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-primary-500" />
            Informações Básicas
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título do Evento *
              </label>
              <UInput
                v-model="form.title"
                placeholder="Ex: Conferência de Tecnologia 2025"
                icon="i-heroicons-calendar"
                size="lg"
                required
                :class="{ 'border-red-500': errors.title }"
              />
              <p v-if="errors.title" class="text-red-500 text-xs mt-1">{{ errors.title }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <USelect
                v-model="form.category"
                :options="categoryOptions"
                placeholder="Selecione uma categoria"
                icon="i-heroicons-tag"
                size="lg"
              />
            </div>
          </div>
        </div>

        <!-- Data e Horário -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-500" />
            Data e Horário
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data do Evento *
              </label>
              <UInput
                v-model="form.date"
                type="date"
                icon="i-heroicons-calendar-days"
                size="lg"
                required
                :min="new Date().toISOString().split('T')[0]"
                :class="{ 'border-red-500': errors.date }"
              />
              <p v-if="errors.date" class="text-red-500 text-xs mt-1">{{ errors.date }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Horário
              </label>
              <UInput
                v-model="form.time"
                type="time"
                icon="i-heroicons-clock"
                size="lg"
                placeholder="Ex: 14:30"
              />
            </div>
          </div>
        </div>

        <!-- Localização -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary-500" />
            Localização
          </h4>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Endereço Completo *
            </label>
            <UInput
              v-model="form.location"
              placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
              icon="i-heroicons-map-pin"
              size="lg"
              required
              :class="{ 'border-red-500': errors.location }"
            />
            <p v-if="errors.location" class="text-red-500 text-xs mt-1">{{ errors.location }}</p>
          </div>
        </div>

        <!-- Descrição -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-500" />
            Descrição do Evento
          </h4>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <UTextarea
              v-model="form.description"
              placeholder="Descreva os detalhes do evento, programação, palestrantes, etc."
              :rows="4"
              resize
            />
          </div>
        </div>

        <!-- Upload de Imagem - CORREÇÃO AQUI -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-photo" class="w-5 h-5 text-primary-500" />
            Imagem do Evento
          </h4>

          <div class="space-y-3">
            <!-- CORREÇÃO: Usando @change em vez de onChange -->
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p class="text-xs text-gray-500">Formatos aceitos: JPG, PNG, WebP. Tamanho máximo: 5MB</p>

            <!-- Preview da imagem -->
            <div v-if="imagePreview" class="mt-3">
              <img
                :src="imagePreview"
                alt="Preview da imagem"
                class="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <UButton
            type="button"
            color="gray"
            variant="outline"
            @click="closeForm"
            :disabled="loading"
            size="lg"
            class="flex-1 sm:flex-none"
          >
            <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-2" />
            Cancelar
          </UButton>

          <UButton
            type="submit"
            color="primary"
            :loading="loading"
            :disabled="loading || !isFormValid"
            size="lg"
            class="flex-1"
          >
            <UIcon
              :name="props.event ? 'i-heroicons-pencil' : 'i-heroicons-plus'"
              class="w-4 h-4 mr-2"
            />
            {{ loading ? 'Salvando...' : (props.event ? 'Atualizar Evento' : 'Criar Evento') }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import type { Event } from '~/types'

// Props e eventos
interface Props {
  event?: Event | null
}

const props = withDefaults(defineProps<Props>(), {
  event: null
})

const emit = defineEmits<{
  close: []
  saved: [event: Event]
}>()

// Composables
const supabase = useSupabaseClient()
const toast = useToast()

// Estados
const loading = ref(false)
const imagePreview = ref<string | null>(null)
const errors = ref<Record<string, string>>({})

const form = reactive({
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  category: '',
  image: null as File | null
})

// Opções
const categoryOptions = [
  { label: 'Tecnologia', value: 'Tecnologia' },
  { label: 'Música', value: 'Música' },
  { label: 'Esporte', value: 'Esporte' },
  { label: 'Arte', value: 'Arte' },
  { label: 'Negócios', value: 'Negócios' },
  { label: 'Educação', value: 'Educação' },
  { label: 'Saúde', value: 'Saúde' },
  { label: 'Gastronomia', value: 'Gastronomia' },
  { label: 'Outro', value: 'Outro' }
]

// Computed
const isFormValid = computed(() => {
  return form.title.length >= 3 &&
         form.date &&
         form.location.length >= 5
})

// Métodos
const validateForm = () => {
  errors.value = {}

  if (!form.title || form.title.trim().length < 3) {
    errors.value.title = 'Título deve ter pelo menos 3 caracteres'
  }

  if (!form.date) {
    errors.value.date = 'Data é obrigatória'
  }

  if (!form.location || form.location.trim().length < 5) {
    errors.value.location = 'Localização deve ter pelo menos 5 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

// CORREÇÃO: Tipagem correta para o evento de arquivo
const onFileChange = (event: Event) => {
  // CORREÇÃO: Casting do target para HTMLInputElement
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Validar tamanho
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        title: 'Arquivo muito grande',
        description: 'A imagem deve ter no máximo 5MB',
        color: 'error',
        icon: 'i-heroicons-exclamation-triangle'
      })
      return
    }

    form.image = file

    // Preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('event-images')
    .upload(fileName, file)

  if (error) throw error

  const { data: publicUrl } = supabase.storage
    .from('event-images')
    .getPublicUrl(fileName)

  return publicUrl.publicUrl
}

const onSubmit = async () => {
  if (!validateForm()) return

  try {
    loading.value = true

    let image_url = props.event?.image_url || ''

    // Upload da imagem se fornecida
    if (form.image) {
      image_url = await uploadImage(form.image)
    }

    // Preparar dados
    let eventDate = form.date
    if (form.time) {
      eventDate = `${form.date}T${form.time}`
    }

    const eventData = {
      title: form.title.trim(),
      date: eventDate,
      location: form.location.trim(),
      description: form.description?.trim() || '',
      category: form.category || '',
      image_url
    }

    let savedEvent: Event

    if (props.event) {
      // Atualizar
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', props.event.id)
        .select()
        .single()

      if (error) throw error
      savedEvent = data
    } else {
      // Criar
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single()

      if (error) throw error
      savedEvent = data
    }

    emit('saved', savedEvent)

    toast.add({
      title: props.event ? 'Evento atualizado!' : 'Evento criado!',
      description: 'As alterações foram salvas com sucesso.',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })

  } catch (err: any) {
    console.error('Erro ao salvar evento:', err)
    toast.add({
      title: 'Erro ao salvar',
      description: err.message || 'Ocorreu um erro inesperado',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    loading.value = false
  }
}

const closeForm = () => {
  // Limpar formulário
  Object.assign(form, {
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    image: null
  })
  imagePreview.value = null
  errors.value = {}

  emit('close')
}

// Lifecycle
onMounted(() => {
  if (props.event) {
    form.title = props.event.title
    form.location = props.event.location
    form.description = props.event.description || ''
    form.category = props.event.category || ''

    // Separar data e horário
    if (props.event.date) {
      if (props.event.date.includes('T')) {
        const [date, time] = props.event.date.split('T')
        form.date = date
        form.time = time.substring(0, 5)
      } else {
        form.date = props.event.date
      }
    }

    // Preview da imagem
    if (props.event.image_url) {
      imagePreview.value = props.event.image_url
    }
  }
})
</script>
