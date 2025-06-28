<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// PrimeVue composables
const toast = useToast()
const confirm = useConfirm()

// Reactive data
const videos = ref([])
const loading = ref(false)
const error = ref(null)

// Form data for adding new videos
const newVideo = ref({
  title: '',
  url: '',
  description: '',
  topic: '',
  subtitles: '',
})

// Editing state
const editingVideo = ref(null) // Currently editing video
const editForm = ref({})       // Form data for editing

// Fetch all videos from the backend API
const fetchVideos = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${API_URL}/api/videos`)
    if (!res.ok) throw new Error('Failed to fetch videos')
    videos.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Add a new video to the database
const addVideo = async () => {
  if (!newVideo.value.title || !newVideo.value.url) {
    toast.add({
      severity: 'warn',
      summary: 'Missing Information',
      detail: 'Title and URL are required!',
      life: 3000
    })
    return
  }
  
  try {
    const res = await fetch(`${API_URL}/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVideo.value),
    })
    
    if (res.ok) {
      await fetchVideos()
      // Reset form after successful addition
      newVideo.value = { title: '', url: '', description: '', topic: '', subtitles: '' }
      
      toast.add({
        severity: 'success',
        summary: 'Video Added',
        detail: 'Video added successfully!',
        life: 3000
      })
    } else {
      throw new Error('Failed to add video')
    }
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error adding video: ' + e.message,
      life: 5000
    })
  }
}

// Start editing a video by copying its data to the edit form
const startEdit = (video) => {
  editingVideo.value = video
  editForm.value = { ...video }
}

// Cancel editing and reset form
const cancelEdit = () => {
  editingVideo.value = null
  editForm.value = {}
}

// Save changes to the currently edited video
const saveEdit = async () => {
  try {
    const res = await fetch(`${API_URL}/api/videos/${editingVideo.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm.value),
    })
    
    if (res.ok) {
      await fetchVideos()
      cancelEdit()
      
      toast.add({
        severity: 'success',
        summary: 'Video Updated',
        detail: 'Video updated successfully!',
        life: 3000
      })
    } else {
      throw new Error('Failed to update video')
    }
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Update Failed',
      detail: 'Error updating video: ' + e.message,
      life: 5000
    })
  }
}

// Delete a video from the database with confirmation
const deleteVideo = async (videoId, videoTitle) => {
  confirm.require({
    message: `Are you sure you want to delete "${videoTitle}"? This action cannot be undone.`,
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancel',
    acceptLabel: 'Delete',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        const res = await fetch(`${API_URL}/api/videos/${videoId}`, { 
          method: 'DELETE' 
        })
        
        if (res.ok) {
          await fetchVideos()
          
          toast.add({
            severity: 'success',
            summary: 'Video Deleted',
            detail: 'Video deleted successfully!',
            life: 3000
          })
        } else {
          throw new Error('Failed to delete video')
        }
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Deletion Failed',
          detail: 'Error deleting video: ' + e.message,
          life: 5000
        })
      }
    },
    reject: () => {
      // User cancelled deletion - no action needed
    }
  })
}

// Initialize component by fetching videos on mount
onMounted(fetchVideos)
</script>

<template>  <div class="container mx-auto px-4 py-6">
    <!-- Toast Component for notifications -->
    <PrimeToast />
    
    <!-- Confirm Dialog Component -->
    <PrimeConfirmDialog />
    
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Video Management</h1>
      <p class="text-gray-600">Add, edit, and delete educational videos for learners</p>
    </div>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-500">Loading videos...</div>
    </div>
    
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      Error: {{ error }}
    </div>

    <!-- Add Video Form -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Add New Video</h2>
      <form @submit.prevent="addVideo" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input 
              v-model="newVideo.title" 
              placeholder="Enter video title" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              required 
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">YouTube URL *</label>
            <input 
              v-model="newVideo.url" 
              placeholder="https://www.youtube.com/watch?v=..." 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
              required 
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input 
              v-model="newVideo.topic" 
              placeholder="Enter topic (e.g., Grammar, Culture)" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subtitles</label>
            <input 
              v-model="newVideo.subtitles" 
              placeholder="Subtitle information" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="newVideo.description"
            placeholder="Describe what learners will gain from this video"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>
          <button 
          type="submit" 
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md transition-colors flex items-center"
        >
          <i class="pi pi-plus mr-2"></i>Add Video
        </button>
      </form>
    </div>

    <!-- Video List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Existing Videos ({{ videos.length }})</h2>
      </div>
      
      <div v-if="videos.length === 0" class="p-6 text-center text-gray-500">
        No videos found. Add your first video above!
      </div>
      
      <div v-else class="divide-y divide-gray-200">        <div
          v-for="video in videos"
          :key="video.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div v-if="editingVideo && editingVideo.id === video.id">
            <!-- Edit Form -->
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    v-model="editForm.title" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input 
                    v-model="editForm.url" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input 
                    v-model="editForm.topic" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Subtitles</label>
                  <input 
                    v-model="editForm.subtitles" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  v-model="editForm.description" 
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>
                <div class="flex gap-3">
                <button 
                  @click="saveEdit" 
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                >
                  <i class="pi pi-check mr-2"></i>Save
                </button>
                <button 
                  @click="cancelEdit" 
                  class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                >
                  <i class="pi pi-times mr-2"></i>Cancel
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="flex justify-between items-start">
            <!-- Video Info -->
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ video.title }}</h3>
              <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                <span v-if="video.topic" class="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {{ video.topic }}
                </span>
                <span class="text-gray-500">{{ video.url }}</span>
              </div>
              <p v-if="video.description" class="text-gray-700 text-sm">{{ video.description }}</p>
            </div>
              <!-- Action Buttons -->
            <div class="flex gap-2 ml-4">
              <button 
                @click="startEdit(video)" 
                class="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition-colors flex items-center"
              >
                <i class="pi pi-pencil mr-1"></i>Edit
              </button>
              <button 
                @click="deleteVideo(video.id, video.title)" 
                class="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition-colors flex items-center"
              >
                <i class="pi pi-trash mr-1"></i>Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
