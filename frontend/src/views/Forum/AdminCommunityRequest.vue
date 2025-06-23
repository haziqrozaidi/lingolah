<template>
  <div class="max-w-3xl mx-auto py-8">
    <h2 class="text-2xl font-bold mb-6">Manage Community Join Requests</h2>
    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div v-if="feedback" class="mb-4 p-2 rounded bg-blue-100 text-blue-800">
        {{ feedback }}
      </div>
      <div v-if="communities.length === 0" class="text-gray-500">
        You do not manage any communities.
      </div>
      <div v-for="comm in communities" :key="comm.id" class="mb-8 border rounded-lg p-4 shadow-sm">
        <CommunityRequestsTable
          :community="comm"
          :members="pending[comm.id] || []"
          :onApprove="approve"
          :onReject="reject"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import CommunityRequestsTable from '@/components/Forum/CommunityRequestsTable.vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useSession } from '@clerk/vue'

const { session } = useSession()
const userStore = useUserStore()
const { userId } = storeToRefs(userStore)
const communities = ref([])
const pending = ref({})
const loading = ref(true)
const feedback = ref("")

// Fetch communities established by this admin (token is required)
const fetchAdminCommunities = async () => {
  const token = await session.value.getToken()
  const res = await fetch('http://localhost:3000/api/community/admin', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to fetch communities')
  const data = await res.json()
  return data.communities
}

const fetchPendingMembers = async (communityId) => {
  const token = await session.value.getToken()
  const res = await fetch(
    `http://localhost:3000/api/community/${communityId}/members?status=pending`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    }
  )
  if (!res.ok) throw new Error('Failed to fetch pending members')
  const data = await res.json()
  return data.members
}

const handleMemberAction = async (communityId, memberId, action) => {
  const token = await session.value.getToken()
  const url = `http://localhost:3000/api/community/${communityId}/members/${memberId}/${action}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Action failed')
  }
}

const approve = async (memberId, communityId) => {
  loading.value = true
  feedback.value = ""
  try {
    await handleMemberAction(communityId, memberId, 'approve')
    pending.value[communityId] = pending.value[communityId].filter(m => m.userId !== memberId)
    feedback.value = 'Member approved.'
  } catch (err) {
    feedback.value = 'Error: ' + err.message
  }
  loading.value = false
}
const reject = async (memberId, communityId) => {
  loading.value = true
  feedback.value = ""
  try {
    await handleMemberAction(communityId, memberId, 'reject')
    pending.value[communityId] = pending.value[communityId].filter(m => m.userId !== memberId)
    feedback.value = 'Member rejected.'
  } catch (err) {
    feedback.value = 'Error: ' + err.message
  }
  loading.value = false
}

onMounted(async () => {
  loading.value = true
  try {
    const comms = await fetchAdminCommunities()
    communities.value = comms
    for (const comm of comms) {
      pending.value[comm.id] = await fetchPendingMembers(comm.id)
    }
  } catch (err) {
    feedback.value = 'Error loading: ' + err.message
  }
  loading.value = false
})
</script>