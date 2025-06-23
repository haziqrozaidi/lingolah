<template>
  <div class="max-w-2xl mx-auto py-8">
    <h2 class="text-2xl font-bold mb-6">Delete a Community</h2>
    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div v-if="feedback" :class="{
            'text-green-600': feedbackType === 'success',
            'text-red-600': feedbackType === 'error'
          }" class="mb-4">{{ feedback }}</div>
      <div v-if="communities.length === 0" class="text-gray-500">
        You do not manage any communities.
      </div>
      <ul v-else class="space-y-4">
        <li v-for="comm in communities" :key="comm.id" class="flex items-center justify-between border p-4 rounded">
          <span class="font-semibold">{{ comm.name }}</span>
          <button
            class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            @click="confirmDelete(comm)"
            :disabled="deletingId === comm.id"
          >
            {{ deletingId === comm.id ? "Deleting..." : "Delete" }}
          </button>
        </li>
      </ul>
    </div>
    <Dialog v-model:visible="showConfirm" modal header="Confirm Delete" :closable="false">
      <div>Are you sure you want to delete <b>{{ toDelete?.name }}</b>? This action cannot be undone.</div>
      <template #footer>
        <button class="px-3 py-1 rounded bg-gray-300 mr-2" @click="showConfirm = false">Cancel</button>
        <button class="px-3 py-1 rounded bg-red-600 text-white" @click="deleteCommunity">Yes, Delete</button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSession } from '@clerk/vue'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'

const { session } = useSession()
const communities = ref([])
const loading = ref(true)
const feedback = ref('')
const feedbackType = ref('success')
const deletingId = ref(null)
const showConfirm = ref(false)
const toDelete = ref(null)

const fetchCommunities = async () => {
  loading.value = true
  feedback.value = ''
  try {
    const token = await session.value.getToken()
    const res = await fetch('http://localhost:3000/api/community/admin', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch communities')
    const data = await res.json()
    communities.value = data.communities
  } catch (e) {
    feedback.value = 'Could not load communities'
    feedbackType.value = 'error'
  }
  loading.value = false
}

const confirmDelete = (comm) => {
  toDelete.value = comm
  showConfirm.value = true
}

const deleteCommunity = async () => {
  if (!toDelete.value) return
  deletingId.value = toDelete.value.id
  showConfirm.value = false
  feedback.value = ''
  feedbackType.value = 'success'
  try {
    const token = await session.value.getToken()
    const res = await fetch(`http://localhost:3000/api/community/${toDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed to delete community')
    }
    feedback.value = `Community "${toDelete.value.name}" deleted.`
    feedbackType.value = 'success'
    communities.value = communities.value.filter(c => c.id !== toDelete.value.id)
  } catch (e) {
    feedback.value = e.message
    feedbackType.value = 'error'
  }
  deletingId.value = null
  toDelete.value = null
}

onMounted(fetchCommunities)
</script>