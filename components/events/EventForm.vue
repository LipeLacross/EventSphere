<template>
  <UForm :state="form" @submit="onSubmit">
    <UFormField label="Título" name="title">
      <UInput v-model="form.title" />
    </UFormField>
    <UFormField label="Data" name="date">
      <UInput v-model="form.date" type="date" />
    </UFormField>
    <UFormField label="Local" name="location">
      <UInput v-model="form.location" />
    </UFormField>
    <UFormField label="Descrição" name="description">
      <UTextarea v-model="form.description" />
    </UFormField>
    <UFormField label="Imagem" name="image">
      <input type="file" @change="onFileChange" />
    </UFormField>
    <UButton type="submit" color="primary">Salvar</UButton>
    <UButton color="neutral" @click="$emit('close')">Cancelar</UButton>
  </UForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const form = reactive({ title: '', date: '', location: '', description: '', image: null })

function onFileChange(e) {
  form.image = e.target.files[0]
}

async function onSubmit() {
  const formData = new FormData()
  for (const key in form) formData.append(key, form[key])
  await $fetch('/api/events', { method: 'POST', body: formData })
  $emit('saved')
  $emit('close')
}
</script>
