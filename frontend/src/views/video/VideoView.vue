<script setup>
import { ref, computed } from 'vue'

// Dummy data for video categories
const videoCategories = ref([
  {
    id: 1,
    title: 'Daily Conversations',
    videos: [
      {
        id: 101,
        title: 'Ordering Food at a Restaurant',
        thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Restaurant',
        duration: '5:24',
        difficulty: 'Beginner',
      },
      {
        id: 102,
        title: 'Asking for Directions',
        thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Directions',
        duration: '4:12',
        difficulty: 'Beginner',
      },
      {
        id: 103,
        title: 'Shopping for Clothes',
        thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Shopping',
        duration: '6:45',
        difficulty: 'Beginner',
      },
      {
        id: 104,
        title: 'Making Small Talk',
        thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Small+Talk',
        duration: '7:18',
        difficulty: 'Intermediate',
      },
      {
        id: 105,
        title: "At the Doctor's Office",
        thumbnail: 'https://placehold.co/320x180/3b82f6/ffffff?text=Doctor',
        duration: '8:10',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    id: 2,
    title: 'News Clips',
    videos: [
      {
        id: 201,
        title: 'Daily News Digest',
        thumbnail: 'https://placehold.co/320x180/22c55e/ffffff?text=News',
        duration: '10:15',
        difficulty: 'Advanced',
      },
      {
        id: 202,
        title: 'Weather Forecast',
        thumbnail: 'https://placehold.co/320x180/22c55e/ffffff?text=Weather',
        duration: '3:45',
        difficulty: 'Intermediate',
      },
      {
        id: 203,
        title: 'Business Update',
        thumbnail: 'https://placehold.co/320x180/22c55e/ffffff?text=Business',
        duration: '7:30',
        difficulty: 'Advanced',
      },
      {
        id: 204,
        title: 'Sports Highlights',
        thumbnail: 'https://placehold.co/320x180/22c55e/ffffff?text=Sports',
        duration: '8:22',
        difficulty: 'Intermediate',
      },
    ],
  },
  {
    id: 3,
    title: 'Cultural Insights',
    videos: [
      {
        id: 301,
        title: 'Traditional Festivals',
        thumbnail: 'https://placehold.co/320x180/ef4444/ffffff?text=Festivals',
        duration: '12:30',
        difficulty: 'Intermediate',
      },
      {
        id: 302,
        title: 'Local Cuisine',
        thumbnail: 'https://placehold.co/320x180/ef4444/ffffff?text=Cuisine',
        duration: '9:45',
        difficulty: 'Beginner',
      },
      {
        id: 303,
        title: 'Family Traditions',
        thumbnail: 'https://placehold.co/320x180/ef4444/ffffff?text=Traditions',
        duration: '11:20',
        difficulty: 'Advanced',
      },
      {
        id: 304,
        title: 'Social Etiquette',
        thumbnail: 'https://placehold.co/320x180/ef4444/ffffff?text=Etiquette',
        duration: '8:15',
        difficulty: 'Intermediate',
      },
      {
        id: 305,
        title: 'Historical Landmarks',
        thumbnail: 'https://placehold.co/320x180/ef4444/ffffff?text=Landmarks',
        duration: '14:50',
        difficulty: 'Advanced',
      },
    ],
  },
  {
    id: 4,
    title: 'Grammar Lessons',
    videos: [
      {
        id: 401,
        title: 'Present Tense Explained',
        thumbnail: 'https://placehold.co/320x180/8b5cf6/ffffff?text=Present+Tense',
        duration: '7:15',
        difficulty: 'Beginner',
      },
      {
        id: 402,
        title: 'Past Tense Rules',
        thumbnail: 'https://placehold.co/320x180/8b5cf6/ffffff?text=Past+Tense',
        duration: '8:30',
        difficulty: 'Beginner',
      },
      {
        id: 403,
        title: 'Future Tense Usage',
        thumbnail: 'https://placehold.co/320x180/8b5cf6/ffffff?text=Future+Tense',
        duration: '6:45',
        difficulty: 'Intermediate',
      },
      {
        id: 404,
        title: 'Conditional Sentences',
        thumbnail: 'https://placehold.co/320x180/8b5cf6/ffffff?text=Conditionals',
        duration: '9:20',
        difficulty: 'Advanced',
      },
    ],
  },
])

// Search functionality
const searchQuery = ref('')

// Filtered categories based on search
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return videoCategories.value
  }
  
  const query = searchQuery.value.toLowerCase()
  
  return videoCategories.value.map(category => {
    // Filter videos within each category
    const filteredVideos = category.videos.filter(video => 
      video.title.toLowerCase().includes(query) || 
      video.difficulty.toLowerCase().includes(query)
    )
    
    // Return category with filtered videos if any match
    return filteredVideos.length > 0 ? {
      ...category,
      videos: filteredVideos
    } : null
  }).filter(Boolean) // Remove null categories (those with no matching videos)
})

// Function to handle video play
const playVideo = (videoId) => {
  console.log(`Playing video with ID: ${videoId}`)
  // Future implementation: video playback functionality
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
      <section v-for="category in filteredCategories" :key="category.id" class="category-section">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">{{ category.title }}</h2>
          <button class="text-blue-600 text-sm font-medium hover:text-blue-800">
            View All <i class="pi pi-arrow-right ml-1"></i>
          </button>
        </div>

        <!-- Grid Layout for Videos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <div
            v-for="video in category.videos"
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
