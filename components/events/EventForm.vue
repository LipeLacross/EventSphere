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
      <UForm :schema="schema" :state="form" class="space-y-6" @submit="onSubmit">
        <!-- Informações Básicas -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-primary-500" />
            Informações Básicas
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Título do Evento" name="title" required>
              <UInput
                v-model="form.title"
                placeholder="Ex: Conferência de Tecnologia 2025"
                icon="i-heroicons-calendar"
                size="lg"
              />
            </UFormGroup>

            <UFormGroup label="Categoria" name="category">
              <USelect
                v-model="form.category"
                :options="categoryOptions"
                placeholder="Selecione uma categoria"
                icon="i-heroicons-tag"
                size="lg"
              />
            </UFormGroup>
          </div>
        </div>

        <!-- Data e Horário -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-500" />
            Data e Horário
          </h4>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Data do Evento" name="date" required>
              <UInput
                v-model="form.date"
                type="date"
                icon="i-heroicons-calendar-days"
                size="lg"
                :min="new Date().toISOString().split('T')[0]"
              />
            </UFormGroup>

            <UFormGroup label="Horário" name="time">
              <UInput
                v-model="form.time"
                type="time"
                icon="i-heroicons-clock"
                size="lg"
                placeholder="Ex: 14:30"
              />
            </UFormGroup>
          </div>
        </div>

        <!-- Localização -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary-500" />
            Localização
          </h4>

          <UFormGroup label="Endereço Completo" name="location" required>
            <UInput
              v-model="form.location"
              placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
              icon="i-heroicons-map-pin"
              size="lg"
            />
          </UFormGroup>
        </div>

        <!-- Descrição -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-primary-500" />
            Descrição do Evento
          </h4>

          <UFormGroup label="Descrição" name="description">
            <UTextarea
              v-model="form.description"
              placeholder="Descreva os detalhes do evento, programação, palestrantes, etc."
              :rows="4"
              resize
            />
          </UFormGroup>
        </div>

        <!-- Upload de Imagem -->
        <div class="space-y-4">
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <UIcon name="i-heroicons-photo" class="w-5 h-5 text-primary-500" />
            Imagem do Evento
          </h4>

          <UFormGroup label="Imagem" name="image">
            <div class="space-y-3">
              <UInput
                type="file"
                accept="image/*"
                @change="onFileChange"
                icon="i-heroicons-photo"
                size="lg"
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
          </UFormGroup>
        </div>

        <!-- Botões de Ação -->
        <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <UButton
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
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { reactive, ref, onMounted, computed } from 'vue'
import type { Event } from '~/types'

// Definição das props
interface Props {
  event?: Event | null
}

const props = withDefaults(defineProps<Props>(), {
  event: null
})

// Definir corretamente os eventos emit
const emit = defineEmits<{
  close: []
  saved: [event: Event]
}>()

const supabase = useSupabaseClient()
const toast = useToast()

// Estados reativos
const loading = ref(false)
const imagePreview = ref<string | null>(null)

const form = reactive({
  title: '',
  date: '',
  time: '',
  location: '',
  description: '',
  category: '',
  image: null as File | null
})

// Schema de validação aprimorado
const schema = z.object({
  title: z.string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  date: z.string().min(1, 'Data é obrigatória'),
  location: z.string()
    .min(5, 'Localização deve ter pelo menos 5 caracteres')
    .max(200, 'Localização deve ter no máximo 200 caracteres'),
  description: z.string().max(1000, 'Descrição deve ter no máximo 1000 caracteres').optional(),
  category: z.string().optional(),
  time: z.string().optional()
})

// Validação do formulário
const isFormValid = computed(() => {
  return form.title.length >= 3 &&
         form.date &&
         form.location.length >= 5
})

// Opções de categoria
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

// Função para lidar com mudança de arquivo
const onFileChange = (event: any) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Validar tamanho do arquivo (5MB)
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

    // Criar preview da imagem
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Função para fazer upload da imagem
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

// Função principal de submissão
const onSubmit = async (event: { data: any }) => {
  try {
    loading.value = true

    let image_url = props.event?.image_url || ''

    // Upload da nova imagem se fornecida
    if (form.image) {
      image_url = await uploadImage(form.image)
    }

    // Combinar data e horário se fornecidos
    let eventDate = event.data.date
    if (event.data.time) {
      eventDate = `${event.data.date}T${event.data.time}`
    }

    const eventData = {
      title: event.data.title.trim(),
      date: eventDate,
      location: event.data.location.trim(),
      description: event.data.description?.trim() || '',
      category: event.data.category || '',
      image_url
    }

    let savedEvent: Event

    if (props.event) {
      // Atualizar evento existente
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', props.event.id)
        .select()
        .single()

      if (error) throw error
      savedEvent = data
    } else {
      // Criar novo evento
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single()

      if (error) throw error
      savedEvent = data
    }

    // Emitir evento de sucesso
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

// Função para fechar o formulário
const closeForm = () => {
  // Limpar formulário
  form.title = ''
  form.date = ''
  form.time = ''
  form.location = ''
  form.description = ''
  form.category = ''
  form.image = null
  imagePreview.value = null

  emit('close')
}

// Preencher formulário se estiver editando
onMounted(() => {
  if (props.event) {
    form.title = props.event.title
    form.location = props.event.location
    form.description = props.event.description || ''
    form.category = props.event.category || ''

    // Separar data e horário se necessário
    if (props.event.date) {
      if (props.event.date.includes('T')) {
        const [date, time] = props.event.date.split('T')
        form.date = date
        form.time = time.substring(0, 5) // HH:MM
      } else {
        form.date = props.event.date
      }
    }

    // Mostrar preview da imagem existente
    if (props.event.image_url) {
      imagePreview.value = props.event.image_url
    }
  }
})
</script>
