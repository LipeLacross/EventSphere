<template>
  <div>
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
    <button @click="handleError">Voltar</button>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

function handleError() {
  clearError({ redirect: '/login' })
}
</script>
