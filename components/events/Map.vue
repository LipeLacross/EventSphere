<template>
  <div class="map-container">
    <UCard class="shadow-lg">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-primary-700 dark:text-primary-300">
            Localização do Evento
          </h3>
          <UButton
            v-if="location"
            @click="openInMaps"
            color="primary"
            variant="ghost"
            size="sm"
            icon="i-heroicons-map-pin"
          >
            Abrir no Maps
          </UButton>
        </div>
      </template>

      <div
        ref="mapContainer"
        class="w-full h-96 rounded-lg overflow-hidden"
        :class="{ 'animate-pulse bg-gray-200 dark:bg-gray-700': loading }"
      />

      <div v-if="error" class="mt-4">
        <!-- Alterado de red para error -->
        <UAlert
          color="error"
          variant="soft"
          title="Erro ao carregar mapa"
          :description="error"
        />
      </div>

      <div v-if="location" class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
        <div class="flex items-start space-x-2">
          <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary-500 mt-0.5" />
          <div>
            <p class="font-medium text-gray-900 dark:text-gray-100">Endereço:</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ location }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Definir interfaces TypeScript
interface Props {
  location?: string
  coordinates?: [number, number]
  showDirections?: boolean
}

// Props do componente
const props = withDefaults(defineProps<Props>(), {
  location: '',
  coordinates: () => [-46.6333, -23.5505], // São Paulo como padrão
  showDirections: false
})

// Estados reativos
const mapContainer = ref<HTMLElement | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const map = ref<any>(null)

// Configuração do runtime
const config = useRuntimeConfig()

// Função para inicializar o mapa
const initializeMap = async () => {
  if (!mapContainer.value) return

  try {
    loading.value = true
    error.value = null

    // Importar dinamicamente o Mapbox GL JS
    const mapboxgl = await import('mapbox-gl')

    // Configurar token de acesso
    mapboxgl.default.accessToken = config.public.mapboxKey

    // Criar instância do mapa
    map.value = new mapboxgl.default.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: props.coordinates,
      zoom: 15,
      language: 'pt-BR'
    })

    // Aguardar carregamento do mapa
    await new Promise((resolve) => {
      map.value.on('load', resolve)
    })

    // Adicionar marcador
    new mapboxgl.default.Marker({
      color: '#3B82F6'
    })
      .setLngLat(props.coordinates)
      .setPopup(
        new mapboxgl.default.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <p class="font-medium text-sm">${props.location || 'Local do Evento'}</p>
            </div>
          `)
      )
      .addTo(map.value)

    // Adicionar controles de navegação
    map.value.addControl(new mapboxgl.default.NavigationControl(), 'top-right')
    map.value.addControl(new mapboxgl.default.FullscreenControl(), 'top-right')

    // Adicionar controle de direções se solicitado
    if (props.showDirections) {
      await addDirectionsControl()
    }

  } catch (err) {
    console.error('Erro ao inicializar mapa:', err)
    error.value = 'Erro ao carregar o mapa. Verifique sua conexão e tente novamente.'
  } finally {
    loading.value = false
  }
}

// Função para adicionar controle de direções
const addDirectionsControl = async () => {
  try {
    // Importar dinamicamente o plugin de direções
    const MapboxDirections = await import('@mapbox/mapbox-gl-directions')

    const directions = new MapboxDirections.default({
      accessToken: config.public.mapboxKey,
      unit: 'metric',
      profile: 'mapbox/driving',
      language: 'pt-BR',
      controls: {
        instructions: true,
        profileSwitcher: true
      }
    })

    map.value.addControl(directions, 'top-left')

    // Definir destino automaticamente
    directions.setDestination(props.coordinates)

  } catch (err) {
    console.error('Erro ao carregar controle de direções:', err)
  }
}

// Função para abrir no aplicativo de mapas
const openInMaps = () => {
  if (!props.coordinates) return

  const [lng, lat] = props.coordinates
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  window.open(url, '_blank')
}

// Função para geocodificar endereço (se necessário)
const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${config.public.mapboxKey}&country=BR&language=pt`
    )

    const data = await response.json()

    if (data.features && data.features.length > 0) {
      return data.features[0].center
    }

    return null
  } catch (err) {
    console.error('Erro ao geocodificar endereço:', err)
    return null
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Se apenas o endereço for fornecido, geocodificar
  if (props.location && !props.coordinates) {
    const coords = await geocodeAddress(props.location)
    if (coords) {
      // Atualizar coordinates se necessário
      initializeMap()
    } else {
      error.value = 'Não foi possível encontrar o endereço especificado.'
      loading.value = false
    }
  } else {
    initializeMap()
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
}

/* Importar estilos do Mapbox GL JS */
@import 'mapbox-gl/dist/mapbox-gl.css';
</style>
