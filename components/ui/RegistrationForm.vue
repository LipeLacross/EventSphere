<template>
  <UForm :schema="schema" :state="form" class="space-y-4" @submit="onSubmit">
    <UFormField label="Nome" name="name">
      <UInput v-model="form.name" />
    </UFormField>
    <UFormField label="E-mail" name="email">
      <UInput v-model="form.email" type="email" />
    </UFormField>
    <UButton type="submit" color="primary">Inscrever-se</UButton>
  </UForm>
</template>

<script setup lang="ts">
import * as z from 'zod'
import { reactive } from 'vue'
import { useToast } from '@nuxt/ui'

const form = reactive({ name: '', email: '' })
const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido')
})

const toast = useToast()

async function onSubmit({ data }) {
  await $fetch('/api/registrations', { method: 'POST', body: data })
  toast.add({ title: 'Inscrição realizada!', color: 'success' })
}
</script>
