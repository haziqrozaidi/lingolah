<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useUser } from '@clerk/vue'
import { 
  getUserPlaylists, 
  createPlaylist, 
  updatePlaylist, 
  deletePlaylist
} from '@/services/playlistService'

const { user } = useUser()
const toast = useToast()
const confirm = useConfirm()

// Reactive data
const playlists = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const newPlaylistTitle = ref('')
const editingPlaylist = ref(null)
const editPlaylistTitle = ref('')

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

// Create new playlist
const handleCreatePlaylist = async () => {
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
    await createPlaylist(user.value.id, newPlaylistTitle.value.trim())
    await loadPlaylists()
    
    showCreateModal.value = false
    newPlaylistTitle.value = ''
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Playlist created successfully',
      life: 3000
    })  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create playlist',
      life: 3000
    })
  }
}

// Start editing playlist
const startEditPlaylist = (playlist) => {
  editingPlaylist.value = playlist
  editPlaylistTitle.value = playlist.title
  showEditModal.value = true
}

// Save playlist changes
const handleUpdatePlaylist = async () => {
  if (!editPlaylistTitle.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please enter a playlist title',
      life: 3000
    })
    return
  }
  
  try {
    await updatePlaylist(editingPlaylist.value.id, editPlaylistTitle.value.trim())
    await loadPlaylists()
    
    showEditModal.value = false
    editingPlaylist.value = null
    editPlaylistTitle.value = ''
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Playlist updated successfully',
      life: 3000
    })  } catch {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update playlist',
      life: 3000
    })
  }
}

// Delete playlist with confirmation
const handleDeletePlaylist = (playlist) => {
  confirm.require({
    message: `Are you sure you want to delete "${playlist.title}"? This action cannot be undone.`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await deletePlaylist(playlist.id)
        await loadPlaylists()
        
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Playlist deleted successfully',
          life: 3000
        })      } catch {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete playlist',
          life: 3000
        })
      }
    }
  })
}

// Cancel modals
const cancelCreate = () => {
  showCreateModal.value = false
  newPlaylistTitle.value = ''
}

const cancelEdit = () => {
  showEditModal.value = false
  editingPlaylist.value = null
  editPlaylistTitle.value = ''
}

// Computed
const totalVideos = computed(() => {
  return playlists.value.reduce((total, playlist) => total + playlist.videos.length, 0)
})

// Initialize
onMounted(() => {
  if (user.value?.id) {
    loadPlaylists()
  }
})
</script>

<template>
  <div class="playlist-manager">
    <!-- Toast and Confirm Dialog -->
    <PrimeToast />
    <PrimeConfirmDialog />
    
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">My Playlists</h1>
          <p class="text-gray-600 mt-1">Create and manage your personal video collections</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center"
        >
          <i class="pi pi-plus mr-2"></i>New Playlist
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="bg-purple-100 p-2 rounded-lg">
            <i class="pi pi-list text-purple-600 text-xl"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Total Playlists</p>
            <p class="text-2xl font-bold text-gray-900">{{ playlists.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="bg-blue-100 p-2 rounded-lg">
            <i class="pi pi-video text-blue-600 text-xl"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Total Videos</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalVideos }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center">
          <div class="bg-green-100 p-2 rounded-lg">
            <i class="pi pi-clock text-green-600 text-xl"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Recently Updated</p>
            <p class="text-2xl font-bold text-gray-900">{{ playlists.filter(p => p.videos.length > 0).length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <i class="pi pi-spinner pi-spin text-2xl text-gray-400"></i>
      <p class="text-gray-500 mt-2">Loading playlists...</p>
    </div>

    <!-- Playlists Grid -->
    <div v-else-if="playlists.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="playlist in playlists"
        :key="playlist.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ playlist.title }}</h3>
              <p class="text-sm text-gray-500">{{ playlist.videos.length }} videos</p>
            </div>
            <div class="flex space-x-1">
              <button
                @click="startEditPlaylist(playlist)"
                class="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                title="Edit playlist"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                @click="handleDeletePlaylist(playlist)"
                class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                title="Delete playlist"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
          
          <!-- Playlist Preview -->
          <div class="space-y-2 mb-4">            <div
              v-for="item in playlist.videos.slice(0, 3)"
              :key="item.video.id"
              class="flex items-center text-sm text-gray-600"
            >
              <i class="pi pi-video mr-2 text-gray-400"></i>
              <span class="truncate">{{ item.video.title }}</span>
            </div>
            <div v-if="playlist.videos.length > 3" class="text-xs text-gray-500 ml-6">
              +{{ playlist.videos.length - 3 }} more videos
            </div>
          </div>
            <div class="flex items-center justify-between text-xs text-gray-500">
            <span>Created {{ new Date(playlist.createdAt).toLocaleDateString() }}</span>
            <router-link
              :to="`/playlists/${playlist.id}`"
              class="text-purple-600 hover:text-purple-800 font-medium"
            >
              View →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">
        <i class="pi pi-list"></i>
      </div>
      <h3 class="text-xl font-medium text-gray-700 mb-2">No playlists yet</h3>
      <p class="text-gray-500 mb-6">Create your first playlist to organize your favorite videos</p>
      <button
        @click="showCreateModal = true"
        class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
      >
        <i class="pi pi-plus mr-2"></i>Create First Playlist
      </button>
    </div>

    <!-- Create Playlist Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Create New Playlist</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Playlist Title</label>
          <input
            v-model="newPlaylistTitle"
            type="text"
            placeholder="Enter playlist title..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            @keyup.enter="handleCreatePlaylist"
          />
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelCreate"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleCreatePlaylist"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Playlist Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Edit Playlist</h2>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Playlist Title</label>
          <input
            v-model="editPlaylistTitle"
            type="text"
            placeholder="Enter playlist title..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            @keyup.enter="handleUpdatePlaylist"
          />
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelEdit"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleUpdatePlaylist"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Save
          </button>
        </div>
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
