<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">Create Community</h2>
    <form @submit.prevent="createCommunity">
      <div class="mb-3">
        <label class="block mb-1 font-medium">Community Name</label>
        <input v-model="name" required class="border rounded px-3 py-2 w-full" />
      </div>
      <div class="mb-3">
        <label class="block mb-1 font-medium">Established Date</label>
        <input v-model="establishedDate" type="date" required class="border rounded px-3 py-2 w-full" />
      </div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit" :disabled="loading">
        {{ loading ? 'Creating...' : 'Create Community' }}
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-600 mt-2">Community created successfully!</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSession } from '@clerk/vue'

const props = defineProps({
  userRole: {
    type: String,
    required: true
  }
})

const name = ref('')
const establishedDate = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const { session } = useSession()

async function createCommunity() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    if (props.userRole !== 'admin') {
      error.value = 'You are not authorized.'
      loading.value = false
      return
    }
    const token = await session.value.getToken()
    const res = await fetch('http://localhost:3000/api/community/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name.value,
        establishedDate: establishedDate.value
      }),
      credentials: 'include'
    })
    if (!res.ok) {
      const result = await res.json()
      error.value = result.error || 'Failed to create community'
      loading.value = false
      return
    }
    success.value = true
    name.value = ''
    establishedDate.value = ''
  } catch (e) {
    error.value = 'Failed to create community'
  }
  loading.value = false
}
</script>