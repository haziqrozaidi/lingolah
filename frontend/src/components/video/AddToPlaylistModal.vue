<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useUser } from '@clerk/vue'
import { getUserPlaylists, addVideoToPlaylist, createPlaylist } from '@/services/playlistService'

const props = defineProps({
  video: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'added'])

const { user } = useUser()
const toast = useToast()

const playlists = ref([])
const loading = ref(false)
const showCreateForm = ref(false)
const newPlaylistTitle = ref('')

// Load user playlists
const loadPlaylists = async () => {
  if (!user.value?.id) return
  
  loading.value = true
  try {
    playlists.value = await getUserPlaylists(user.value.id)
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load playlists',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Add video to playlist
const addToPlaylist = async (playlistId) => {
  try {
    await addVideoToPlaylist(playlistId, props.video.id)
    
    toast.add({
      severity: 'success',
      summary: 'Added to Playlist',
      detail: 'Video added to playlist successfully',
      life: 3000
    })
    
    emit('added')
    emit('close')
  } catch (error) {
    const message = error.message === 'Video already in playlist' 
      ? 'This video is already in that playlist'
      : 'Failed to add video to playlist'
      
    toast.add({
      severity: 'warn',
      summary: 'Cannot Add Video',
      detail: message,
      life: 3000
    })
  }
}

// Create new playlist and add video
const createAndAddToPlaylist = async () => {
  if (!newPlaylistTitle.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please enter a playlist title',
      life: 3000
    })
    return
  }
  
  try {
    const newPlaylist = await createPlaylist(user.value.id, newPlaylistTitle.value.trim())
    await addVideoToPlaylist(newPlaylist.id, props.video.id)
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Playlist created and video added successfully',
      life: 3000
    })
    
    emit('added')
    emit('close')
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create playlist',
      life: 3000
    })
  }
}

// Close modal
const closeModal = () => {
  showCreateForm.value = false
  newPlaylistTitle.value = ''
  emit('close')
}

// Initialize
onMounted(() => {
  if (props.show && user.value?.id) {
    loadPlaylists()
  }
})

// Watch for show prop changes
import { watch } from 'vue'
watch(() => props.show, (newValue) => {
  if (newValue && user.value?.id) {
    loadPlaylists()
  }
})
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[32rem] flex flex-col">
      <!-- Header - Fixed -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Add to Playlist</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <i class="pi pi-times text-lg"></i>
          </button>
        </div>
        
        <!-- Video Info -->
        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
          <img 
            :src="video.thumbnail || 'https://placehold.co/80x60/e0e0e0/cccccc?text=Video'"
            :alt="video.title"
            class="w-12 h-9 rounded object-cover mr-3"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">{{ video.title }}</p>
            <p class="text-xs text-gray-500">{{ video.topic }}</p>
          </div>
        </div>
      </div>

      <!-- Content - Scrollable -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <i class="pi pi-spinner pi-spin text-2xl text-gray-400"></i>
          <p class="text-gray-500 mt-2">Loading playlists...</p>
        </div>

        <!-- Create New Playlist Form -->
        <div v-else-if="showCreateForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">New Playlist Title</label>
            <input
              v-model="newPlaylistTitle"
              type="text"
              placeholder="Enter playlist title..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              @keyup.enter="createAndAddToPlaylist"
            />
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="showCreateForm = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="createAndAddToPlaylist"
              class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Create & Add
            </button>
          </div>
        </div>

        <!-- Playlist Selection -->
        <div v-else class="space-y-4">
          <!-- Existing Playlists -->
          <div v-if="playlists.length > 0" class="space-y-2">
            <button
              v-for="playlist in playlists"
              :key="playlist.id"
              @click="addToPlaylist(playlist.id)"
              class="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-800">{{ playlist.title }}</p>
                  <p class="text-sm text-gray-500">{{ playlist.videos.length }} videos</p>
                </div>
                <i class="pi pi-plus text-purple-600"></i>
              </div>
            </button>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-6">
            <i class="pi pi-list text-3xl text-gray-400 mb-2"></i>
            <p class="text-gray-500 mb-4">No playlists yet</p>
          </div>
        </div>
      </div>

      <!-- Footer - Fixed (Create New Playlist Button) -->
      <div v-if="!loading && !showCreateForm" class="p-6 border-t border-gray-200">
        <button
          @click="showCreateForm = true"
          class="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors"
        >
          <i class="pi pi-plus mr-2"></i>Create New Playlist
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
