<script setup>
import { ref, onMounted } from 'vue'

const videos = ref([])
const newVideo = ref({
  title: '',
  url: '',
  description: '',
  topic: '',
  subtitles: '',
})

const editingVideo = ref(null) // Holds the video being edited (or null)
const editForm = ref({})       // Holds the edit form data

// Fetch all videos from the backend
const fetchVideos = async () => {
  const res = await fetch('http://localhost:3000/api/videos')
  videos.value = await res.json()
}

// Add a new video
const addVideo = async () => {
  const res = await fetch('http://localhost:3000/api/videos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newVideo.value),
  })
  if (res.ok) {
    await fetchVideos()
    newVideo.value = { title: '', url: '', description: '', topic: '', subtitles: '' }
  }
}

// Start editing a video
const startEdit = (video) => {
  editingVideo.value = video
  editForm.value = { ...video }
}

// Cancel editing
const cancelEdit = () => {
  editingVideo.value = null
  editForm.value = {}
}

// Save changes to a video
const saveEdit = async () => {
  const res = await fetch(`http://localhost:3000/api/videos/${editingVideo.value.video_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editForm.value),
  })
  if (res.ok) {
    await fetchVideos()
    cancelEdit()
  }
}

// Delete a video
const deleteVideo = async (videoId) => {
  await fetch(`http://localhost:3000/api/videos/${videoId}`, { method: 'DELETE' })
  await fetchVideos()
}

onMounted(fetchVideos)
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">Admin Video Management</h1>

    <!-- Add Video Form -->
    <form @submit.prevent="addVideo" class="mb-8 space-y-3 bg-white p-4 rounded shadow">
      <input v-model="newVideo.title" placeholder="Title" class="border p-2 w-full" required />
      <input v-model="newVideo.url" placeholder="YouTube URL" class="border p-2 w-full" required />
      <input v-model="newVideo.topic" placeholder="Topic" class="border p-2 w-full" required />
      <input v-model="newVideo.subtitles" placeholder="Subtitles" class="border p-2 w-full" />
      <textarea
        v-model="newVideo.description"
        placeholder="Description"
        class="border p-2 w-full"
      ></textarea>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Add Video</button>
    </form>

    <!-- Video List -->
    <ul class="space-y-2">
      <li
        v-for="video in videos"
        :key="video.video_id"
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 rounded"
      >
        <div v-if="editingVideo && editingVideo.video_id === video.video_id" class="w-full">
          <!-- Edit Form -->
          <input v-model="editForm.title" placeholder="Title" class="border p-1 w-full mb-1" />
          <input v-model="editForm.url" placeholder="YouTube URL" class="border p-1 w-full mb-1" />
          <input v-model="editForm.topic" placeholder="Topic" class="border p-1 w-full mb-1" />
          <input v-model="editForm.subtitles" placeholder="Subtitles" class="border p-1 w-full mb-1" />
          <textarea v-model="editForm.description" placeholder="Description" class="border p-1 w-full mb-1"></textarea>
          <div class="flex gap-2 mt-1">
            <button @click="saveEdit" class="bg-green-600 text-white px-3 py-1 rounded" type="button">Save</button>
            <button @click="cancelEdit" class="bg-gray-400 text-white px-3 py-1 rounded" type="button">Cancel</button>
          </div>
        </div>
        <div v-else class="flex flex-col sm:flex-row sm:items-center w-full justify-between">
          <div>
            <strong>{{ video.title }}</strong>
            <span class="text-xs text-gray-500 ml-2">{{ video.topic }}</span>
          </div>
          <div class="flex gap-2 mt-2 sm:mt-0">
            <button @click="startEdit(video)" class="text-blue-600 hover:underline">Edit</button>
            <button @click="deleteVideo(video.video_id)" class="text-red-600 hover:underline">Delete</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
