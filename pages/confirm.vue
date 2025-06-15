<template>
  <div class="flex items-center justify-center min-h-screen">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center">
          <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-success-500 mx-auto mb-4" />
          <h2 class="text-xl font-semibold">Confirmando Login</h2>
        </div>
      </template>

      <div class="text-center py-4">
        <UProgress animation="carousel" class="mb-4" />
        <p class="text-gray-600 dark:text-gray-400">
          Aguarde enquanto confirmamos seu acesso...
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Função para redirecionar após confirmação
onMounted(() => {
  setTimeout(() => {
    navigateTo('/')
  }, 2000)
})

// Meta da página
definePageMeta({
  layout: 'auth'
})
</script>
