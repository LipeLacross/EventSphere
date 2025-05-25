<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-bold">{{ event.title }}</h2>
    </template>
    <p><strong>Data:</strong> {{ event.date }}</p>
    <p><strong>Local:</strong> {{ event.location }}</p>
    <p>{{ event.description }}</p>
  </UCard>
</template>

<script setup lang="ts">
defineProps(['event'])
</script>
