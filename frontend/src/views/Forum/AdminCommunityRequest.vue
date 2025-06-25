<template>
  <div class="max-w-7xl mx-auto py-10 px-2 w-full">
    <!-- Header Section -->
    <section class="mb-8">
      <h2 class="text-3xl font-bold mb-2 text-blue-800 flex items-center gap-2">
        <i class="pi pi-users text-blue-700"></i>
        Manage Community Join Requests
      </h2>
      <div class="h-1 w-20 bg-blue-400 rounded mb-2"></div>
      <p class="text-gray-500 mb-2">Approve or reject pending join requests for your managed communities.</p>
    </section>
    <!-- Loading Spinner -->
    <div v-if="loading" class="flex justify-center items-center min-h-[200px]">
      <ProgressSpinner />
    </div>
    <div v-else>
      <!-- Feedback Section -->
      <section v-if="feedback" class="mb-4">
        <div class="p-3 rounded bg-blue-100 text-blue-800 border border-blue-200">
          {{ feedback }}
        </div>
      </section>
      <!-- No Community Section -->
      <section v-if="communities.length === 0" class="mb-8">
        <div class="bg-white border border-gray-200 rounded-lg p-6 text-gray-500 shadow text-center">
          You do not manage any communities.
        </div>
      </section>
      <!-- Community Selector Section -->
      <section v-else class="mb-10">
        <h3 class="text-lg font-semibold mb-4 text-blue-700 flex items-center gap-2">
          <i class="pi pi-list text-blue-600"></i>
          Select a Community
        </h3>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div class="flex-1"></div>
          <Paginator
            :rows="pageSize"
            :totalRecords="communities.length"
            :first="(currentPage - 1) * pageSize"
            @page="onPage"
            template="PrevPageLink PageLinks NextPageLink"
            class="!w-auto"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          <button
            v-for="comm in pagedCommunities"
            :key="comm.id"
            @click="openModal(comm)"
            class="w-full px-4 py-4 rounded border border-gray-300 shadow-sm bg-white hover:bg-blue-50 font-medium transition-colors duration-150 focus:outline-none flex items-center justify-between gap-2"
            :class="{ 'ring-2 ring-blue-400': selectedCommunity && selectedCommunity.id === comm.id }"
          >
            <span class="flex items-center gap-2">
              <i class="pi pi-hashtag text-blue-700"></i>
              {{ comm.name }}
            </span>
            <span class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200">
              {{ pending[comm.id]?.length ?? 0 }} pending
            </span>
          </button>
        </div>
      </section>
      <!-- Requests Modal/Table Section -->
      <section>
        <CommunityRequestsTable
          v-if="selectedCommunity"
          :community="selectedCommunity"
          :members="pending[selectedCommunity.id] || []"
          :visible="!!selectedCommunity"
          :onApprove="approve"
          :onReject="reject"
          @close="selectedCommunity = null"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'
import CommunityRequestsTable from '@/components/Forum/CommunityRequestsTable.vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useSession } from '@clerk/vue'
import Paginator from 'primevue/paginator'

const { session } = useSession()
const userStore = useUserStore()
const { userId } = storeToRefs(userStore)
const communities = ref([])
const pending = ref({})
const loading = ref(true)
const feedback = ref("")
const selectedCommunity = ref(null)

// Pagination state for community selection
const pageSize = 6
const currentPage = ref(1)
const pagedCommunities = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return communities.value.slice(start, start + pageSize)
})
function onPage(event) {
  currentPage.value = Math.floor(event.first / pageSize) + 1
}

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

function openModal(comm) {
  selectedCommunity.value = comm
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

<style scoped>
.grid {
  width: 100%;
}
button.w-full {
  min-height: 80px;
}
</style>