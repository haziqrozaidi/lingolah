<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@clerk/vue'
import Dropdown from 'primevue/dropdown'
import Toast from 'primevue/toast'
import AddToPlaylistModal from '@/components/video/AddToPlaylistModal.vue'
import { getVideosWithWatchStatus, getAllVideos, markVideoAsWatched } from '@/services/videoService'

const router = useRouter()
const { user } = useUser()
const videos = ref([]) 
const searchQuery = ref('')
const expandedCategories = ref({})

// Playlist modal state
const showPlaylistModal = ref(false)
const selectedVideoForPlaylist = ref(null)

// Fetch all videos from the API with watch status
onMounted(async () => {
  try {
    if (user.value?.id) {
      // Get videos with watch status for logged-in user
      videos.value = await getVideosWithWatchStatus(user.value.id)
    } else {
      // Get all videos without watch status for anonymous users
      videos.value = await getAllVideos()
    }
  } catch (error) {
    console.error('Error fetching videos:', error)
    // Fallback to basic video fetch
    try {
      const res = await fetch('http://localhost:3000/api/videos')
      videos.value = await res.json()
    } catch (fallbackError) {
      console.error('Fallback fetch also failed:', fallbackError)
    }
  }
})

// categorize videos by topic
const videoCategories = computed(() => {
  const categories = {}
  videos.value.forEach(video => {
    // Extract YouTube ID from the URL
    const youtubeId = video.url?.split('v=')[1]?.split('&')[0]

    // Add YouTube thumbnail
    const videoWithThumbnail = {
      ...video,
      thumbnail: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null
    }
    
    const topic = video.topic || 'Other'
    if (!categories[topic]) categories[topic] = []
    categories[topic].push(videoWithThumbnail)
  })
  
  return Object.entries(categories).map(([title, videos]) => ({ title, videos }))
})

// Function to sort videos array based on selected sort option
const sortVideos = (videos) => {
  if (!selectedSort.value) return videos

  const [field, direction] = selectedSort.value.split('_')
  
  return [...videos].sort((a, b) => {
    let valueA, valueB
    
    switch (field) {
      case 'createdAt':
        valueA = new Date(a.createdAt)
        valueB = new Date(b.createdAt)
        break
      case 'watchDate':
        // Put unwatched videos at the end when sorting by watch date
        if (!a.watched && !b.watched) return 0
        if (!a.watched) return 1
        if (!b.watched) return -1
        valueA = new Date(a.watchDate)
        valueB = new Date(b.watchDate)
        break
      case 'title':
        valueA = a.title.toLowerCase()
        valueB = b.title.toLowerCase()
        break
      default:
        return 0
    }
    
    if (direction === 'asc') {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0
    }
  })
}

