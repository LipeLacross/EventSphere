<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <div class="w-full max-w-md">
      <UCard class="shadow-xl rounded-lg overflow-hidden">
        <template #header>
          <div class="text-center space-y-2">
            <UIcon
              name="i-heroicons-lock-closed"
              class="w-14 h-14 text-primary-600 dark:text-primary-400 mx-auto transition-transform hover:scale-110"
            />
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Acesso Administrativo
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Utilize suas credenciais de administrador
            </p>
          </div>
        </template>

        <UForm
          :schema="schema"
          :state="form"
          class="space-y-4 px-4 pb-6"
          @submit.prevent="onSubmit"
        >
          <UFormGroup
            label="Email:"
            name="email"
            class="space-y-1"
          >
            <UInput
              v-model="form.email"
              type="email"
              placeholder="seu.email@admin.com"
              autocomplete="email"
              class="pl-10"
            >
              <template #leading>
                <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </template>
            </UInput>
            <UFormMessage />
          </UFormGroup>

          <UFormGroup
            label="Senha:"
            name="password"
            class="space-y-1"
          >
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              class="pl-10"
            >
              <template #leading>
                <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </template>
            </UInput>
            <UFormMessage />
          </UFormGroup>

          <UButton
            type="submit"
            block
            color="primary"
            :loading="loading"
            class="mt-6 h-10 font-semibold"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5" />
            </template>
            Acessar Sistema
          </UButton>
        </UForm>

        <div class="mt-4 text-center">
          <NuxtLink
            to="/recuperar-senha"
            class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            Esqueceu sua senha?
          </NuxtLink>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const supabase = useSupabaseClient()
const toast = useToast()
const loading = ref(false)
const router = useRouter()

// Schema de validação
const schema = z.object({
  email: z.string()
    .email('Formato de email inválido')
    .refine(email => email.endsWith('@admin.com'), {
      message: 'Acesso restrito a emails administrativos'
    }),
  password: z.string()
    .min(8, 'Mínimo de 8 caracteres')
    .max(32, 'Máximo de 32 caracteres')
})

type Schema = z.output<typeof schema>

const form = reactive({
  email: '',
  password: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    loading.value = true

    // Autenticação com Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: event.data.email,
      password: event.data.password
    })

    if (error) throw error

    // Verificação imediata de admin
    if (!data.user?.email?.endsWith('@admin.com')) {
      await supabase.auth.signOut()
      throw new Error('Credenciais não autorizadas')
    }

    // Redirecionamento seguro com tratamento de erro
    try {
      await router.push('/admin')
    } catch (err) {
      console.error('Erro de navegação:', err)
      await router.push('/login')
    }

  } catch (err: any) {
    // Tratamento detalhado de erros
    let errorMessage = 'Erro ao processar autenticação'

    if (err.message.includes('Invalid login credentials')) {
      errorMessage = 'Credenciais inválidas'
    } else if (err.message.includes('Email not confirmed')) {
      errorMessage = 'Confirme seu email antes de entrar'
    } else if (err.message.includes('Credenciais não autorizadas')) {
      errorMessage = 'Acesso restrito a administradores'
    }

    // Toast com ícone e cores corretas
    toast.add({
      title: 'Falha no Login',
      description: errorMessage,
      color: 'error',
      icon: 'i-heroicons-x-circle',
      timeout: 5000
    })

  } finally {
    loading.value = false
  }
}
</script>
