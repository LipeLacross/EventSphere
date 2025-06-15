<template>
  <UCard class="shadow-lg">
    <template #header>
      <h3 class="text-lg font-semibold text-primary-700 dark:text-primary-300">
        Inscrever-se no Evento
      </h3>
    </template>

    <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
      <UFormField label="Nome" name="name">
        <UInput v-model="form.name" placeholder="Digite seu nome completo" />
      </UFormField>

      <UFormField label="E-mail" name="email">
        <UInput
          v-model="form.email"
          type="email"
          placeholder="Digite seu e-mail"
        />
      </UFormField>

      <div class="flex justify-end">
        <UButton
          type="submit"
          color="primary"
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? 'Inscrevendo...' : 'Inscrever-se' }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { reactive, ref } from 'vue'

// Definir interface TypeScript
interface Props {
  eventId: number
}

const props = defineProps<Props>()

// Estados reativos
const form = reactive({
  name: '',
  email: '',
  event_id: props.eventId
})

const loading = ref<boolean>(false)

// Schema de validação Zod
const schema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  event_id: z.number().min(1, 'ID do evento é obrigatório')
})

// useToast é auto-importado pelo Nuxt UI - NÃO IMPORTAR MANUALMENTE
const toast = useToast()

// Função para submeter o formulário
async function onSubmit(event: { data: any }): Promise<void> {
  try {
    loading.value = true

    const validatedData = schema.parse({
      ...event.data,
      event_id: props.eventId
    })

    await $fetch('/api/registrations', {
      method: 'POST',
      body: validatedData
    })

    // Toast de sucesso
    toast.add({
      title: 'Inscrição realizada!',
      description: 'Você receberá um e-mail de confirmação em breve.',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })

    // Limpar formulário após sucesso
    form.name = ''
    form.email = ''

  } catch (err: any) {
    console.error('Erro ao realizar inscrição:', err)

    // Toast de erro
    toast.add({
      title: 'Erro na inscrição',
      description: err.data?.message || 'Ocorreu um erro inesperado. Tente novamente.',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    loading.value = false
  }
}
</script>
