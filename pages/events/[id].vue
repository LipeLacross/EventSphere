<template>
  <div v-if="pending" class="text-center p-8">
    <UProgress animation="carousel" />
  </div>

  <div v-else>
    <EventDetails :event="event.data" />

    <div class="mt-8 h-96">
      <Map :location="event.data.location" />
    </div>

    <RegistrationForm :event-id="$route.params.id" class="mt-8" />
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params
const { data: event, pending } = await useLazyFetch(`/api/events/${id}`)
</script>
