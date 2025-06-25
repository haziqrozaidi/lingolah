<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useUser } from '@clerk/vue'
import { getPlaylist, getPlaylistWithWatchStatus, removeVideoFromPlaylist } from '@/services/playlistService'
import { markVideoAsWatched } from '@/services/videoService'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useConfirm()
const { user } = useUser()

const playlist = ref(null)
const loading = ref(false)

// Load playlist details
const loadPlaylist = async () => {
  loading.value = true
  try {
    // Use playlist with watch status if user is logged in
    if (user.value?.id) {
      playlist.value = await getPlaylistWithWatchStatus(route.params.id, user.value.id)
    } else {
      playlist.value = await getPlaylist(route.params.id)
    }
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load playlist',
      life: 3000
    })
    router.push('/playlists')
  } finally {
    loading.value = false
  }
}

// Play video
const playVideo = async (video) => {
  const youtubeId = video.url?.split('v=')[1]?.split('&')[0]
  
  if (youtubeId) {
    // Mark video as watched if user is logged in
    if (user.value?.id) {
      try {
        await markVideoAsWatched(user.value.id, video.id)
        // Reload playlist to update watched status
        await loadPlaylist()
      } catch (error) {
        console.error('Error marking video as watched:', error)
      }
    }
    
    router.push({
      name: 'youtube-looper',
      query: { id: youtubeId }
    })
  } else {
    console.error('Unable to extract YouTube ID from video:', video)
  }
}

// Remove video from playlist
const removeVideo = (video) => {
  confirm.require({
    message: `Remove "${video.title}" from this playlist?`,
    header: 'Confirm Removal',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Remove',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await removeVideoFromPlaylist(playlist.value.id, video.id)
        await loadPlaylist() // Reload playlist
        
        toast.add({
          severity: 'success',
          summary: 'Video Removed',
          detail: 'Video removed from playlist successfully',
          life: 3000
        })
      } catch {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to remove video from playlist',
          life: 3000
        })
      }
    }
  })
}

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/320x180/e0e0e0/cccccc?text=No+Thumbnail'
}

// Initialize
onMounted(loadPlaylist)
</script>

<template>
  <div class="playlist-detail">
    <!-- Toast and Confirm Dialog -->
    <PrimeToast />
    <PrimeConfirmDialog />
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <i class="pi pi-spinner pi-spin text-3xl text-gray-400"></i>
      <p class="text-gray-500 mt-2">Loading playlist...</p>
    </div>

    <!-- Playlist Content -->
    <div v-else-if="playlist" class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div class="flex items-center space-x-4">
          <router-link
            to="/playlists"
            class="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            <i class="pi pi-arrow-left text-lg"></i>
          </router-link>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">{{ playlist.title }}</h1>
            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span>{{ playlist.videos.length }} videos</span>
              <span>•</span>
              <span>Created {{ new Date(playlist.createdAt).toLocaleDateString() }}</span>
              <span>•</span>
              <span>by {{ playlist.user.username }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Videos -->
      <div v-if="playlist.videos.length > 0" class="space-y-6">
        <!-- Videos Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="(item, index) in playlist.videos"
            :key="item.video.id"
            class="video-card rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
          >            <!-- Thumbnail with Play Button Overlay -->
            <div class="relative group cursor-pointer" @click="playVideo(item.video)">
              <img 
                :src="`https://img.youtube.com/vi/${item.video.url?.split('v=')[1]?.split('&')[0]}/hqdefault.jpg`"
                :alt="item.video.title" 
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
              
              <!-- Video Index -->
              <div
                class="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-medium py-1 px-2 rounded"
              >
                {{ index + 1 }}
              </div>
            </div>            <!-- Video Info -->
            <div class="p-4">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-gray-800 font-medium line-clamp-2 flex-1" :title="item.video.title">
                  {{ item.video.title }}
                </h3>
                <div
                  v-if="item.video.watched"
                  class="ml-2 text-green-600 flex-shrink-0"
                  :title="`Watched on ${new Date(item.video.watchDate).toLocaleDateString()}`"
                >
                  <i class="pi pi-check-circle text-sm"></i>
                </div>
              </div>
              
              <div class="flex items-center justify-between mb-3">
                <span
                  v-if="item.video.topic"
                  class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                >
                  {{ item.video.topic }}
                </span>
                <button
                  @click.stop="playVideo(item.video)"
                  class="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Watch <i class="pi pi-caret-right ml-1"></i>
                </button>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <button
                  @click.stop="removeVideo(item.video)"
                  class="flex-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 px-2 py-1.5 rounded transition-colors flex items-center justify-center"
                >
                  <i class="pi pi-trash mr-1"></i>Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">
          <i class="pi pi-video"></i>
        </div>
        <h3 class="text-xl font-medium text-gray-700 mb-2">No videos in this playlist</h3>
        <p class="text-gray-500 mb-6">Start adding videos to build your collection</p>
        <router-link
          to="/video"
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors inline-flex items-center"
        >
          <i class="pi pi-plus mr-2"></i>Browse Videos
        </router-link>
      </div>
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
