<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <UProgress animation="carousel" />
      <p class="mt-4">Confirmando login...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  setTimeout(() => {
    navigateTo('/')
  }, 2000)
})
</script>
