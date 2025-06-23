<template>
  <aside>
    <h2 class="font-semibold mb-4">Joined Communities</h2>
    <div class="flex flex-col gap-2 mb-4">
      <!-- General Button -->
      <button
        :class="buttonClass(selectedCommunity && selectedCommunity.id === 'general')"
        @click="selectCommunity({ id: 'general', name: 'General' })"
      >
        General
      </button>
      <!-- Community Buttons -->
      <button
        v-for="community in joinedCommunities"
        :key="community.id"
        :class="buttonClass(selectedCommunity && selectedCommunity.id === community.id)"
        @click="selectCommunity(community)"
      >
        {{ community.name }}
      </button>
    </div>
    <p v-if="joinedCommunities.length == 0"  class="text-gray-500 mb-4">No joined communities.</p>

    <h2 class="font-semibold mt-6 mb-4">Available Communities</h2>
    <ul v-if="availableCommunities.length">
      <li v-for="community in availableCommunities" :key="community.id" class="flex items-center justify-between mb-2">
        <span>{{ community.name }}</span>
        <button @click="joinCommunity(community.id)"
          class="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Join
        </button>
      </li>
    </ul>
    <p v-else class="text-gray-500">No communities available to join.</p>
  </aside>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  selectedCommunity: {
    type: Object,
    default: null
  }
})

const joinedCommunities = ref([])
const availableCommunities = ref([])
const isJoining = ref(false)
const emit = defineEmits(['community-selected'])

const fetchCommunities = async () => {
  if (!props.userId) return
  // Fetch joined communities
  let res = await fetch(`http://localhost:3000/api/community/joined?clerkUserId=${props.userId}`)
  let data = await res.json()
  joinedCommunities.value = data.communities || []
  // Fetch available communities
  res = await fetch(`http://localhost:3000/api/community/available?clerkUserId=${props.userId}`)
  data = await res.json()
  availableCommunities.value = data.communities || []
}

const joinCommunity = async (communityId) => {
  if (isJoining.value) return
  isJoining.value = true
  try {
    const res = await fetch('http://localhost:3000/api/community/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        communityId,
        clerkUserId: props.userId
      })
    })
    if (!res.ok) {
      const err = await res.json()
      alert(err.error || 'Failed to join community')
    }
    await fetchCommunities()
  } catch (e) {
    alert('Network error: ' + e.message)
  } finally {
    isJoining.value = false
  }
}

const selectCommunity = (community) => {
  emit('community-selected', community)
}

// Styling class helper
const buttonClass = (isActive) =>
  [
    "w-full text-left px-4 py-2 rounded font-semibold transition-colors focus:outline-none",
    isActive
      ? "bg-blue-500 text-white shadow"
      : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
  ].join(" ")

onMounted(fetchCommunities)
watch(() => props.userId, fetchCommunities)
</script>