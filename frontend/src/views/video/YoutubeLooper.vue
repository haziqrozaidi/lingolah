<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import 'vue-plyr/dist/vue-plyr.css'

const route = useRoute()

// 
const videoId = computed(() => route.query.id || 'bTqVqk7FSmY')

// Watch for route changes
onMounted(() => {
  console.log('Loaded Youtube ID:', videoId.value)
})

// Watch for route changes for debugging
watch(() => route.query.id, (newId) => {
  console.log('New Youtube ID:', newId)
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">YouTube Looper</h1>

    <div class="bg-white rounded-lg shadow-md p-4">
      <vue-plyr>
        <div data-plyr-provider="youtube" :data-plyr-embed-id="videoId"></div>
      </vue-plyr>
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
