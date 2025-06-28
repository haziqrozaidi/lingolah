<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import 'vue-plyr/dist/vue-plyr.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const route = useRoute()
const videoId = computed(() => route.query.id || 'bTqVqk7FSmY')
const videoData = ref(null) // To store video details

// Fetch video details from API
async function fetchVideoDetails() {
  try {
    // Get YouTube ID from route
    const youtubeId = route.query.id
    
    if (youtubeId) {
      // API call to fetch video details by YouTube ID
      const response = await fetch(`${API_URL}/api/videos/youtube/${youtubeId}`)
      
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

// Load details on mount
onMounted(() => {
  fetchVideoDetails()
})

// Reload details when ID changes
watch(() => route.query.id, () => {
  fetchVideoDetails()
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Use video title if available -->
    <h1 class="text-2xl font-bold text-gray-800 mb-2">
      {{ videoData?.title || 'YouTube Video' }}
    </h1>
    
    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
      <vue-plyr>
        <div data-plyr-provider="youtube" :data-plyr-embed-id="videoId"></div>
      </vue-plyr>
    </div>
    
    <!-- Display video description -->
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