// Filter categories according to the search and apply sorting
const filteredCategories = computed(() => {
  let categories = videoCategories.value

  // Filter by topic if selected
  if (selectedTopic.value) {
    categories = categories.filter(category => category.title === selectedTopic.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    categories = categories
      .map(category => {
        const filteredVideos = category.videos.filter(video =>
          video.title.toLowerCase().includes(query) ||
          (video.difficulty && video.difficulty.toLowerCase().includes(query))
        )
        return filteredVideos.length > 0 ? { ...category, videos: filteredVideos } : null
      })
      .filter(Boolean)
  }

  // Apply sorting to each category's videos
  if (selectedSort.value) {
    categories = categories.map(category => ({
      ...category,
      videos: sortVideos(category.videos)
    }))
  }

  return categories
})

// Prepare topics for CascadeSelect 
const topicOptions = computed(() =>
  Array.from(new Set(videos.value.map(v => v.topic || 'Other')))

    .filter(Boolean)
    .map(topic => ({ label: topic, value: topic }))

)

// Selected topic state
const selectedTopic = ref(null)

// Sorting state
const selectedSort = ref(null)
const sortOptions = ref([
  { label: 'Alphabetical (A-Z)', value: 'title_asc' },
  { label: 'Alphabetical (Z-A)', value: 'title_desc' },
  { label: 'Creation Date (Newest first)', value: 'createdAt_desc' },
  { label: 'Creation Date (Oldest first)', value: 'createdAt_asc' },
  { label: 'Recently Watched', value: 'watchDate_desc' },
  
])

// Function to toggle the expanded view of a category
const toggleCategoryExpand = (categoryTitle) => {
  expandedCategories.value[categoryTitle] = !expandedCategories.value[categoryTitle]
}

// Function to get the videos to display (limited or all)
const getVisibleVideos = (category) => {
  // If the category is expanded or has less than 5 videos, show all videos
  if (expandedCategories.value[category.title] || category.videos.length <= 4) {
    return category.videos
  }
  // Otherwise, limit to 4 videos
  return category.videos.slice(0, 4)
}

// Function to launch the video in the YoutubeLooper
const playVideo = async (videoId) => {
  // Get the corresponding video using the correct ID field
  const video = videos.value.find(v => v.id === videoId)

  // Extract YouTube ID from the URL
  const youtubeId = video?.url?.split('v=')[1]?.split('&')[0]
  
  if (youtubeId) {
    // Mark video as watched if user is logged in
    if (user.value?.id && video) {
      try {
        await markVideoAsWatched(user.value.id, video.id)
        // Update local state to reflect watched status
        const videoIndex = videos.value.findIndex(v => v.id === video.id)
        if (videoIndex !== -1) {
          videos.value[videoIndex].watched = true
          videos.value[videoIndex].watchDate = new Date()
        }
      } catch (error) {
        console.error('Error marking video as watched:', error)
      }
    }
    
    // Redirect to the YoutubeLooper with the YouTube ID as a parameter
    router.push({
      name: 'youtube-looper',
      query: { id: youtubeId }
    })
  } else {
    console.error('Unable to extract YouTube ID from video:', video)
  }
}

// Function to handle image loading errors
const handleImageError = (event) => {
  // If the image fails to load, use a placeholder
  event.target.src = 'https://placehold.co/320x180/e0e0e0/cccccc?text=No+Thumbnail'
}

// Function to show add to playlist modal
const showAddToPlaylist = (video) => {
  selectedVideoForPlaylist.value = video
  showPlaylistModal.value = true
}

// Function to close playlist modal
const closePlaylistModal = () => {
  showPlaylistModal.value = false
  selectedVideoForPlaylist.value = null
}
</script>

<template>
  <div class="video-library">
    <!-- Toast Component for notifications -->
    <Toast />
    
    <!-- Add to Playlist Modal -->
    <AddToPlaylistModal
      :video="selectedVideoForPlaylist"
      :show="showPlaylistModal"
      @close="closePlaylistModal"
    />
    
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Video Library</h1>
          <p class="text-gray-600 mt-1">Enhance your language skills with our curated video content</p>
        </div>
        <router-link
          to="/playlists"
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <i class="pi pi-list mr-2"></i>My Playlists
        </router-link>
      </div>
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
        <Dropdown
          v-model="selectedTopic"
          :options="topicOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Filter by topic"
          class="w-56"
          style="min-width: 180px"
          showClear
          dropdownIcon="pi pi-filter"
        />
        <Dropdown
          v-model="selectedSort"
          :options="sortOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Sort videos"
          class="w-56"
          style="min-width: 200px"
          showClear
          dropdownIcon="pi pi-sort-alt"
        />
      </div>
    </div>

    <!-- Video Categories with Grid Layout -->
    <div class="space-y-10">
      <section v-for="category in filteredCategories" :key="category.title" class="category-section">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">{{ category.title }}</h2>
          <!-- Show more/less button for categories with more than 4 videos -->
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
              <img 
                :src="video.thumbnail" 
                :alt="video.title" 
                class="w-full h-44 object-cover"
                @error="handleImageError"
              />
              
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
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-gray-800 font-medium line-clamp-2 flex-1" :title="video.title">
                  {{ video.title }}
                </h3>
                <div
                  v-if="video.watched"
                  class="ml-2 text-green-600 flex-shrink-0"
                  :title="`Watched on ${new Date(video.watchDate).toLocaleDateString()}`"
                >
                  <i class="pi pi-check-circle text-sm"></i>
                </div>
              </div>
              <div class="flex items-center justify-between mb-3">
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
                  @click.stop="playVideo(video.id)"
                  class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Watch <i class="pi pi-caret-right ml-1"></i>
                </button>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <button
                  @click.stop="showAddToPlaylist(video)"
                  class="flex-1 text-xs bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 px-2 py-1.5 rounded transition-colors flex items-center justify-center"
                >
                  <i class="pi pi-plus mr-1"></i>Add to Playlist
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
