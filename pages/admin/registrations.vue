<template>
  <div class="container mx-auto py-8">
    <h1 class="text-2xl font-bold mb-4">Inscrições</h1>
    <table>
      <thead>
        <tr>
          <th>Evento</th>
          <th>Nome</th>
          <th>E-mail</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reg in registrations" :key="reg.id">
          <td>{{ reg.eventTitle }}</td>
          <td>{{ reg.name }}</td>
          <td>{{ reg.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const registrations = ref([])
onMounted(async () => {
  registrations.value = await $fetch('/api/registrations')
})
</script>
