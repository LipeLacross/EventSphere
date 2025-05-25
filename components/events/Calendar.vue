<template>
  <UCalendar v-model="selectedDate">
    <template #day="{ day }">
      <UChip v-if="hasEvent(day)" color="primary">{{ day.day }}</UChip>
      <span v-else>{{ day.day }}</span>
    </template>
  </UCalendar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const selectedDate = ref(null)
const events = ref([]) // Receber eventos como prop ou fetch

function hasEvent(day) {
  // Lógica para verificar se há evento na data
  return events.value.some(event => event.date === day.toString())
}
</script>
