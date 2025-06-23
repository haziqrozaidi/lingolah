<script setup>
import { ref, computed, onMounted } from 'vue'

const videos = ref([]) 
const searchQuery = ref('')
// Nouvel état pour suivre les catégories développées
const expandedCategories = ref({})

// Fetch all videos from the API
onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/videos')
  videos.value = await res.json()
})

// categorize videos by topic
const videoCategories = computed(() => {
  const categories = {}
  videos.value.forEach(video => {
    const topic = video.topic || 'Other'
    if (!categories[topic]) categories[topic] = []
    categories[topic].push(video)
  })
  // Returns an array of objects { title, videos }
  return Object.entries(categories).map(([title, videos]) => ({ title, videos }))
})

// Filter categories according to the search
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) return videoCategories.value
  const query = searchQuery.value.toLowerCase()
  return videoCategories.value
    .map(category => {
      const filteredVideos = category.videos.filter(video =>
        video.title.toLowerCase().includes(query) ||
        (video.difficulty && video.difficulty.toLowerCase().includes(query))
      )
      return filteredVideos.length > 0 ? { ...category, videos: filteredVideos } : null
    })
    .filter(Boolean)
})

// Fonction pour basculer l'affichage complet d'une catégorie
const toggleCategoryExpand = (categoryTitle) => {
  expandedCategories.value[categoryTitle] = !expandedCategories.value[categoryTitle]
}

// Fonction pour obtenir les vidéos à afficher (limitées ou toutes)
const getVisibleVideos = (category) => {
  // Si la catégorie est développée ou s'il y a moins de 5 vidéos, afficher toutes les vidéos
  if (expandedCategories.value[category.title] || category.videos.length <= 4) {
    return category.videos
  }
  // Sinon, limiter à 4 vidéos
  return category.videos.slice(0, 4)
}

// Function to play a video (adapt as needed)
const playVideo = (videoId) => {
  console.log(`Playing video with ID: ${videoId}`)
}
</script>

<template>
  <div class="video-library">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Video Library</h1>
      <p class="text-gray-600 mt-1">Enhance your language skills with our curated video content</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-6 flex items-center space-x-4">
      <div class="relative flex-grow">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <i class="pi pi-search text-gray-400"></i>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search videos..."
          class="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="flex space-x-2">
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <i class="pi pi-filter mr-2"></i>Filter
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <i class="pi pi-sort-alt mr-2"></i>Sort
        </button>
      </div>
    </div>

    <!-- Video Categories with Grid Layout -->
    <div class="space-y-10">
      <section v-for="category in filteredCategories" :key="category.title" class="category-section">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">{{ category.title }}</h2>
          <!-- Bouton modifié pour basculer l'affichage -->
          <button 
            @click="toggleCategoryExpand(category.title)" 
            class="text-blue-600 text-sm font-medium hover:text-blue-800"
            v-if="category.videos.length > 4"
          >
            {{ expandedCategories[category.title] ? 'Show less' : 'Show more' }} 
            <i :class="expandedCategories[category.title] ? 'pi pi-arrow-up ml-1' : 'pi pi-arrow-down ml-1'"></i>
          </button>
        </div>

        <!-- Grid Layout for Videos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <div
            v-for="video in getVisibleVideos(category)"
            :key="video.id"
            class="video-card rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <!-- Thumbnail with Play Button Overlay -->
            <div class="relative group cursor-pointer" @click="playVideo(video.id)">
              <img :src="video.thumbnail" :alt="video.title" class="w-full h-44 object-cover" />
              <div
                class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div
                  class="w-14 h-14 rounded-full bg-blue-600 bg-opacity-90 flex items-center justify-center"
                >
                  <i class="pi pi-play text-white text-xl"></i>
                </div>
              </div>
              <div
                class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs font-medium py-1 px-2 rounded"
              >
                {{ video.duration }}
              </div>
            </div>

            <!-- Video Info -->
            <div class="p-4">
              <h3 class="text-gray-800 font-medium mb-2 line-clamp-2" :title="video.title">
                {{ video.title }}
              </h3>
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-medium rounded-full px-2 py-1"
                  :class="{
                    'bg-green-100 text-green-800': video.difficulty === 'Beginner',
                    'bg-yellow-100 text-yellow-800': video.difficulty === 'Intermediate',
                    'bg-red-100 text-red-800': video.difficulty === 'Advanced',
                  }"
                >
                  {{ video.difficulty }}
                </span>
                <button
                  @click="playVideo(video.id)"
                  class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Watch <i class="pi pi-caret-right ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    
    <!-- No results message -->
    <div v-if="filteredCategories.length === 0 && searchQuery" class="text-center py-12">
      <div class="text-gray-400 text-5xl mb-4">
        <i class="pi pi-search"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-700 mb-2">No videos found</h3>
      <p class="text-gray-500 mb-4">Try adjusting your search query or filters</p>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
