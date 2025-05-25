<template>
  <div ref="mapContainer" class="w-full h-full rounded-lg shadow-lg" />
</template>

<script setup lang="ts">
import mapboxgl from 'mapbox-gl'
const { location } = defineProps(['location'])

const mapContainer = ref(null)
const config = useRuntimeConfig()

onMounted(() => {
  mapboxgl.accessToken = config.public.mapboxKey

  new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-46.6333, -23.5505], // Coordenadas de SP
    zoom: 12
  })
})
</script>
