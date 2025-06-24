<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import 'vue-plyr/dist/vue-plyr.css'

const route = useRoute()
const videoId = computed(() => route.query.id || 'bTqVqk7FSmY')
const videoData = ref(null) // Pour stocker les détails de la vidéo

// Récupérer les détails de la vidéo depuis l'API
async function fetchVideoDetails() {
  try {
    // Récupérer l'ID YouTube depuis la route
    const youtubeId = route.query.id
    
    if (youtubeId) {
      // Appel à l'API pour récupérer les détails de la vidéo par ID YouTube
      const response = await fetch(`http://localhost:3000/api/videos/youtube/${youtubeId}`)
      
      if (response.ok) {
        videoData.value = await response.json()
        console.log('Video details loaded:', videoData.value)
      } else {
        console.error('Failed to load video details')
      }
    }
  } catch (error) {
    console.error('Error fetching video details:', error)
  }
}

// Charger les détails au montage
onMounted(() => {
  fetchVideoDetails()
})

// Recharger les détails quand l'ID change
watch(() => route.query.id, () => {
  fetchVideoDetails()
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Utiliser le titre de la vidéo s'il est disponible -->
    <h1 class="text-2xl font-bold text-gray-800 mb-2">
      {{ videoData?.title || 'YouTube Video' }}
    </h1>
    
    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
      <vue-plyr>
        <div data-plyr-provider="youtube" :data-plyr-embed-id="videoId"></div>
      </vue-plyr>
    </div>
    
    <!-- Afficher la description de la vidéo -->
    <div v-if="videoData?.description" class="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 class="text-lg font-semibold mb-2">Description</h2>
      <p class="text-gray-700 whitespace-pre-line">{{ videoData.description }}</p>
    </div>
    
    <div class="mt-4">
      <button @click="$router.back()" class="px-4 py-2 bg-blue-600 text-white rounded-lg">
        Back to Video Library
      </button>
    </div>
  </div>
</template>

<style>
h1.youtube-looper-text {
  color: green;
}
</style>
